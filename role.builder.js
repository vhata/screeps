var roleBuilder = {

  /** @param {Creep} creep **/
  run: function(creep) {

    if(creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
    }

    if(creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if(targets.length) {
        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }
      else {
        var torepair = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_WALL && structure.hits < 10000) ||
            (structure.structureType == STRUCTURE_RAMPART && structure.hits < 1000)
          }
        });

        if(torepair.length > 0) {
          if(creep.repair(torepair[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(torepair[0]);
          }
        }
      }
    }
    else {
      var source = creep.pos.findClosestByPath(FIND_SOURCES);
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  }
};

module.exports = roleBuilder;

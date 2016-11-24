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
      var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if(target) {
        if(creep.build(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
      else {
        var torepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_WALL && structure.hits < 10000) ||
            (structure.structureType == STRUCTURE_RAMPART && structure.hits < 10000)
          }
        });

        if(torepair) {
          if(creep.repair(torepair) == ERR_NOT_IN_RANGE) {
            creep.moveTo(torepair);
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

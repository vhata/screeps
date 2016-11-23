  var roles = {
    'harvester': {
      'num': 8,
      'shape': [WORK,WORK,CARRY,MOVE,MOVE],
      //'shape': [WORK,CARRY,MOVE],
    },
    'upgrader': {
      'num': 8,
      'shape': [WORK,WORK,CARRY,MOVE,MOVE],
      //'shape': [WORK,CARRY,MOVE],
    },
    'builder': {
      'num': 1,
      'shape': [WORK,WORK,CARRY,MOVE,MOVE],
      //'shape': [WORK,CARRY,MOVE],
    },
  };
for(var role in roles) {
  roles[role]['module'] = require('role.' + role);
}

function list_creeps() {
  creep_list = ""
  for(var role in roles) {
    var role_creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    creep_list += "Creeps with role " + role + ":";
    creep_list += _.map(role_creeps,
      (c) => " " + c.name + "[" + _.map(c.body, (body) => body.type[0]) + "]"
    ) + "\n";
  }
  return creep_list;
}

module.exports.loop = function () {
  spawn = Game.spawns['Spawn1'];
  spawn.memory.rrole = roles;
  Game.list_creeps = list_creeps;

  // clean out dead memory
  for(var name in Memory.creeps) {
      if(!Game.creeps[name]) { delete Memory.creeps[name]; }
  }

  for(var role in roles) {
    var role_creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    if(role_creeps.length < roles[role].num) {
      if(spawn.canCreateCreep(roles[role].shape) == OK) {
        console.log("Spawning new creep of type " + role);
        spawn.createCreep(roles[role].shape, undefined, {role: role});
      }
    }
  }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var creep_role = creep.memory.role;
        if(roles[creep_role]) {
          roles[creep_role].module.run(creep);
        }
    }
}
/*
// Using Memory.creeps
_(Memory.creeps).filter( { role: 'x' } ).size();

// or using Game.creeps:
_(Game.creeps).filter( { memory: { role: 'x' } } ).size();

// tower of power
    var tower = Game.getObjectById('8ec71c4181484500e9f0c0d3');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    Game.spawns['Spawn1'].room.createConstructionSite( 23, 22, STRUCTURE_EXTENSION );
    STRUCTURE_EXTENSION

    Game.spawns['Spawn1'].createCreep( [WORK,WORK,CARRY,MOVE], undefined, {role:'builder'});


        'HarvesterBig',
        { role: 'harvester' } );
    Game.spawns['Spawn1'].createCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
        'HarvesterBig',
        { role: 'harvester' } );

        [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]
*/

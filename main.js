var roles = {
  'harvester': {
    'weight_pct': 50,
    'shapes': [
      [WORK, WORK, WORK, CARRY, MOVE, MOVE],
      [WORK, WORK, CARRY, MOVE, MOVE],
      [WORK, CARRY, MOVE],
    ],
  },
  'upgrader': {
    'weight_pct': 37,
    'shapes': [
      [WORK, WORK, WORK, CARRY, MOVE, MOVE],
      [WORK, WORK, CARRY, MOVE, MOVE],
      [WORK, CARRY, MOVE],
    ],
  },
  'builder': {
    'weight_pct': 13,
    'shapes': [
      [WORK, WORK, WORK, CARRY, MOVE, MOVE],
      [WORK, WORK, CARRY, MOVE, MOVE],
      [WORK, CARRY, MOVE],
    ],
  },
};
for(var role in roles) {
  roles[role]['module'] = require('role.' + role);
}

function list_creeps() {
  var creep_list = ""
  for(var role in roles) {
    var role_creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    creep_list += "Creeps with role " + role + ":";
    creep_list += _.map(role_creeps,
      (c) => " " + c.name + "[" + _.map(c.body, (body) => body.type[0]) + "]"
    ) + "\n";
  }
  return creep_list;
}

function get_spawn() {
  return Game.spawns['Spawn1'];
}

function spawn_creep(role) {
  var iter = 0;
  for(var shape_idx in roles[role].shapes) {
    iter++;
    shape = roles[role].shapes[shape_idx];
    if(get_spawn().canCreateCreep(shape) == OK) {
      var creep = get_spawn().createCreep(shape, undefined, {role: role});
      console.log("Spawned " + role + " " + creep + ", shape " + iter);
      return creep;
    }
  }
}

function get_priorities() {
  var counts = {};
  var total = 0;
  for(var role in roles) {
    var role_creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    counts[role] = role_creeps.length;
    total += role_creeps.length;
  }
  priorities = Object.keys(roles).sort(
    function(a, b) {
      return roles[b].weight_pct - roles[a].weight_pct;
    }
  );
  if(total == 0 ) { total = 1; }
  return [counts, total, priorities];
}

function show_priorities() {
  pri_list = "";
  [counts, total, priorities] = get_priorities();
  for(role_p in priorities) {
    role = priorities[role_p];
    pct = counts[role]/total*100;
    pri_list += "Want " + roles[role].weight_pct + "% " + role + ", have " +
            pct.toFixed(2) + "% (" + counts[role] + " out of " + total + ")\n";
  }
  return pri_list;
}

function adjust_creeps() {
  [counts, total, priorities] = get_priorities();
  for(role_p in priorities) {
    role = priorities[role_p];
    pct = counts[role]/total*100;
    if(pct < roles[role].weight_pct) {
      spawn_creep(role);
      return;
    }
  }
}

module.exports.loop = function () {
  Memory.list_creeps = list_creeps;
  Memory.spawn_creep = spawn_creep;
  Memory.show_priorities = show_priorities;

  // clean out dead memory
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) { delete Memory.creeps[name]; }
  }

  adjust_creeps();
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

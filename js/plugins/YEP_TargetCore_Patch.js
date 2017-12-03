//=============================================================================
// Patch for Yanfly Engine Plugins - Target Core
// YEP_TargetCore_Patch.js
//=============================================================================
/**
 * Fisher–Yates shuffle
 */
Array.prototype.shuffle = function() {
    var input = this;

    for (var i = input.length - 1; i >= 0; i--) {

        var randomIndex = Math.floor(Math.random() * (i + 1));
        var itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
};

Game_Action.prototype.getRandomTargets = function(number, unit) {
    var targets = unit.aliveMembers();
    targets.shuffle();
    if (number < targets.length) {
        targets = targets.slice(0, number);
    }
    console.log(targets);

    return targets;
};

Game_Action.prototype.makeCustomTargets = function() {
  var targets = [];
  if (this.isForEval()) {
    targets = this.makeEvalTargets();
  } else if (this.isForMultiple()) {
    targets = this.makeMultipleOfTargets();
  } else if (this.isForRow()) {
    targets = this.makeRowTypeTargets();
  } else if (this.isForRandomAny()) {
    var number = this.numTargets();
    var group = $gameParty.aliveMembers().concat($gameTroop.aliveMembers());
    for (var i = 0; i < number; ++i) {
      var member = group[Math.floor(Math.random() * group.length)];
      targets.push(member);
    }
  } else if (this.isForEverybody()) {
    targets = this.opponentsUnit().aliveMembers();
    var length = this.friendsUnit().aliveMembers().length;
    for (var i = 0; i < length; ++i) {
      var member = this.friendsUnit().aliveMembers()[i];
      if (member && member !== this.subject()) targets.push(member);
    }
    targets.push(this.subject());
  } else if (this.isForTargetAllFoes()) {
    var unit = this.opponentsUnit();
    targets.push(unit.smoothTarget(this._targetIndex));
    targets = targets.concat(unit.aliveMembers());
  } else if (this.isForTargetRandomFoes()) {
    var unit = this.opponentsUnit();
    var number = this.numTargets();
    targets.push(unit.smoothTarget(this._targetIndex));
    targets = targets.concat(this.getRandomTargets(number, unit))
    // 避免连续选择同一个目标
    if(targets.length>2){
        if(targets[0]===targets[1]){
            targets[1]=targets[2];
            targets[2]=targets[0];
        }
    }else if(targets.length==2){
        if(targets[0]===targets[1]){
            targets.splice(0,1);
        }
    }
  } else if (this.isForAllButUser()) {
    var length = this.friendsUnit().aliveMembers().length;
    for (var i = 0; i < length; ++i) {
      var member = this.friendsUnit().aliveMembers()[i];
      if (member && member !== this.subject()) targets.push(member);
    }
  } else if (this.isForTargetAllAllies()) {
    var unit = this.friendsUnit();
    targets.push(unit.smoothTarget(this._targetIndex));
    targets = targets.concat(unit.aliveMembers());
  } else if (this.isForTargetRandomAllies()) {
    var unit = this.friendsUnit();
    var number = this.numTargets();
    targets.push(unit.smoothTarget(this._targetIndex));
    targets = targets.concat(this.getRandomTargets(number, unit))
    // 避免连续选择同一个目标
    if(targets.length>2){
        if(targets[0]===targets[1]){
            targets[1]=targets[2];
            targets[2]=targets[0];
        }
    }else if(targets.length==2){
        if(targets[0]===targets[1]){
            targets.splice(0,1);
        }
    }
  } else if (this.isForRandomAllies()) {
    var unit = this.friendsUnit();
    var number = this.numTargets();
    targets = targets.concat(this.getRandomTargets(number, unit))
  }
  return targets;
};
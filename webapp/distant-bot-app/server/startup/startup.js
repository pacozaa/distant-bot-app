Meteor.startup(function(){
  Status.remove({});
  Status.insert({
    robot: 0,
    gps: 0,
    mcu: 0,
    mode: 0
  });
  PrePlant.remove({});
  PrePlant.insert({
    oneStep: ['RunForwardLongTimeout','RunRotateLeftUntil','RunForwardShortTimeout','RunRotateLeftUntil','RunForwardLongTimeout','RunRotateRightUntil','RunForwardShortTimeout','RunRotateRightUntil'],
    longDistance: 15,
    shortDistance: 5,
    longDelay: 10000,
    shortDelay: 5000,
    round: 1
  });
});

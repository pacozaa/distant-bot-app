Meteor.publish('motionSensor', function () {
  return MotionSensor.find({});
});

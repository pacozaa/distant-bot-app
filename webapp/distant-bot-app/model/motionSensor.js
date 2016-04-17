MotionSensor = new Mongo.Collection('motionSensor');
MotionSensor.allow({
  insert: function (userId, motionSensor) {
    return true;
  },
  update: function (userId, motionSensor, fields, modifier) {
    return true;
  },
  remove: function (userId, motionSensor) {
    return true;
  }
});

Drive = new Mongo.Collection('drive');
Drive.allow({
  insert: function (userId, drive) {
    return true;
  },
  update: function (userId, drive, fields, modifier) {
    return true;
  },
  remove: function (userId, drive) {
    return true;
  }
});

Status = new Mongo.Collection('status');
Status.allow({
  insert: function (userId, status) {
    return true;
  },
  update: function (userId, status, fields, modifier) {
    return true;
  },
  remove: function (userId, status) {
    return true;
  }
});

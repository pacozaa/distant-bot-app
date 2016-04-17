PrePlant = new Mongo.Collection('prePlant');
PrePlant.allow({
  insert: function (userId, preplant) {
    return true;
  },
  update: function (userId, preplant, fields, modifier) {
    return true;
  },
  remove: function (userId, preplant) {
    return true;
  }
});

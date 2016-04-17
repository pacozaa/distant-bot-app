Meteor.publish('prePlant', function () {
  return PrePlant.find({});
});

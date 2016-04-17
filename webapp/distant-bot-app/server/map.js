Meteor.publish('map', function () {
  return MapPosition.find({});
});

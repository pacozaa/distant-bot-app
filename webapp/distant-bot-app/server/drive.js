Meteor.publish('drive', function () {
  return Drive.find({});
});

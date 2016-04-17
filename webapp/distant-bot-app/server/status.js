Meteor.publish('status', function () {
  return Status.find({});
});

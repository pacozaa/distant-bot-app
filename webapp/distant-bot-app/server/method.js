Meteor.methods({
  ledOn : function() {
    led.on();
  },
  ledOff : function() {
    led.off();
  }
});

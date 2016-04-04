var five = Meteor.npmRequire('johnny-five');
var board = new five.Board();
led = ''
board.on('ready', function() {
  led = new five.Led(13);
  // setTimeout(function(){
  //   led.on();
  // },2500);
  // setTimeout(function(){
  //   led.off();
  // },1000);
});

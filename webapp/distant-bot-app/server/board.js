const five = Meteor.npmRequire('johnny-five');
const board = new five.Board();
motorUtils = {};
motorLeft = {};
motorRight = {};
robotGPSPos = {};
robotGPSNav = {};
robotHeading = {};
robotGyro = {};
robotAcce = {};
robotBaro = {};
startLat = {};
startLon = {};
currentLat = {};
currentLon = {};
setDegree = {};
currentPIDInterval = {};
pidInterval = 5;
RobotSW  = 0;
enableMode = 0;
speedRight = 255;
speedLeft = 255;
currentDriveId = '';
currentActionId = '';
GoForwardStatus = 0;
board.on('ready', Meteor.bindEnvironment(
  function(board) {
      Status.update({}, {
          $set: {
              mcu: 1
          }
      });
      console.log('board online');

      motorLeft = new five.Motor({
          pins: {
              pwm: 4,
              dir: 50,
              cdir: 51
          }
      });
      motorRight = new five.Motor({
          pins: {
              pwm: 5,
              dir: 52,
              cdir: 53
          }
      });
      motorUtils = {
          Forward: function(pwm) {
              motorRight.forward(pwm);
              motorLeft.forward(pwm);
          },
          Backward: function(pwm) {
              motorRight.reverse(pwm);
              motorLeft.reverse(pwm);
          },
          RotateLeft: function(pwm) {
              motorRight.forward(pwm);
              motorLeft.reverse(pwm);
          },
          RotateRight: function(pwm) {
              motorRight.reverse(pwm);
              motorLeft.forward(pwm);
          },
          TurnLeft: function(pwm) {
              motorRight.forward(pwm);
              motorLeft.brake();
          },
          TurnRight: function(pwm) {
              motorRight.brake();
              motorLeft.forward(pwm);
          },
          Stop: function() {
              motorRight.brake();
              motorLeft.brake();
          }
      }

      const gps = new five.GPS({
          port: 3,
          baud: 4800
      });
      gps.on('change', Meteor.bindEnvironment(
        (data) => {
            currentLat = data.latitude;
            currentLon = data.longtitude;
            if(currentDriveId != ''){
              Meteor.call('insertGPS', currentLat, currentLon, (error) => {
                if(error){
                  console.log('collectGPS error');
                }
                else{
                }
              });
            }
        }
      ));
      gps.on('sentence', (data) => {

      });
      gps.once('change', Meteor.bindEnvironment(
        () => {
          Status.update({}, {
              $set: {
                  gps: 1
              }
          });
          console.log('gps online');
      }));
      const compass = new five.Compass({
          controller: 'HMC5883L'
      });
      compass.on('data', (data) => {
          robotHeading = data.heading;
      });
      const gyro = new five.Gyro({
          controller: 'MPU6050'
      });
      const multi = new five.Multi({
          controller: 'BMP085'
      });
  }
));

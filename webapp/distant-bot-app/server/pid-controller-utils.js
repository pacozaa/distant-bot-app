PIDController = Meteor.npmRequire('pid-controller');
Kp = 15;
Ki = 0;
Kd = 0;
ctrl = new PIDController(0, 0, Kp, Ki, Kd);
pidUtils = {
    init: function() {
        ctrl.setPoint(0);
        ctrl.setMode(PIDController.AUTOMATIC);
        ctrl.setSampleTime(pidInterval);
        ctrl.setOutputLimits(0, 255);
    },
    pidLoop: function(motion) {
        var pid_heading = robotHeading;
        var setInput;
        //Q1
        if (setDegree >= 0 && setDegree < 90) {
            if ((setDegree + 180) > pid_heading && setDegree < pid_heading) {

            } else {
                if (pid_heading > (180 + setDegree)) {
                    pid_heading = (180 + setDegree) - (pid_heading - (180 + setDegree));
                }
            }
        }
        //Q2
        else if (setDegree >= 90 && setDegree < 180) {
            if ((setDegree + 180) > pid_heading && setDegree < pid_heading) {

            } else {
                if (pid_heading > (180 + setDegree)) {
                    pid_heading = (180 + setDegree) - (pid_heading - (180 + setDegree));
                }
            }
        }
        //Q3
        else if (setDegree >= 180 && setDegree < 270) {
            if (pid_heading > setDegree || pid_heading < (setDegree - 180)) {
                if (pid_heading < (setDegree - 180)) {
                    pid_heading = (setDegree - 180) + ((setDegree - 180) - pid_heading);
                }
            } else {

            }
        }
        //Q4
        else if (setDegree >= 270 && setDegree <= 360) {
            if ((setDegree - 180) > pid_heading || setDegree < pid_heading) {
                if (pid_heading < (setDegree - 180)) {
                    pid_heading = (setDegree - 180) + ((setDegree - 180) - pid_heading);
                }
            } else {

            }
        }
        setInput = Math.abs(setDegree - pid_heading);
        ctrl.setInput(setInput);
        ctrl.compute();
        if (motion === 'forward') {
            pidUtils.setMotorForward(ctrl);
        } else if (motion === 'rotate') {
            pidUtils.setMotorRotate(ctrl);
        }
    },
    setMotorForward: function(pid) {
        var pid_output = Math.floor(pid.getOutput());
        var pid_setpoint = Math.floor(pid.getSetPoint());
        var pid_input = Math.floor(pid.getInput());
        var pid_direction = pid.getDirection();
        var pid_heading = Math.floor(robotHeading);
        var pid_rotateDirection = '';
        var pid_quarter = ''
        var pid_speedLeft = '';
        var pid_speedRight = '';
        //Q1
        if (setDegree >= 0 && setDegree < 90) {
            if ((setDegree + 180) > robotHeading && setDegree < robotHeading) {
                pid_rotateDirection = 'right';
                //motorUtils.RotateRight(pid.getOutput());
                var speedTune = speedRight - pid.getOutput();
                motorLeft.forward(speedLeft);
                motorRight.forward(speedTune);
                pid_speedLeft = speedLeft;
                pid_speedRight = speedTune;
            } else {
                pid_rotateDirection = 'left';
                // motorUtils.RotateLeft(pid.getOutput());
                var speedTune = speedLeft - pid.getOutput();
                motorLeft.forward(speedTune);
                motorRight.forward(speedRight);
                pid_speedLeft = speedTune;
                pid_speedRight = speedRight;
            }
            pid_quarter = 'Q1';
        }
        //Q2
        else if (setDegree >= 90 && setDegree < 180) {
            if ((setDegree + 180) > robotHeading && setDegree < robotHeading) {
                pid_rotateDirection = 'right';
                // motorUtils.RotateRight(pid.getOutput());
                var speedTune = speedRight - pid.getOutput();
                motorLeft.forward(speedLeft);
                motorRight.forward(speedTune);
                pid_speedLeft = speedLeft;
                pid_speedRight = speedTune;
            } else {
                pid_rotateDirection = 'left';
                // motorUtils.RotateLeft(pid.getOutput());
                var speedTune = speedLeft - pid.getOutput();
                motorLeft.forward(speedTune);
                motorRight.forward(speedRight);
                pid_speedLeft = speedTune;
                pid_speedRight = speedRight;
            }
            pid_quarter = 'Q2';
        }
        //Q3
        else if (setDegree >= 180 && setDegree < 270) {
            if (robotHeading > setDegree || robotHeading < (setDegree - 180)) {
                pid_rotateDirection = 'right';
                // motorUtils.RotateRight(pid.getOutput());
                var speedTune = speedRight - pid.getOutput();
                motorLeft.forward(speedLeft);
                motorRight.forward(speedTune);
                pid_speedLeft = speedLeft;
                pid_speedRight = speedTune;
            } else {
                pid_rotateDirection = 'left';
                // motorUtils.RotateLeft(pid.getOutput());
                var speedTune = speedLeft - pid.getOutput();
                motorLeft.forward(speedTune);
                motorRight.forward(speedRight);
                pid_speedLeft = speedTune;
                pid_speedRight = speedRight;
            }
            pid_quarter = 'Q3';
        }
        //Q4
        else if (setDegree >= 270 && setDegree <= 360) {
            if ((setDegree - 180) > robotHeading || setDegree < robotHeading) {
                pid_rotateDirection = 'right';
                // motorUtils.RotateRight(pid.getOutput());
                var speedTune = speedRight - pid.getOutput();
                motorLeft.forward(speedLeft);
                motorRight.forward(speedTune);
                pid_speedLeft = speedLeft;
                pid_speedRight = speedTune;
            } else {
                pid_rotateDirection = 'left';
                // motorUtils.RotateLeft(pid.getOutput());
                var speedTune = speedLeft - pid.getOutput();
                motorLeft.forward(speedTune);
                motorRight.forward(speedRight);
                pid_speedLeft = speedTune;
                pid_speedRight = speedRight;
            }
            pid_quarter = 'Q4';
        }
        Meteor.call('insertMotion', {
          driveId: currentDriveId,
          motionId: currentActionId,
          targetDegree: setDegree,
          setPoint: 0,
          input: pid.getInput(),
          output: pid.getOutput()
        }, (error) => {
          if(error){
            console.log('insertMotion error');
          }
          else{

          }
        });
    },
    setMotorRotate: function(pid) {
        var pid_output = Math.floor(pid.getOutput());
        var pid_setpoint = Math.floor(pid.getSetPoint());
        var pid_input = Math.floor(pid.getInput());
        var pid_direction = pid.getDirection();
        var pid_heading = Math.floor(robotHeading);
        var pid_rotateDirection = '';
        var pid_quarter = ''
            //Q1
        if (setDegree >= 0 && setDegree < 90) {
            if ((setDegree + 180) > robotHeading && setDegree < robotHeading) {
                pid_rotateDirection = 'right';
                motorUtils.RotateRight(pid.getOutput());
            } else {
                pid_rotateDirection = 'left';
                motorUtils.RotateLeft(pid.getOutput());
            }
            pid_quarter = 'Q1';
        }
        //Q2
        else if (setDegree >= 90 && setDegree < 180) {
            if ((setDegree + 180) > robotHeading && setDegree < robotHeading) {
                pid_rotateDirection = 'right';
                motorUtils.RotateRight(pid.getOutput());
            } else {
                pid_rotateDirection = 'left';
                motorUtils.RotateLeft(pid.getOutput());
            }
            pid_quarter = 'Q2';
        }
        //Q3
        else if (setDegree >= 180 && setDegree < 270) {
            if (robotHeading > setDegree || robotHeading < (setDegree - 180)) {
                pid_rotateDirection = 'right';
                motorUtils.RotateRight(pid.getOutput());
            } else {
                pid_rotateDirection = 'left';
                motorUtils.RotateLeft(pid.getOutput());
            }
            pid_quarter = 'Q3';
        }
        //Q4
        else if (setDegree >= 270 && setDegree <= 360) {
            if ((setDegree - 180) > robotHeading || setDegree < robotHeading) {
                pid_rotateDirection = 'right';
                motorUtils.RotateRight(pid.getOutput());
            } else {
                pid_rotateDirection = 'left';
                motorUtils.RotateLeft(pid.getOutput());
            }
            pid_quarter = 'Q4';
        }
        Meteor.call('insertMotion', {
          driveId: currentDriveId,
          motionId: currentActionId,
          targetDegree: setDegree,
          setPoint: 0,
          input: pid.getInput(),
          output: pid.getOutput()
        }, (error) => {
          if(error){
            console.log('insertMotion error');
          }
          else{
          }
        });
    }
}

Meteor.methods({
  startRobot: function() {
      RobotSW  = 1;
      Status.update({}, {$set: {robot: 1}});
  },
  stopRobot: function() {
      RobotSW  = 0;
      GoForwardStatus = 0;
      currentDriveId = '';
      motorUtils.Stop();
      Status.update({}, {$set: {robot: 0}});
  },
  forwardRobot: function() {
    if(RobotSW  === 1 && GoForwardStatus === 0){
      if(enableMode === 0){
        motorUtils.Forward(255);
      }
      else if(enableMode === 1){
        startLat = currentLat;
        startLon = currentLon;
        GoForwardStatus = 1;
        Meteor.call('RunSemiAuto');
        currentDriveId = Drive.insert({
          mode: enableMode,
          lat: currentLat,
          lon: currentLon
        });
      }
      else if(enableMode === 2){
        startLat = currentLat;
        startLon = currentLon;
        GoForwardStatus = 1;
        Meteor.call('RunForwardLongTimeout');
        currentDriveId = Drive.insert({
          mode: enableMode,
          lat: currentLat,
          lon: currentLon
        });
      }
    }
  },
  backwardRobot: function() {
    if(enableMode === 0 && RobotSW  === 1){
      motorUtils.Backward(255);
    }
  },
  rotateLeftRobot: function() {
    if(enableMode === 0 && RobotSW  === 1){
      motorUtils.RotateLeft(255);
    }
  },
  rotateRightRobot: function() {
    if(enableMode === 0 && RobotSW  === 1){
      motorUtils.RotateRight(255);
    }
  },
  TurnLeftRobot: function() {
    if(enableMode === 0 && RobotSW  === 1){
      motorUtils.TurnLeft(255);
    }
  },
  TurnRightRobot: function() {
    if(enableMode === 0 && RobotSW  === 1){
      motorUtils.TurnRight(255);
    }
  },
  EnableManualMode: function() {
    if(RobotSW === 1){
      enableMode = 0;
      Status.update({}, {$set: {mode: 0}});
    }
  },
  EnableSemiAutoMode: function() {
    if(RobotSW === 1){
      enableMode = 1;
      Status.update({}, {$set: {mode: 1}});
    }
  },
  EnableAutoMode: function() {
    if(RobotSW === 1){
      enableMode = 2;
      Status.update({}, {$set: {mode: 2}});
    }
  },
  SemiAutoMode: function() {
    if(RobotSW === 1){
      enableMode = 1;
    }
  },
  AutoMode: function() {
    if(RobotSW === 1){
      enableMode = 2;
    }
  },
  RunSemiAuto: function(){
    let roundNum = PrePlant.findOne({}).round;
    let nextRun = [];
    let methodName = '';
    for (let i = 0; i < roundNum; i++) {
      nextRun = nextRun.concat(PrePlant.findOne().oneStep);
    }
    methodName = nextRun[0];
    nextRun.splice(0,1);
    console.log('NextRun: '+nextRun);
    Meteor.call(methodName, nextRun);
  },
  RunForwardLongUntil: function(nextRun) {
    console.log('RunForwardLongUntil\n');
    Meteor.call('RunForwardDistance');
    Meteor.call('ForwardUntil', PrePlant.findOne().longDistance, nextRun);
  },
  RunForwardShortUntil: function(nextRun) {
    console.log('RunForwardShortUntil\n');
    Meteor.call('RunForwardDistance');
    Meteor.call('ForwardUntil', PrePlant.findOne().shortDistance, nextRun);
  },
  RunForwardLongTimeout: function(nextRun) {
    console.log('RunForwardLongTimeout\n');
    Meteor.call('RunForwardDistance');
    Meteor.call('ForwardLongTimeout', PrePlant.findOne().longDistance, nextRun);
  },
  RunForwardShortTimeout: function(nextRun) {
    console.log('RunForwardShortTimeout\n');
    Meteor.call('RunForwardDistance');
    Meteor.call('ForwardShortTimeout', PrePlant.findOne().shortDistance, nextRun);
  },
  RunForwardDistance: function() {
    console.log("RunForwardDistance Start\n");
    setDegree = robotHeading;
    ctrl.setTunings(15, 0, 0);
    pidUtils.init();
    currentActionId = Random.id();
    currentPIDInterval = Meteor.setInterval(function(){
      pidUtils.pidLoop('forward');
    },pidInterval);
  },
  ForwardUntil: function(distance, nextRun) {
    startLat = currentLat;
    startLon = currentLon;
    let self = Meteor.setInterval(function(){
      if(Meteor.call("gpsDistance",startLat, startLon, currentLat, currentLon, "M") > distance) {
        Meteor.clearInterval(currentPIDInterval);
        Meteor.clearInterval(self);
        motorUtils.Stop();
        console.log("ForwardUntil Stop\n");
        if(nextRun){
          let methodName = nextRun[0];
          let testNext = nextRun;
          if(testNext.length === 1){
            console.log('ForwardUntil got single\n');
            Meteor.call(methodName);
          }
          else{
              nextRun.splice(0,1);
              Meteor.call(methodName, nextRun);
          }
        }
      }
    },pidInterval);
  },
  ForwardLongTimeout: function(timeout, nextRun) {
    Meteor.setTimeout(function(){
      Meteor.clearInterval(currentPIDInterval);
      motorUtils.Stop();
      console.log("ForwardLongTimeout Stop\n");
      if(nextRun){
        let methodName = nextRun[0];
        let testNext = nextRun;
        if(testNext.length === 1){
          console.log('ForwardLongTimeout got single\n');
          Meteor.call(methodName);
        }
        else{
            nextRun.splice(0,1);
            Meteor.call(methodName, nextRun);
        }
      }
    },PrePlant.findOne().longDelay);
  },
  ForwardShortTimeout: function(timeout, nextRun) {
    Meteor.setTimeout(function(){
      Meteor.clearInterval(currentPIDInterval);
      motorUtils.Stop();
      console.log("ForwardShortTimeout Stop\n");
      if(nextRun){
        let methodName = nextRun[0];
        let testNext = nextRun;
        if(testNext.length === 1){
          console.log('ForwardShortTimeout got single\n');
          Meteor.call(methodName);
        }
        else{
            nextRun.splice(0,1);
            Meteor.call(methodName, nextRun);
        }
      }
    },PrePlant.findOne().shortDelay);
  },
  RunRotateLeftUntil: function(nextRun) {
    Meteor.call('RunRotateLeft');
    Meteor.call('RotateUntil', nextRun);
  },
  RunRotateRightUntil: function(nextRun) {
    Meteor.call('RunRotateRight');
    Meteor.call('RotateUntil', nextRun);
  },
  RunRotateLeft: function() {
    console.log("RunRotateLeft Start\n");
    let degree = 90;
    setDegree = Meteor.call('setDegreeLimit',setDegree+degree);
    ctrl.setTunings(10, 0, 0);
    pidUtils.init();
    currentActionId = Random.id();
    currentPIDInterval = Meteor.setInterval(function(){
      pidUtils.pidLoop('rotate');
    },pidInterval);
  },
  RunRotateRight: function() {
    console.log("RunRotateRight Start\n");
    let degree = -90;
    setDegree = Meteor.call('setDegreeLimit',setDegree+degree);
    ctrl.setTunings(10, 0, 0);
    pidUtils.init();
    currentActionId = Random.id();
    currentPIDInterval = Meteor.setInterval(function(){
      pidUtils.pidLoop('rotate');
    },pidInterval);
  },
  RotateUntil: function(nextRun) {
    let self = Meteor.setInterval(function(){
      if (Math.abs(setDegree - robotHeading) < 1) {
          Meteor.clearInterval(currentPIDInterval);
          Meteor.clearInterval(self);
          console.log('RotateUntil Stop\n');
          motorUtils.Stop();
          if(nextRun){
            let methodName = nextRun[0];
            let testNext = nextRun;
            if(testNext.length === 1){
              console.log('RotateUntil got single\n');
              Meteor.call(methodName);
            }
            else{
                nextRun.splice(0,1);
                Meteor.call(methodName, nextRun);
            }
          }
      }
    },pidInterval);
  },
  insertGPS: function(lat, lon){
    MapPosition.insert({
      driveId : currentDriveId,
      lat: lat,
      lon: lon
    });
  },
  insertMotion: function(motionSensor) {
    MotionSensor.insert(motionSensor);
  },
  gpsDistance: function(lat1, lon1, lat2, lon2, unit) {
    let radlat1 = Math.PI * lat1 / 180
    let radlat2 = Math.PI * lat2 / 180
    let theta = lon1 - lon2
    let radtheta = Math.PI * theta / 180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") {
        dist = dist * 1.609344
    }
    if (unit == "M") {
        dist = dist * 1.609344 * 1000
    }
    if (unit == "N") {
        dist = dist * 0.8684
    }
    return dist
  },
  setDegreeLimit: function(degree){
    if (degree > 360) {
        degree = degree - 360;
    }
    else if (degree < 0) {
      degree = 360 - Math.abs(degree);
    }
    return degree;
  }
});

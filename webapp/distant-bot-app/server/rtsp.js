const rtsp = Meteor.npmRequire('rtsp-ffmpeg');
//const getPixels  = Meteor.npmRequire('pixel-getter');
const RobotCameraInfo = {
  IP: 'udp://localhost:1234/1234'
}
const RobotCamera = new rtsp.FFMpeg({
  input: RobotCameraInfo.IP,
  resolution: '320x240',
  quality: 3
});
RobotCamera.on('start', () => {
  console.log('RobotCamera : start');
});

RobotCamera.on('stop', () => {
  console.log('RobotCamera : stop');
});


Streamy.onConnect((fromSocket) => {
  console.log('onConnect');
  RobotCamera.on('data', streamToClient = (bytes) => {
    Streamy.emit('VideoData', {data: bytes}, fromSocket);
    // getPixels.get(bytes, function(err, pixels) {
    //   if(err){
    //     console.log('got shit');
    //   }
    //   else {
    //     console.log(pixels[0][0]);
    //   }
    // });
  });
});
Streamy.onDisconnect((fromSocket) => {
  console.log('onDisconnect');
  RobotCamera.removeListener('data', streamToClient = (bytes) => {
    Streamy.emit('VideoData', {data: bytes}, fromSocket);
  });
});

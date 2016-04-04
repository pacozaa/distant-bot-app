var rtsp = Meteor.npmRequire('rtsp-ffmpeg');
var convert  = Meteor.npmRequire('color-convert');
var Jimp = Meteor.npmRequire('jimp');
var CurrentSocket;
var CurrentImage;
var ClickPosition = {
  offsetX : '',
  offsetY : ''
};
const RobotCameraInfo = {
  IP: 'udp://localhost:1234/1234'
}
const RobotCamera = new rtsp.FFMpeg({
  input: RobotCameraInfo.IP,
  resolution: '320x240',
  quality: 3,
  rate: 5
});
RobotCamera.on('start', () => {
  console.log('RobotCamera : start');
});

RobotCamera.on('stop', () => {
  console.log('RobotCamera : stop');
});

Streamy.on('ClickPosition',  getClickPosition = (data, socket) => {
  ClickPosition.offsetX = data.offsetX;
  ClickPosition.offsetY = data.offsetY;
});
// Attach an handler for a specific message
Streamy.on('RequestImage', getRequest = (data, socket) => {
  if(ClickPosition.offsetX > 0){
    if(data.data){
      colorSegmentation(CurrentImage);
    }
  }
});
Streamy.onConnect((socket) => {
  console.log('onConnect');
  CurrentSocket = socket;
  RobotCamera.on('data', streamToClient);
});
Streamy.onDisconnect((socket) => {
  console.log('onDisconnect');
  RobotCamera.removeListener('data', streamToClient);
});

function streamToClient(bytes) {
  CurrentImage = bytes;
  Streamy.emit('VideoData', {data: bytes}, CurrentSocket);
}
function streamAsProcessedImage(bytes){
  Streamy.emit('ProcessedImage', { data: bytes}, CurrentSocket);
}
function colorSegmentation(bytes) {
  Jimp.read(bytes, function(err, image){
      if (err){
        console.log(err);
      }
        let maxDist2 = 800;
        let adjustUnits = Math.PI/2.0;
        let selectRGBA = Jimp.intToRGBA(image.getPixelColor(ClickPosition.offsetX, ClickPosition.offsetY));
        let selectHSV = rgb2hsv(selectRGBA.r,selectRGBA.g,selectRGBA.b);
        for(let i = 0; i < image.bitmap.width; i++){
          for(let j = 0; j < image.bitmap.height; j++){
              let rgba = Jimp.intToRGBA(image.getPixelColor(i,j));
              let hsv = rgb2hsv(rgba.r,rgba.g,rgba.b);
              let dh = UtilAngle.dist(hsv[0],selectHSV[0]);
              let ds = (hsv[1] - selectHSV[1])*adjustUnits;
              let dist2 = dh*dh + ds*ds;
              if( dist2 <= maxDist2 ) {

              }
              else{
                image.setPixelColor(0, i, j);
              }
          }
        }
        image.getBuffer( Jimp.MIME_PNG, (err,buffer) => {
          streamAsProcessedImage(buffer);
        } );
  });
}
function convertBytesToBase64 (arrayBuffer) {
  var base64    = '';
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  var bytes         = new Uint8Array(arrayBuffer);
  var byteLength    = bytes.byteLength;
  var byteRemainder = byteLength % 3;
  var mainLength    = byteLength - byteRemainder;

  var a, b, c, d;
  var chunk;

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63;               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength];

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4; // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '==';
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4; // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2; // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '=';
  }

  return base64;
}
function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return view;
}
function rgb2hsv () {
    var rr, gg, bb,
        r = arguments[0] / 255,
        g = arguments[1] / 255,
        b = arguments[2] / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return [Math.round(h * 360), Math.round(s * 100),Math.round(v * 100)];
}

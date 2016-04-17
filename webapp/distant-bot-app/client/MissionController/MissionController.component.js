angular.module('DistantBot').directive('missionController', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/MissionController/MissionController.html',
    controllerAs: 'missionController',
    controller: function ($scope, $reactive, $state, $mdDialog) {
      $reactive(this).attach($scope);
      console.warn = function () {}
      this.subscribe('map');
      this.subscribe('status');
      this.helpers({
        VideoStreamingData: () => {
          return this.getReactively('VideoStreamingData');
        },
        ProcessedImage: () => {
          return this.getReactively('ProcessedImage');
        },
        StatusRobot: () => {
          return Status.find({},{limit: 1});
        }
      });
      // Streamy.on('VideoData', setImageData = (d) => {
      //   this.VideoStreamingData = 'data:image/png;base64,' + this.convertBytesToBase64(d.data);
      // });
      // Streamy.on('ProcessedImage', setImageData = (d) => {
      //   this.ProcessedImage = 'data:image/png;base64,' + this.convertBytesToBase64(d.data);
      // });
      this.convertBytesToBase64 = (arrayBuffer) => {
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
      let lightdream = [
        {"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},
        {"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},
        {"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},
        {"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},
        {"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},
        {"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}
      ];
      this.map = {
        center: {
          latitude: 13.8523514,
          longitude: 100.5652767
        },
        options: {
          styles: lightdream,
        },
        zoom: 15,
        events: {}
      };

      this.getImagePixel = (event) => {
        var offsetX = event.offsetX;
        var offsetY = event.offsetY;
        Streamy.emit('ClickPosition', {
          offsetX:  offsetX,
          offsetY: offsetY
        });
        // you have lots of things to try here, not sure what you want to calculate
        Streamy.emit('RequestImage', { data: true });
        console.log(event, offsetX, offsetY);
      }
      this.startRobot = () => {
        Meteor.call('startRobot', (error) => {
          if(error){
            console.log('startRobot error');
          }
          else{
            console.log('startRobot');
          }
        });
      }
      this.stopRobot = () => {
        Meteor.call('stopRobot', (error) => {
          if(error){
            console.log('stopRobot error');
          }
          else{
            console.log('stopRobot');
          }
        });
      }
      this.forwardRobot = () => {
        Meteor.call('forwardRobot', (error) => {
          if(error){
            console.log('forwardRobot error');
          }
          else{
            console.log('forwardRobot');
          }
        });
      }
      this.backwardRobot = () => {
        Meteor.call('backwardRobot', (error) => {
          if(error){
            console.log('backwardRobot error');
          }
          else{
            console.log('backwardRobot');
          }
        });
      }
      this.rotateLeftRobot = () => {
        Meteor.call('rotateLeftRobot', (error) => {
          if(error){
            console.log('rotateLeftRobot error');
          }
          else{
            console.log('rotateLeftRobot');
          }
        });
      }
      this.rotateRightRobot = () => {
        Meteor.call('rotateRightRobot', (error) => {
          if(error){
            console.log('rotateRightRobot error');
          }
          else{
            console.log('rotateRightRobot');
          }
        });
      }
      this.ModeStatus = true;
      this.ModeMan = true;
      this.ModeSemi = true;
      this.ModeAuto = true;
      this.ModeGP = true;
      this.ModeMap = true;
      this.ImageStream = false;
      this.ImageProcess = false;
      this.ActiveMode = (mode) => {
        console.log(mode);
        switch (mode) {
          case 'MAN':
            Meteor.call('EnableManualMode');
            break;
          case 'SEMI':
            Meteor.call('EnableSemiAutoMode');
            break;
          case 'AUTO':
            Meteor.call('EnableAutoMode');
            break;
          default:

        }
      }
      this.openMode = (mode) => {
        switch (mode) {
          case 'STATUS':
            this.ModeStatus = true;
            break;
          case 'MAN':
            this.ModeMan = true;
            break;
          case 'SEMI':
            this.ModeSemi = true;
            break;
          case 'AUTO':
            this.ModeAuto = true;
            break;
          case 'GP':
            this.ModeGP = true;
            break;
          case 'MAP':
            this.ModeMap = true;
            break;
          case 'ImageStream':
            this.ImageStream = true;
            break;
          case 'ImageProcess':
            this.ImageProcess = true;
            break;
          default:
            break;
        }
      }
      this.closeMode = (mode) => {
        switch (mode) {
          case 'STATUS':
            this.ModeStatus = false;
            break;
          case 'MAN':
            this.ModeMan = false;
            break;
          case 'SEMI':
            this.ModeSemi = false;
            break;
          case 'AUTO':
            this.ModeAuto = false;
            break;
          case 'GP':
            this.ModeGP = false;
            break;
          case 'MAP':
            this.ModeMap = false;
            break;
          case 'ImageStream':
            this.ImageStream = false;
            break;
          case 'ImageProcess':
            this.ImageProcess = false;
            break;
          default:
            break;
        }
      }
    }
  }
});

angular.module('DistantBot', [
  'angular-meteor',
  'ui.router',
  'accounts.ui',
  'uiGmapgoogle-maps',
  'ngMaterial'
]);

function onReady() {
  angular.bootstrap(document, ['DistantBot'], {
    strictDi: true
  });
}

if (Meteor.isCordova)
  angular.element(document).on("deviceready", onReady);
else
  angular.element(document).ready(onReady);

Meteor._debug = (function (super_meteor_debug) {
  return function (error, info) {
    if (!(info && _.has(info, 'msg')))
      super_meteor_debug(error, info);
  }
})(Meteor._debug);

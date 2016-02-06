angular.module('DistantBot')
  .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('MissionController', {
        url: '/MissionController',
        template: '<mission-controller></mission-controller>'
      });

    $urlRouterProvider.otherwise('/MissionController');
  })

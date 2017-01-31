'use strict';

/**
 * @ngdoc overview
 * @name alFjrApp
 * @description
 * # alFjrApp
 *
 * Main module of the application.
 */
angular
  .module('BczUiApp', [
    'ngResource',
    'ui.router',
    'ngCookies',
    'satellizer',
    'ngAnimate',
    'rzModule',
    'ngSanitize',
    'angular-svg-round-progressbar',
    // 'datePicker'
  ])
  .config(function ($locationProvider,$stateProvider,$urlRouterProvider, $authProvider) {

      // Satellizer configuration that specifies which API
      // route the JWT should be retrieved from
      // $authProvider.loginUrl = 'http://api.blue.bluroe.com/api/authenticate';
      $authProvider.baseUrl = 'http://localhost:9000';
      $authProvider.loginUrl = 'http://api.blue.bluroe.com/api/authenticate';

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'views/home.html',
          controller: 'MainCtrl',
          controllerAs: 'vm'
        })
        .state('whoweare', {
          url: '/whoweare',
          templateUrl: 'views/whoweare.html',
          controller: 'WhoweareCtrl',
          controllerAs: 'vm'
        })
        .state('demo', {
          url: '/demo',
          templateUrl: 'views/demo.html',
          controller: 'DemoCtrl',
          controllerAs: 'vm'
        })
        .state('explore', {
          url: '/explore',
          templateUrl: 'views/explore.html',
          controller: 'ExploreCtrl',
          controllerAs: 'vm'
        })
  })
.run(function($rootScope, $location, $state, $stateParams, $cookieStore) {

});


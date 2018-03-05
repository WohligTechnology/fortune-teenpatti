// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var myApp = angular.module('starter', ['ionic', 'starter.service', 'starter.controllers'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      //   .state('app', {
      //   url: '/app',
      //   templateUrl: 'templates/app.html',
      //   controller: 'AppCtrl'
      // })
      .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })
      .state('lobby', {
        url: '/lobby',
        templateUrl: 'templates/lobby.html',
        cache: false,
        controller: 'LobbyCtrl'
      })
      .state('table', {
        url: '/table/:id',
        cache: false,
        templateUrl: 'templates/table.html',
        controller: 'TableCtrl'
      })

      ;
    // if none of the above states are matche d, use this as the fallback
    $urlRouterProvider.otherwise('login');
  });



myApp.filter('serverimage', function () {
  return function (input, width, height, style) {
    if (input) {

      if (input.substr(0, 4) == "http") {
        return input;
      } else {
        image = imgpath + "?file=" + input;
        if (width) {
          image += "&width=" + width;
        }
        if (height) {
          image += "&height=" + height;
        }
        if (style) {
          image += "&style=" + style;
        }
        return image;
      }

    } else {
      //    return "img/logo.png";
      return "img/not.png";
    }
  };
});

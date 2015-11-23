// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myApp = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase', 'ngCordova']);

// navigation 
myApp.config(function($stateProvider, $urlRouterProvider) { 
  // here we put the states and templates 

  // first we define the state if no state is chosen 
  $urlRouterProvider.otherwise('/');

  // here are the states
  $stateProvider

  .state('login', { 
    url: '/', 
    controller: 'LoginCtrl',
    templateUrl: 'templates/login.html'
  })

  .state('home', { 
    url: '/home', 
    controller: 'HomeCtrl',
    templateUrl: 'templates/home.html'
  });


});



myApp.run(function($ionicPlatform, $state, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  if(window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  }
  if(window.StatusBar) {
    StatusBar.styleDefault();
  }

});
});




/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!1
in firebase security add what you will be searching for 
{
    "rules": {
        ".read": true,
        ".write": true,
        "phones": {
          ".indexOn": "uid" 
        }
    }
}

*/
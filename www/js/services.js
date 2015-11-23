var sApp = angular.module('starter.services', ['ionic', 'firebase']);

// factory 


sApp.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://ibills.firebaseio.com/");
    return $firebaseAuth(ref);
  }
]);

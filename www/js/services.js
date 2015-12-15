var sApp = angular.module('starter.services', ['ionic', 'firebase']);

// factory 


sApp.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://ibills.firebaseio.com/");
    return $firebaseAuth(ref);
  }
]);


sApp.factory('Data', function() {

	var data = { 
		Global: ''
	};

	return { 
		setGlobal: function (selection) { 
			data.Global = selection;
		}, getGlobal: function () { 
			return data.Global;
		}
	};

});
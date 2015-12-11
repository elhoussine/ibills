

var cApp = angular.module('starter.controllers', ['ionic', 'firebase', 'ngCordova']);

// ibills firebase app ref 
var  ibillsRef = new Firebase("https://ibills.firebaseio.com/");
var usersRef = ibillsRef.child("users");
var uid = null;

// creating variable that holds uid of admins
var admins = ["532db796-c084-4709-918c-1dc11b68a039", "19f947ae-6e6b-43e2-a27c-aa930c7bb158"];


// sign up controller 
cApp.controller('SignupCtrl', function($scope, $ionicLoading) { 

  // storing signup credenttials in object 
  $scope.signupData = {};


});







// login controller 
cApp.controller('LoginCtrl', function($scope, $rootScope, $ionicPopup, $state, $ionicHistory, $ionicLoading) { 

  // clears nav history so we dont have 'back' button when we logout
  $ionicHistory.clearHistory();

  // storing login data 
  $scope.loginData = {}; 

  // function that clears input data 
  $scope.clearFields = function () { 
    $scope.loginData.email = "";
    $scope.loginData.password = "";
  };

  // creatng a callback to handle the result of Authertication process
  function authHandler(error, authData) { 
    if (error) { 
      // error while loggin in 
      console.log("error while loggin in: ", error); 

      // showing alert when credentials are incorrect 
      alert("Incorrect Credentials");

      // hiding ionic loading 
      $ionicLoading.hide();
    } else { 
      // login successfull
      console.log("authenticated succcessfully with payload: ", authData.uid);

      // cleating input data
      $scope.clearFields();

      // checking id of user if admin redirect to admin page if customer redirect to home
      for (i = 0; i < admins.length; i++) { 

        // setting the global uid variable 
        uid = authData.uid;

        // enum through admins arrays
        if (authData.uid == admins[i]) { 

          // incase of admin id 
          console.log(admins[i]);
          console.log("this is an admin");

          // removing ionic loading 
          $ionicLoading.hide();

          // redirecting to admin ctrl panel 
          $state.go('controlPanel');
          break;
        } else { 

          // incase of customer
          console.log("this is NOT an admin");

          // removing ionic loading 
          $ionicLoading.hide();

          // reditredt user to home page
          $state.go('home');
        }
      }
    }
  };

  // login function 
  $scope.login = function () { 
    // showing ionic loading 
    $ionicLoading.show();

    // authing the user with username and password
    ibillsRef.authWithPassword({

      // passing in login data 
      email: $scope.loginData.email, 
      password: $scope.loginData.password

      // the auth handler gets executed
    }, authHandler);
  };

  // // quick login: 
  //   // authing the user with username and password
  //   ibillsRef.authWithPassword({

  //     // passing in login data 
  //     email: "q@q.com", 
  //     password: "q"

  //     // the auth handler gets executed
  //   }, authHandler);


  // sign up function 
  $scope.signup = function () { 

    // showing ionic loading 
    $ionicLoading.show();

    // creating users ref 

    // calling createUser function from firebase lib
    usersRef.createUser({
      // passing sign up credentials
      email: $scope.loginData.email, 
      password: $scope.loginData.password

    }, function(error, userData) { 
      // after the createUser has been called 

      if (error) { 
        // there is an error
        console.log("Login signing up: ", error);

        // showing alert box 
        alert("Ops! Recheck email and password");

        // hiding ionic loading 
        $ionicLoading.hide();

      } else { 

        // authing the user with username and password
        ibillsRef.authWithPassword({

          // passing in login data 
          email: $scope.loginData.email, 
          password: $scope.loginData.password

          // the auth handler gets executed
        }, authHandler);
      }
    }
    );
  };
});















// home page controller 
cApp.controller('HomeCtrl', function($cordovaBarcodeScanner, $scope, $rootScope, $state, $ionicModal, Auth, $firebaseArray) { 

  // user's auth 
  $scope.auth = Auth; 
  $scope.auth.$onAuth(function(authData) { 
    $scope.authData = authData;
    if ($scope.authData == null) { 
      // debuggin 
      console.log("user is not logged in "); 

      // no login -> redirect to login page 
      $state.go('login');
    } else { 
      // debuggin 
      console.log("user is logged in! uid: ", $scope.authData.uid);

      // setting global uid to uid from auth data
      uid = $scope.authData.uid;



  var currentUserRef = usersRef.child(uid);
  var usersBillsRef = currentUserRef.child("bills");

  // defining input models
  $scope.newbill = {};

  // checking auth and setting ith data
  $scope.auth = Auth; 
  $scope.auth.$onAuth(function(authData) { 
    $scope.authData = authData;
    if ($scope.authData == null) { 
      // debuggin 
      console.log("user is not logged in "); 

      // no login -> redirect to login page 
      $state.go('login');
    } else { 
      // debuggin 
      console.log("user is logged in! uid: ", $scope.authData.uid);

      // setting global uid to uid from auth data
      uid = $scope.authData.uid;
    }
  });

  // function to logout user
  $scope.logout = function () { 
    // performing unauth
    ibillsRef.unauth();

    // reseting user id variables 
    uid = null;
    $scope.authData = null;

    // redirecting to login page
    $state.go('login');


    // debugging purpose 
    console.log("user logged out successfully");
  };


  // array to hold retrieved all bills and customer bills 
  $scope.usersBills= [];

 

		// getting meals from database
		$scope.getBills = function () { 

      $scope.usersBills = $firebaseArray(usersBillsRef);
    };


       $scope.doRefresh = function() {
    $scope.$broadcast('scroll.refreshComplete');
    $scope.$apply()
  };
    // calling get/retrieve bills function 
    $scope.getBills();


    // testing barcode scanner 
    $scope.scanBarcode = function () { 
      // calling cordova plugin 
      $cordovaBarcodeScanner
      .scan()
      .then(function(barcodeData) {
        // Success! Barcode data is here
        var str = barcodeData.text;

      var partsOfStr = str.split(',');
      var itemsCount = 0;
      var itemsArray = [];

      for (i = 7; i < partsOfStr.length; i+=3) { 
        console.log("items: " + partsOfStr[i] + " price: " + partsOfStr[i+1] + " quantity: " + partsOfStr[i+2]);
        itemsArray.push({
          name: partsOfStr[i], 
          price: parseFloat(partsOfStr[i+1]), 
          quantity: parseFloat(partsOfStr[i+2])
        });
        itemsCount++;
      }


      

      var saveBill = usersBillsRef.push();

      saveBill.set({
        
        bill_issuer: partsOfStr[0],
        date: partsOfStr[1],
        bill_number: parseFloat(partsOfStr[2]), 
        payment_method: partsOfStr[3],
        cash_in: parseFloat(partsOfStr[4]),
        change: parseFloat(partsOfStr[5]),
        return_policy: partsOfStr[6],
        zitems: itemsArray

      });
  

      }, function(error) {
        // An error occurred
        alert("error scanning");
      });
};

// works just fine 
$scope.addBill = function() { 
  console.log("inside add bill");


      /* 
      text to be analyzed : 
      police,12Nov2015,22122,ef83537d-95a4-48c4-899b-290408383f29,cash,500,450,no return after one week,karak,1,2,water,3,4
      */

      // trying to analyze text
      var str = "what,12Nov2015,3303,cash,100,20,not applicable,100MB package,50,1,1000 Minutes,100,2";
      var partsOfStr = str.split(',');
      var itemsCount = 0;
      var itemsArray = [];

      for (i = 7; i < partsOfStr.length; i+=3) { 
        console.log("items: " + partsOfStr[i] + " price: " + partsOfStr[i+1] + " quantity: " + partsOfStr[i+2]);
        itemsArray.push({
          name: partsOfStr[i], 
          price: parseFloat(partsOfStr[i+1]), 
          quantity: parseFloat(partsOfStr[i+2])
        });
        itemsCount++;
      }


      

      var saveBill = usersBillsRef.push();

      saveBill.set({
        
        bill_issuer: partsOfStr[0],
        date: partsOfStr[1],
        bill_number: parseFloat(partsOfStr[2]), 
        payment_method: partsOfStr[3],
        cash_in: parseFloat(partsOfStr[4]),
        change: parseFloat(partsOfStr[5]),
        return_policy: partsOfStr[6],
        zitems: itemsArray

      });
    };



     // modal for selected bill 
    $ionicModal.fromTemplateUrl('templates/selectedBill.html', {
      scope: $scope, 
      animation: 'slide-in-up'
    }).then(function(modal) { 
     $scope.billModal = modal;
   });

    $scope.selectedBillShow = function () { 
     $scope.billModal.show();
   };

   $scope.closeBillModal = function() { 
     $scope.billModal.hide();
   };

    // clean up modal when done with it 
    $scope.$on('$destroy', function() { 
      $scope.billModal.remove();
    });

    // execute action on hide modal 
    $scope.$on('billModal.hidden', function() { 
      // execute action
      // console.log("modal hidden!");
    });

    // execute action on removal of modal 
    $scope.$on('billModal.remove', function () { 
      // execute action
      console.log("modal destroyed!");
    });


    $scope.billClicked = function($index) { 


      // passing clicked bill to modal scope
      $scope.selectedBill = $scope.usersBills[$index];

      // setting scope uid to use as customer id 
      $scope.uid = uid;

      // showing modal
      $scope.selectedBillShow();
    };

$scope.test = function () {
  $( "#item" ).toggle( "highlight" );
}

    }
  });
  });












myApp.controller('PanelCtrl', function($state, $scope) { 
  // function to logout admin
  $scope.logout = function() { 
    ibillsRef.unauth();
    $state.go('login');

    // debugging purpose 
    console.log("user logged out successfully");
  };

});


// selected meal modal controller
myApp.controller('SelectedBillCtrl', function($scope) { 


  // delete bill function 
  $scope.deleteBill = function() { 
    var userRef = usersRef.child($scope.uid);
    var usersBillsRef = userRef.child("bills")
    usersBillsRef.child($scope.selectedBill.$id).remove();
    $scope.closeBillModal();
  };

});





































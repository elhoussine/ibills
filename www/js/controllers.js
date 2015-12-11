

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
cApp.controller('HomeCtrl', function($cordovaBarcodeScanner, $scope, $rootScope, $state, $ionicModal, Auth, $firebaseArray, $ionicLoading) { 

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



		// getting bills from database
		$scope.getBills = function () { 

      // showing ionic loading icon in beginning of data fetching 
      $ionicLoading.show();

      $scope.usersBills = $firebaseArray(currentUserRef);

      // setting a callback to hide ionic loading 
      $scope.usersBills.$loaded(function(x){ 

        $ionicLoading.hide();

      }, function(error){});
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


      
      var issuerRef = currentUserRef.child(partsOfStr[0]);
      var issuerBillsRef = issuerRef.child("bills");
      var saveBill = issuerBillsRef.push();

      // miliseconds since Jan 01 1970 
      var timestamp = new Date().getTime();

      saveBill.set({

        bill_issuer: partsOfStr[0],
        date: timestamp,
        bill_number: parseFloat(partsOfStr[1]), 
        payment_method: partsOfStr[2],
        cash_in: parseFloat(partsOfStr[3]),
        change: parseFloat(partsOfStr[4]),
        return_policy: partsOfStr[5],
        total: partsOfStr[6],
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

      // trying to analyze text
      var str = "Ministry of Health,3303,cash,100,20,not applicable,100,Panadol,10,5,Ani Biotic,100,2";
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


      
      var issuerRef = currentUserRef.child(partsOfStr[0]);
      var issuerBillsRef = issuerRef.child("bills");
      var saveBill = issuerBillsRef.push();

      // miliseconds since Jan 01 1970 
      var timestamp = new Date().getTime();

      saveBill.set({

        bill_issuer: partsOfStr[0],
        date: timestamp,
        bill_number: parseFloat(partsOfStr[1]), 
        payment_method: partsOfStr[2],
        cash_in: parseFloat(partsOfStr[3]),
        change: parseFloat(partsOfStr[4]),
        return_policy: partsOfStr[5],
        total: partsOfStr[6],
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


    $scope.billClicked = function($issuer, $index) { 


      // creating different refs to get particular issuer bills
      var issuerRef = currentUserRef.child($issuer);
      var issuerBillsRef = issuerRef.child("bills");
      var issuerBills = $firebaseArray(issuerBillsRef);

      // callback to loading bills that assigns $scope.selectedBills and shows modal
      issuerBills.$loaded(function(x) { 


      // passing clicked bill to modal scope
      $scope.selectedBill = issuerBills[$index];      
      console.log($scope.selectedBill);

      // setting scope uid to use as customer id 
      $scope.uid = uid;
      $scope.clickedIssuer = $issuer;

      // showing modal
      $scope.selectedBillShow();
      }, function(error) { 
        console.log("error loading issuer bills");
      });

    };


    $scope.getDateString = function (timestamp) { 
      // getting string 
      var date = new Date(timestamp);
      var dateString = date.toString();
      var dateStringFinal = dateString.substring(0, dateString.length-14);

      return dateStringFinal;
    };


    // you are exiting auth state 
  }
});
});



// selected meal modal controller
myApp.controller('SelectedBillCtrl', function($scope) { 


  // delete bill function 
  $scope.deleteBill = function() { 

    // deleting process containing multiple refs 
    var currentUserRef = usersRef.child($scope.uid);
    var issuerRef = currentUserRef.child($scope.clickedIssuer);
    var issuerBillsRef = issuerRef.child("bills");

    issuerBillsRef.child($scope.selectedBill.$id).remove();
    $scope.closeBillModal();
  };

});










myApp.controller('PanelCtrl', function($state, $scope, $ionicModal) { 
  // function to logout admin
  $scope.logout = function() { 
    ibillsRef.unauth();
    $state.go('login');

    // debugging purpose 
    console.log("user logged out successfully");
  };



  // modal business 
  // modal for settings
  $ionicModal.fromTemplateUrl('templates/admin_settings.html', {
    scope: $scope, 
    animation: 'slide-in-up'
  }).then(function(modal) { 
   $scope.settingsModal = modal;
  });

  $scope.showSettingsModal = function () { 
   $scope.settingsModal.show();
  };

  $scope.closeSettingsModal = function() { 
   $scope.settingsModal.hide();
  };


  // modal for creating new bill
  $ionicModal.fromTemplateUrl('templates/createBill.html', {
    scope: $scope, 
    animation: 'slide-in-up'
  }).then(function(modal) { 
   $scope.createBillModal = modal;
  });

  $scope.showCreateBillModal = function () { 
   $scope.createBillModal.show();
  };

  $scope.closeCreateBillModal = function() { 
   $scope.createBillModal.hide();
  };


});





myApp.controller('SettingsCtrl', function($scope) { 

  $scope.confirmSettings = function () { 
    // confirm settings button clicked
  };

});

myApp.controller('CreateBillCtrl', function($scope, $ionicPopup) { 
  
  $scope.newBill = [];
  $scope.items = [];
  $scope.numberOfItems = [];

  $scope.getNumber = function(num) {
    return new Array(num); 
  }

  $scope.create = function() { 
    // create button clicked 
    // adding bill to customer id 
    var currentUserRef = usersRef.child($scope.newBill.customer_id);
    var issuerRef = currentUserRef.child($scope.newBill.issuer);
    var issuerBillsRef = issuerRef.child("bills");
    var saveBill = issuerBillsRef.push();

    // miliseconds since Jan 01 1970 
    var timestamp = new Date().getTime();

    saveBill.set({

      bill_issuer: $scope.newBill.issuer,
      date: timestamp,
      bill_number: parseFloat($scope.newBill.number), 
      payment_method: $scope.newBill.payment_method,
      cash_in: parseFloat($scope.newBill.cash),
      change: parseFloat($scope.newBill.change),
      return_policy: $scope.newBill.return_policy,
      total: $scope.newBill.total,
      zitems: $scope.items
    });
  };

  // An alert dialog
  $scope.createBarcode = function() {

    // getting bill's string 
    var billString = new String($scope.newBill.issuer + "," + $scope.newBill.number + "," +  $scope.newBill.payment_method + "," + $scope.newBill.cash + "," + $scope.newBill.change + "," + $scope.newBill.return_policy + "," + $scope.newBill.total);

    // looping through items array to add each detail to bill's string 
    for (i = 0; i < $scope.items.length; i++) {
      billString += ",";
      billString += $scope.items[i].name;
      billString += ",";
      billString += $scope.items[i].price;
      billString += ",";
      billString += $scope.items[i].quantity;
    }

    // creating popup alert and showing it
   var alertPopup = $ionicPopup.alert({
     title: 'Kindly Scan Barcode',
     template: '<div align="center"><img src="https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=' + billString +  'alt="barcode"></div>'
   });
   alertPopup.then(function(res) {
    // after the customer clicks ok
   });
  };


});















  // // miliseconds 
  // var timestamp = new Date().getTime();
  
  // // getting string 
  // var date = new Date(timestamp);
  // var dateString = date.toString();
  // var dateStringFinal = dateString.substring(0, dateString.length-14);





























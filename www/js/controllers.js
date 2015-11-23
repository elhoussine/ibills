var cApp = angular.module('starter.controllers', ['ionic', 'firebase', 'ngCordova']);

// irebase app ref 
var myFirebaseRef = new Firebase("https://ibills.firebaseio.com/");
var uid = null;

// sign up controller 
cApp.controller('SignupCtrl', function($scope) { 

  // storing signup credenttials in object 
  $scope.signupData = {};

  // sign up function 
  $scope.signup = function () { 
    // calling createUser function from firebase lib
    myFirebaseRef.createUser({
      // passing sign up credentials
      email: $scope.signupData.email, 
      password: $scope.signupData.password

    }, function(error, userData) { 
      // after the createUser has been called 

      if (error) { 
        // there is an error
        console.log("Login signing up: ", error);

      } else { 
        // sign up successful with userData
        console.log("Sign up successfull with user id: ", userData.uid);

        // redirect to home pgae
      }
    }
    );
  };
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

    } else { 
      // login successfull
      console.log("authenticated succcessfully with payload: ", authData);

      // cleating input data
      $scope.clearFields();

      // reditredt user to home page
      $state.go('home');

    }
  };

  // // login function 
  // $scope.login = function () { 

  //   // authing the user with username and password
  //   myFirebaseRef.authWithPassword({

  //     // passing in login data 
  //     email: $scope.loginData.email, 
  //     password: $scope.loginData.password

  //     // the auth handler gets executed
  //   }, authHandler);
  // };

  // quick login: 
    // authing the user with username and password
    myFirebaseRef.authWithPassword({

      // passing in login data 
      email: "q@q.com", 
      password: "q"

      // the auth handler gets executed
    }, authHandler);

});









// add item modal controller
cApp.controller('ModalCtrl', function($scope, $rootScope) { 

  // array that will hold Items 
  $scope.Items = [];
  // getting fields inputs 
  $scope.Bill = []; 
  // testing
  $scope.numberOfItems = 1; 

  $scope.test = function (num) { 
    return new Array(num);

  };

  // add item field
  $scope.addItem = function() { 
    // adding one to items array
    // $scope.numberOfItems += 1;
    $scope.Items.push({});
  };



  // saviing adding bill 
  // creating referance 
  var billsRef = myFirebaseRef.child("Bills"); 
  var itemsRef = billsRef.child("Items");

  // adding bill 
  $scope.addBill = function () { 
    

    // pushing my dick in it 
    // billsRef.push().set({ 
    //   billID: $scope.Bill.id, 
    //   billAuth: $scope.Bill.authority,
    //   billCustomerName: $scope.Bill.customerName, 
    //   billCustomerID: $scope.Bill.customerId, 
    //   billPaymentMethod: $scope.Bill.paymentMethod, 
    //   billPayment: $scope.Bill.payment, 
    //   billChange: $scope.Bill.change, 
    //   billReturnPolicy: $scope.Bill.returnPolicy,
    // });

    for (item in $scope.Items) { 
      // itemsRef.push().set({
      //   name: item.name, 
      //   price: item.price, 
      //   quantity: item.quantity
      // });
console.log("name: " + item.name + " price: " + item.price + " Quantity: " + item.quantity);
    }
  };


	// I will create databes called meals if not already created. 
  var mealsRef = myFirebaseRef.child("Meals"); 

  $scope.newMeal = {};

    // function that adds the meal object 
    $scope.addMeal = function () { 
    	// referance to database location 
    	mealsRef.child($scope.newMeal.name).set({
        name: $scope.newMeal.name,
        price: $scope.newMeal.price, 
        uid: uid
      });

    	// console buggin 
    	console.log("successfull added yaw!");

      // clearing the fucking fields
      $scope.clearFields();

    	// closing modal 
    	$scope.closeAddModal();
    };

    // function to clear the fuck out of fields 
    $scope.clearFields = function () { 
      $scope.newMeal.name = "";
      $scope.newMeal.price = "";
    };

  });






// home page controller 
cApp.controller('HomeCtrl', function($cordovaBarcodeScanner, $scope, $rootScope, $state, $ionicModal, Auth, $firebaseArray) { 

  // debugging
  console.log("inside HomeCtrl"); 

  // checking auth and setting aith data
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
    myFirebaseRef.unauth();
    $state.go('login');

    // debugging purpose 
    console.log("user logged out successfully");
  };

  // array hold fetched meals
  // $scope.allMeals = null;

		// getting meals from database
		$scope.getMeals = function () { 
      // setting ref
      var ref = new Firebase("https://ibills.firebaseio.com/Meals");

      // setting array with all meals 
      $scope.allMeals = $firebaseArray(ref);
    };

    // modal for selected meal 
    $ionicModal.fromTemplateUrl('templates/selectedMeal.html', {
      scope: $scope, 
      animation: 'slide-in-up'
    }).then(function(modal) { 
     $scope.mealModal = modal;
   });

    $scope.selectedMealShow = function () { 
     $scope.mealModal.show();
   };

   $scope.closeMealModal = function() { 
     $scope.mealModal.hide();
   };

    // clean up modal when done with it 
    $scope.$on('$destroy', function() { 
      $scope.mealModal.remove();
    });

    // execute action on hide modal 
    $scope.$on('mealModal.hidden', function() { 
      // execute action
      // console.log("modal hidden!");
    });

    // execute action on removal of modal 
    $scope.$on('mealModal.remove', function () { 
      // execute action
      console.log("modal destroyed!");
    });

		// modal for add item 
		$ionicModal.fromTemplateUrl('templates/addItem.html', {
      scope: $scope, 
      animation: 'slide-in-up'
    }).then(function(modal) { 
     $scope.addModal = modal;
   });

    $scope.addItem = function () { 
     $scope.addModal.show();
   };

   $scope.closeAddModal = function() { 
     $scope.addModal.hide();
   };

		// clean up modal when done with it 
		$scope.$on('$destroy', function() { 
			$scope.addModal.remove();
		});

		// execute action on hide modal 
		$scope.$on('addModal.hidden', function() { 
			// execute action
			// console.log("modal hidden!");
		});

		// execute action on removal of modal 
		$scope.$on('addModal.remove', function () { 
			// execute action
			console.log("modal destroyed!");
		});

    // getting meals from this lovely function 
    $scope.getMeals(); 

    // on meal click 
    $scope.mealClicked = function ($index) { 
      console.log("index: ", $index, "meal name: ", $scope.allMeals[$index].name, " Price: ", $scope.allMeals[$index].price);

      // setting selected meal depending on index
      $scope.selectedMeal = $scope.allMeals[$index];

      // setting fixed meal name so we can referance to it when saving 
      $scope.fixedCurrentMeal = $scope.selectedMeal.name;
      $scope.fixedCurrentPrice = $scope.selectedMeal.price;

      // showing modal for selected meal 
      $scope.selectedMealShow();
    };

    // testing barcode scanner 
    $scope.scanBarcode = function () { 
      // calling cordova plugin 
     $cordovaBarcodeScanner
      .scan()
      .then(function(barcodeData) {
        // Success! Barcode data is here
        alert(barcodeData.text);

      }, function(error) {
        // An error occurred
        alert("error scanning");
      });
    };

    // testing encoding barcode
    $scope.encodeBarcode = function () { 
          // NOTE: encoding not functioning yet
    $cordovaBarcodeScanner
      .encode(BarcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com")
      .then(function(success) {
        // Success!
        alert("encode success: " + success);
      }, function(error) {
        // An error occurred
        alert("encode failed: " + error);
      });
    };
  });










cApp.controller('SelectedMealCtrl', function($scope) { 
  // meals ref
  var mealsRef = new Firebase("https://ibills.firebaseio.com/Meals"); 

  // funcion for 'save changes' button 
  $scope.updateMeal = function () { 
    // debugging 
    console.log("save changes have been clicked");

    // checking if user clicked 'change' with leaving at least one field empty
    if ($scope.selectedMeal.name == '' || $scope.selectedMeal.price == '') { 
      // debugging
      console.log("user left fields empty");

      // showing alert to user "cannot leave empty"
      alert("You cannot leave that empty!");
    } else { 
      // debuggin 
      console.log("fields are not empty");

      if ($scope.fixedCurrentPrice != $scope.selectedMeal.price && $scope.fixedCurrentMeal == $scope.selectedMeal.name) { 
        console.log("only price changes");

        // incase of change of price only 
        // adding new item with new entries 
        mealsRef.child($scope.selectedMeal.name).update({
          price: $scope.selectedMeal.price
        });
      } else {
        console.log("not only price changes");
        // starting the update process      
        // adding new item with new entries 
        mealsRef.child($scope.selectedMeal.name).set({
         name: $scope.selectedMeal.name,
         price: $scope.selectedMeal.price, 
         uid: uid
      });

      // deleting current piece of yack 
      var toDelete = mealsRef.child($scope.fixedCurrentMeal);
      toDelete.remove();
    }

      // dismissing modal
      $scope.closeMealModal(); 
    }
  };

  // function to delete meal 
  $scope.deleteMeal = function () { 
    // deleting current piece of yack 
    var toDelete = mealsRef.child($scope.selectedMeal.name);
    toDelete.remove(function (error) { 
      if (error) { 
        console.log("error deleting");
      } else { 
        console.log("deleted successfully"); 

      // dismissing modal
      $scope.closeMealModal();         
    }
  });
  };
});



// how the fuck I add multple items 
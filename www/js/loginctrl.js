myApp.controller('LoginCtrl', function ($scope, $ionicPlatform, Service, $state) {
  $ionicPlatform.ready(function () {
    screen.orientation.lock('portrait');
  });

  $scope.formData = {};
  //LOGIN FUNCTION

  $scope.invalidUser = false;
  $scope.playerLogin = function (data, login) {
    console.log("in player login")
    Service.playerLogin(data, function (data) {
      $scope.accessT = data.data;
      if (data.value) {
        console.log("$scope.accessT", $scope.accessT);
        console.log("player exist....");
        Service.sendAccessToken(data, function (data) {
          Service.setPlayer(data.data.data);
          $state.go("lobby");
        });
      } else {
        console.log("Invalid credentials");
        if (!login.$invalid) {
          $scope.invalidUser = true;
        }
        console.log(login)
      }
    })
  }


});

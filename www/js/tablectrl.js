myApp.controller('TableCtrl', function ($scope, $ionicPlatform, $ionicModal) {
  console.log('inside table ctrl');
  $ionicPlatform.ready(function () {
    screen.orientation.lock('landscape');
  })

  //fn to close all modal and tab
  $scope.closeAll = function () {
    $scope.leftMenu = false;
    $scope.showTableinfo = false;

  }

  $scope.closeAll();

  $scope.openLeftMenu = function () {
    $scope.leftMenu = true;
  }

  $scope.closeLeftMenu = function () {
    $scope.leftMenu = false;
  }

  $scope.showCard=function(){
    console.log("inside show card");
    $('.main_player .cards img:nth-child(1)').attr("src", "img/card_front.png");
    $('.main_player .cards img:nth-child(2)').attr("src", "img/card_front.png");
    $('.main_player .cards img:nth-child(3)').attr("src", "img/card_front.png");
    $(".main_player .see").css("display", "none");
  }


  //modal for player details
  $ionicModal.fromTemplateUrl('templates/modal/player-details.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.playerDetails = modal;
  });

  $scope.openPlayerDetails = function () {
    $scope.playerDetails.show();
  }

  $scope.closePlayerDetails = function () {
    $scope.playerDetails.hide();
  }

  //destroy every modal
  $scope.$on('$destroy', function () {
    $scope.closeAll();
    $scope.playerDetails.remove();
  });


});

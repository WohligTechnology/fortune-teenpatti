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


  //menu
  $scope.openLeftMenu = function () {
    $scope.leftMenu = true;
  }

  $scope.closeLeftMenu = function () {
    $scope.leftMenu = false;
  }


  // modal for table info
  $ionicModal.fromTemplateUrl('templates/modal/table_info.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.tableInfoModal = modal;
    $scope.tableInfoModal.show();
  });

  $scope.showTableInfoModal = function () {
    $scope.tableInfoModal.show();
  }
  $scope.closeTableInfoModal = function () {
    $scope.tableInfoModal.hide();
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




  //fn

  //show card fn
  $scope.showCard = function () {
    console.log("inside show card");
    $('.main_player .cards img:nth-child(1)').attr("src", "img/card_front.png");
    $('.main_player .cards img:nth-child(2)').attr("src", "img/card_front.png");
    $('.main_player .cards img:nth-child(3)').attr("src", "img/card_front.png");
    $(".main_player .see").css("display", "none");
  }


  //chal fn
  $scope.chalAmount = 1000;
  $scope.increaseChal = function () {
    $('.minus').removeClass('text_grey');
    $scope.chalAmount = $scope.chalAmount + 500;
  }

  $scope.reduceChal = function () {
    if ($scope.chalAmount > 500) {
      $scope.chalAmount = $scope.chalAmount - 500;
    }

    if ($scope.chalAmount <= 500) {
      $('.minus').addClass('text_grey');
    }
  }
  // pack fn
  $scope.pack = function () {
    // $('.pack').addClass('text_grey');
  }

  //destroy every modal
  $scope.$on('$destroy', function () {
    $scope.closeAll();
    $scope.playerDetails.remove();
    $scope.tableInfoModal.remove();
  });


});

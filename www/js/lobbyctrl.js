myApp.controller('LobbyCtrl', function ($scope, $ionicPlatform, $state, $ionicModal) {
  console.log('inside lobbyctrl');
  $ionicPlatform.ready(function () {
    screen.orientation.lock('landscape');
  })



  $scope.sound = true;

  //to close all tab,modal,popup
  $scope.closeAll = function () {
    $scope.rightMenu = false;
    $scope.leftMenu = false;
    $scope.activeVariation = false;
  }

  $scope.closeAll();


  //toggle active
  $scope.toggleVariations = function () {
    $scope.activeVariation = !$scope.activeVariation;
  }



  // onclick for each lobby
  $scope.playNow = function () {
    //if variation tab is not open then go to next page
    if (!$scope.activeVariation) {
      // $state.go('table');
      $scope.openPriceRangeModal();
    }

  }

  $scope.playJoker = function () {
    //if variation tab is not open then go to next page
    if (!$scope.activeVariation) {
      // $state.go('table');
      $scope.openPriceRangeModal();
    }
  }

  $scope.playPrivate = function () {
    //if variation tab is not open then go to next page
    if (!$scope.activeVariation) {
      // $state.go('table');
      $scope.openPriceRangeModal();
    }
  }



  //left menu
  $scope.openLeftMenu = function () {
    $scope.leftMenu = true;
  }

  $scope.closeLeftMenu = function () {
    $scope.leftMenu = false;
  }

  // right menu
  $scope.openRightMenu = function () {
    $scope.rightMenu = true;
  }
  $scope.closeRightMenu = function () {
    $scope.rightMenu = false;
  }



  // modal

  //PL  statement
  $ionicModal.fromTemplateUrl('templates/modal/pl_statement.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.PLStatementModal = modal;
  });
  $scope.openPLStatementModal = function () {
    $scope.PLStatementModal.show();
  }
  $scope.closePLStatementModal = function () {
    $scope.PLStatementModal.hide();
  }

  //transfer statement
  $ionicModal.fromTemplateUrl('templates/modal/transfer_statement.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.TransferStatementModal = modal;
  });
  $scope.openTransferStatementModal = function () {
    $scope.TransferStatementModal.show();
  }
  $scope.closeTransferStatementModal = function () {
    $scope.TransferStatementModal.hide();
  }

  //account statement
  $ionicModal.fromTemplateUrl('templates/modal/account_statement.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.ACStatementModal = modal;
  });
  $scope.openACStatementModal = function () {
    $scope.ACStatementModal.show();
  }
  $scope.closeACStatementModal = function () {
    $scope.ACStatementModal.hide();
  }



  //game price range 
  $ionicModal.fromTemplateUrl('templates/modal/game_price_range.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.priceRangeModal = modal;

  });
  $scope.openPriceRangeModal = function () {
    $scope.priceRangeModal.show();
  }
  $scope.closePriceRangeModal = function () {
    $scope.priceRangeModal.hide();
  }

  //destroy every modal
  $scope.$on('$destroy', function () {
    $scope.closeAll();
    $scope.PLStatementModal.remove();
    $scope.TransferStatementModal.remove();
    $scope.ACStatementModal.remove();
    $scope.priceRangeModal.remove();
  });



});

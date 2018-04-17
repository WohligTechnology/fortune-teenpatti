myApp.controller('LobbyCtrl', function ($scope, $ionicPlatform, $state, $timeout, Service, $ionicModal) {

  //ionic cordova 
  $ionicPlatform.ready(function () {
    screen.orientation.lock('landscape');
    if (window.cordova) {
      window.plugins.NativeAudio.stop('timer');
      window.plugins.NativeAudio.stop('coin');
      window.plugins.NativeAudio.stop('winner');
      window.plugins.NativeAudio.stop('shuffle');
      window.plugins.NativeAudio.stop('button');
    }

  })
  $ionicPlatform.registerBackButtonAction(function (event) {
    event.preventDefault();
  }, 100);
  screen.orientation.lock('landscape');
  //end of ionic cordova


  //*************basic ui login***************


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

  //end of basic ui login


  // modal initialize

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

  $ionicModal.fromTemplateUrl('templates/modal/transfer_statement.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.transferStatementData = [];
    $scope.paging = {
      maxPage: 1
    };
    $scope.pageNo = 1;
    $scope.loadingDisable = false;
    $scope.TransferStatementModal = modal;
  });

  $scope.openTransferStatementModal = function () {
    $scope.transferStatementData = [];
    $scope.paging = {
      maxPage: 1
    };
    $scope.pageNo = 1;
    $scope.loadingDisable = false;
    $scope.TransferStatementModal.show();
  }
  $scope.closeTransferStatement = function () {
    $scope.TransferStatementModal.hide();
  }
  //Transfer Statement
  $scope.loadTransferMore = function () {
    if ($scope.pageNo < $scope.paging.maxPage) {
      $scope.pageNo++;
      $scope.loadingDisable = true;
      $scope.accountStatement();
    } else {

    }
  };

  $scope.transferStatement = function () {
    Service.searchPlayerTransaction($scope.memberId, $scope.pageNo, function (data) {
      if (data) {
        if (data.data.data.total === 0) {
          $scope.noDataFound = true;
          // Error Message or no data found 
          // $scope.displayMessage = {
          //   main: "<p>No Data Found.</p>",
          // };
        }
        $scope.paging = data.data.data.options;
        _.each(data.data.data.results, function (n) {
          $scope.transferStatementData.push(n);
        });
        $scope.loadingDisable = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      } else {}
    });
  };

  $ionicModal.fromTemplateUrl('templates/modal/account_statement.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.results = [];
    $scope.pageNo = 1;
    $scope.loadingDisable = false;
    $scope.paging = {
      maxPage: 1
    };
    $scope.ACStatementModal = modal;
  });
  $scope.openACStatementModal = function () {
    $scope.results = [];
    $scope.pageNo = 1;
    $scope.loadingDisable = false;
    $scope.paging = {
      maxPage: 1
    };
    $scope.ACStatementModal.show();
  }
  $scope.closeACStatement = function () {
    $scope.ACStatementModal.hide();
  }

  //Account Statement
  $scope.loadMore = function () {
    if ($scope.pageNo < $scope.paging.maxPage) {
      $scope.pageNo++;
      $scope.loadingDisable = true;
      $scope.accountStatement();
    } else {

    }
  };

  $scope.accountStatement = function () {
    Service.getTransaction($scope.pageNo, function (data) {
      if (data) {
        if (data.data.data.total === 0) {
          $scope.noDataFound = true;
          // Error Message or no data found 
          // $scope.displayMessage = {
          //   main: "<p>No Data Found.</p>",
          // };
        }
        $scope.paging = data.data.data.options;
        _.each(data.data.data.results, function (n) {
          $scope.results.push(n);
        });
        $scope.loadingDisable = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      } else {}
    });
  };

  $ionicModal.fromTemplateUrl('templates/modal/table-info.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.priceRangeModal = modal;

  });
  $scope.openPriceRangeModal = function (type, gameType) {
    $scope.type = type;
    $scope.gameType = gameType;
    $scope.priceRangeModal.show();
  }
  $scope.closePriceRangeModal = function () {
    $scope.priceRangeModal.hide();
  }


  //password change
  $ionicModal.fromTemplateUrl('templates/modal/change-password.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.changePasswordModal = modal;
  });

  $scope.openChangePasswordModal = function () {
    $scope.data = {};
    $scope.fail1 = false;
    $scope.success = false;
    $scope.fail2 = false;
    $scope.changePasswordModal.show();
  }
  $scope.closeChangePasswordModal = function () {
    $scope.changePasswordModal.hide();
  }

  //my private Table Info 
  $ionicModal.fromTemplateUrl('templates/modal/private-table-info.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.myPrivateModal = modal;
    $scope.privateTableDatas = [];
    $scope.paging = {
      maxPage: 1
    };
    $scope.pageNo = 1;
    $scope.loadingDisable = false;
  });
  $scope.openMyPrivateModal = function () {
    $scope.privateTableDatas = [];
    $scope.paging = {
      maxPage: 1
    };
    $scope.pageNo = 1;
    $scope.loadingDisable = false;
    $scope.myPrivateModal.show();
  }
  $scope.closeMyPrivateModal = function () {
    $scope.myPrivateModal.hide();
  }

  //Private Table Info
  $scope.loadMorePrivateTable = function () {
    if ($scope.pageNo < $scope.paging.maxPage) {
      $scope.pageNo++;
      $scope.loadingDisable = true;
      $scope.myPrivateTable();
    } else {

    }
  };

  $scope.myPrivateTable = function () {
    Service.getPrivateTables($scope.pageNo, function (data) {
      if (data) {
        if (data.data.data.total === 0) {
          $scope.noDataFound = true;
          // Error Message or no data found 
          // $scope.displayMessage = {
          //   main: "<p>Your Private table is empty.</p><p>Create your private table to view.</p>",
          // };
        }
        $scope.paging = data.data.data.options;
        _.each(data.data.data.results, function (n) {
          $scope.privateTableDatas.push(n);
        });
        $scope.loadingDisable = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      } else {}
    });
  };


  //private Table

  $ionicModal.fromTemplateUrl('templates/modal/create-private-table.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.ModalCreate = modal;
  });

  $scope.createPrivateModal = function ($event) {
    $scope.ModalCreate.show();
    $event.stopPropagation();
  }
  $scope.closePrivateTable = function () {
    $scope.ModalCreate.hide();
  };

  //Rules

  $ionicModal.fromTemplateUrl('templates/modal/rules.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.rulesModal = modal;
  });

  $scope.openRulesModal = function ($event) {
    $scope.rulesModal.show();
    $event.stopPropagation();
  }
  $scope.closeRulesModal = function () {
    $scope.rulesModal.hide();
  };

  //private table info modal

  $ionicModal.fromTemplateUrl('templates/modal/private-table-info.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.ModalInfo = modal;
  });

  $scope.openMyPrivateTable = function () {
    $scope.privateTableDatas = [];
    $scope.ModalInfo.show();

  }


  //privatetable call
  $scope.createPrivateTable = function (formData) {
    Service.createTable(formData, function (data) {
      if (data.value) {
        $scope.privateTableData = data.data;
        $timeout(function () {
          $scope.privateTableData = false;
        }, 10000);
      } else {}
    });
  };

  //private table  login in 
  $ionicModal.fromTemplateUrl('templates/modal/private-table-login.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.privateLogInModal = modal;
  });

  $scope.showPrivateLogInModal = function () {
    $scope.privateLogInModal.show();
  }
  $scope.closePrivateLogInModal = function () {
    $scope.privateLogInModal.hide();
  };

  $scope.goToPrivateTableLogIn = function (data) {
    $scope.privateDataForModal = data;
    $scope.showPrivateLogInModal();
    //
  }

  $scope.goToPrivateTable = function (tableID, password) {
    Service.getAccessToTable({
      'tableId': tableID,
      'password': password
    }, function (data) {
      if (data.data.value) {
        $scope.tableId = data.data.data._id;
        $scope.closePrivateLogInModal();
        $scope.closePriceRangeModal();
        $timeout(function () {
          $state.go('table', {
            'id': $scope.tableId
          });
        }, 300)
      } else {
        $scope.errorInPrivateLogIn = true;
      }

    })

  };

  //end of modal initialize

  $scope.accessToken = $.jStorage.get("accessToken");

  //reset Page
  $scope.resetpage = function () {
    $scope.pageNo = 1;
    $scope.cachedPage = 1;
    $scope.loadingDisable = false;
    $scope.results = [];
    $scope.transferStatementData = [];
    $scope.privateTableDatas = [];
    $scope.tablesData = [];
    $scope.tablesDataFilter = [];
    $scope.noDataFound = false;
    $scope.paging = {
      maxPage: 1
    };
  }

  $scope.resetpage();
  $scope.filterType = ['private', 'public'];



  $scope.playerData = function () {
    Service.sendAccessToken(function (data) {
      $scope.singlePlayerData = data.data.data;
      $scope.image = $scope.singlePlayerData.image;
      $scope.memberId = $scope.singlePlayerData._id;
      $scope.username = $scope.singlePlayerData.username;
      $scope.userType = $scope.singlePlayerData.userType;
      $scope.balance = $scope.singlePlayerData.creditLimit + $scope.singlePlayerData.balanceUp;
    })
  };

  $scope.playerData();


  $scope.playNow = function ($event) {
    if (!$scope.activeVariation) {
      $scope.openPriceRangeModal(null, 'Normal');
      $event.stopPropagation();
    }
  }

  $scope.getcheck = function () {
    return $scope.loadingDisable;
  }
  $scope.loadMoreFilterTable = function () {
    if ($scope.pageNo < $scope.paging.maxPage) {
      $scope.pageNo++;
      $scope.loadingDisable = true;
      $scope.filterTables();
    } else {}
  };

  //Filter Table Data

  $scope.filterTables = function () {
    Service.getFilterTableData($scope.filterData, $scope.pageNo, function (data) {
      if (data) {
        if (data.data.data.total === 0) {
          $scope.noDataFound = true;
          // Error Message or no data found 
          // $scope.displayMessage = {
          //   main: "<p>No Data Found.</p>",
          // };
        }
        $scope.paging = data.data.data.options;
        _.each(data.data.data.results, function (n) {
          $scope.tablesDataFilter.push(n);
        });
        $scope.loadingDisable = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      } else {}
    });
  };

  //resetFilter
  $scope.resetFilter = function () {
    $scope.filterData = {};
    if ($scope.type || $scope.gameType) {
      $scope.type ? $scope.filterData.type = $scope.type : '';
      $scope.gameType ? $scope.filterData.gameType = $scope.gameType : '';
    }
    $scope.tablesDataFilter = [];
    $scope.filterTables();
  };


  $scope.playJoker = function ($event) {

    if (!$scope.activeVariation) {
      $scope.openPriceRangeModal(null, 'Joker');
      $event.stopPropagation();

    }
  }


  $scope.playPrivate = function () {
    //if variation tab is not open then go to next page
    if (!$scope.activeVariation) {
      // $state.go('table');
      $scope.openPriceRangeModal('private', null);
    }
  }






  //Table Selection
  // Service.tableData(function (data) {
  //   $scope.tableData = data.data.data.results;
  //   console.log(" $scope.tableData ", $scope.tableData);
  // });


  $scope.goToTable = function (table) {
    $scope.tableId = table._id;
    $scope.closePriceRangeModal();
    $timeout(function () {
      $state.go('table', {
        'id': $scope.tableId
      });
    }, 300)


  }


  //change password//

  $scope.passwordChange = function (data) {
    $scope.passwordData = data;
    if (data.newPassword == data.repeatPassword) {
      $scope.playerData = $.jStorage.get("player");
      $scope.passwordData._id = $scope.memberId;

      $scope.changePasswordPromise = Service.passwordchange(data, function (data) {
        if (data.data == "Old password did not match") {
          $scope.fail1 = true;
          $scope.success = false;
          $scope.fail2 = false;
        } else if (data.data == "Password changed") {
          $scope.success = true;
          $scope.fail1 = false;
          $scope.fail2 = false;
        }

      });

    } else {
      $scope.fail2 = true;
      $scope.success = false;
      $scope.fail1 = false;
    }
  };


  $scope.logout = function () {
    console.log("inside logout");
    Service.playerLogout(function (data) {
      console.log("logout", data);
      if (data.data.value) {
        $.jStorage.flush();
        $state.go('login');
      }
    });
  }




  //destroy every modal
  $scope.$on('$destroy', function () {
    $scope.closeAll();
    $scope.PLStatementModal.remove();
    $scope.TransferStatementModal.remove();
    $scope.ACStatementModal.remove();
    $scope.priceRangeModal.remove();

    // $scope.PLModal.remove();
    $scope.changePasswordModal.remove();
    $scope.privateLogInModal.remove();
    $scope.rulesModal.remove();
  });

});

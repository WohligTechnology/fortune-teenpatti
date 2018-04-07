var updateSocketFunction;
var showWinnerFunction;
var sideShowSocket;
var myTableNo = 0;

myApp.controller('TableCtrl', function ($scope, $ionicModal, $ionicPlatform, $state, Service, $stateParams, $timeout, $interval) {


  //Basic ui login


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


  //End of basic ui login




  //modal


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
    if (!$scope.sitHere) {
      $scope.playerDetails.show();
    }

  }

  $scope.closePlayerDetails = function () {
    $scope.playerDetails.hide();
  }



  $ionicModal.fromTemplateUrl('templates/modal/sideshow.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.sideShowModal = modal;
    // $scope.sideShowModal.show();/
  });

  $scope.showSideShowModal = function () {
    $scope.sideShowModal.show();
  };

  $scope.closeSideShowModal = function () {
    $scope.sideShowModal.hide();
  };

  $ionicModal.fromTemplateUrl('templates/modal/message.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.messageModal = modal;
    // $scope.showMessageModal();

  });

  $scope.showMessageModal = function () {
    $scope.messageModal.show();
    $timeout(function () {
      $scope.closeMessageModal();
    }, 3000);
  };
  $scope.closeMessageModal = function () {
    $scope.messageModal.hide();
  };

  $ionicModal.fromTemplateUrl('templates/modal/insufficient-funds.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.insufficientFundsModal = modal;
    // $scope.showMessageModal();

  });

  $scope.showInsufficientFundsModal = function () {
    $scope.insufficientFundsModal.show();
    $timeout(function () {
      $scope.closeInsufficientFundsModal();
    }, 2000);
  };
  $scope.closeInsufficientFundsModal = function () {
    $scope.insufficientFundsModal.hide();
  };
  //Make Tip modal
  $ionicModal.fromTemplateUrl('templates/modal/make-tip.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.makeTipModal = modal;
  });
  $scope.openMakeTipModal = function () {
    $scope.makeTipModal.show();
  };
  $scope.closeMakeTipModal = function () {
    $scope.makeTipModal.hide();
  };
  //end of modal


  myTableNo = 0;
  $ionicPlatform.ready(function () {
    screen.orientation.lock('landscape');
  });
  $ionicPlatform.on('pause', function () {
    // Handle event on pause
    $scope.destroyAudio();
  });

  //back button
  $ionicPlatform.onHardwareBackButton(function (event) {
    event.preventDefault();
    event.stopPropagation();
  });
  $ionicPlatform.registerBackButtonAction(function (event) {
    event.preventDefault();
  }, 100);




  //game logic
  $scope.playerData = function () {
    Service.sendAccessToken(function (data) {
      if (data && data.data && data.data.data) {
        $scope.singlePlayerData = data.data.data;
        $scope.image = $scope.singlePlayerData.image;
        $scope.username = $scope.singlePlayerData.username;
        $scope.userType = $scope.singlePlayerData.userType;
        $scope.balance = $scope.singlePlayerData.creditLimit + $scope.singlePlayerData.balanceUp;
        $scope.memberId = data.data.data._id;
      } else {
        $state.go("login");
      }
    });
  };
  $scope.playerData();

  $scope.updateSocketVar = 0;
  $scope.sideShowDataFrom = 0;
  $scope.tableId = $stateParams.id;

  if (_.isEmpty($scope.tableId)) {
    $state.go("lobby");
  }

  Service.getOneTable($stateParams.id, function (data) {
    $scope.gotTableInfo = true;
    $scope.tableData = data.data.data;
    $scope.bootAmt = $scope.tableData.bootAmt;
    $scope.chalLimit = $scope.tableData.chalLimit;
    $scope.blindAmt = $scope.tableData.blindAmt;
    $scope.chalAmt = $scope.tableData.chalAmt;
    $scope.maxBlind = $scope.tableData.maxBlind;
    $scope.tableShow = $scope.tableData.tableShow;
    $scope.coin = $scope.blindAmt;
  });


  function startSocketUpdate() {
    io.socket.off("Update", updateSocketFunction);
    io.socket.on("Update", updateSocketFunction);
  }


  io.socket.off("Update", function (data) {
    $scope.message = {
      heading: "Internet Connection",
      content: "Check Your Internet Connection",
      error: true
    };
    $scope.showMessageModal();
  });


  // Game Play functions
  $scope.botAmount = 0;
  $scope.PotAmount = 0;
  $scope.startAnimation = false;
  $scope.insufficientFunds = false;
  $scope.chaalAmt = 0;
  $scope.startCoinAnime = false;
  $scope.winnerPlayerNo = -1;
  $scope.showNewGameTime = false;
  $scope.tipAmount = -1;
  $scope.TipPlayerNo = -1;
  $scope.tableMessageShow = false;
  $scope.tableMessage = "";
  $scope.runVibratorFlag = true;

  $scope.changeTableMessage = function (message) {
    $scope.tableMessageShow = true;
    $scope.tableMessage = message;
    $scope.$apply();
    $timeout(function () {
      $scope.tableMessageShow = false;
    }, 5000);

  }

  //sound initialize
  $scope.destroyAudio = function () {
    $ionicPlatform.ready(function () {
      if (window.cordova) {
        // running on device/emulator
        window.plugins.NativeAudio.stop('timer');
        window.plugins.NativeAudio.stop('coin');
        window.plugins.NativeAudio.stop('winner');
        window.plugins.NativeAudio.stop('shuffle');
        window.plugins.NativeAudio.stop('button');
      }
    });
  }

  // Socket Update function with REST API
  $scope.updatePlayers = function () {
    console.log("$scope.tableId", $scope.tableId);
    if (!_.isEmpty($scope.tableId)) {

      Service.getAll($scope.tableId, function (data) {
        console.log("update plr", data);
        // check whether dealer is selected or not
        $scope.maxAmt = data.data.data.maxAmt;
        $scope.minAmt = data.data.data.minAmt;
        $scope.setBetAmount($scope.minAmt, $scope.maxAmt);
        reArragePlayers(data.data.data.players);
        if (data.data.data.pot) {
          $scope.potAmount = data.data.data.pot.totalAmount;
        }
        $scope.iAmThere($scope.players);
        if ($scope.isThere) {
          updateSocketFunction(data.data, true);
        }
        $scope.sideShowDataFrom = 0;
        $scope.remainingActivePlayers = _.filter($scope.players, function (player) {
          if ((player && player.isActive) || (player && player.isActive == false)) {
            return true;
          }
        }).length;
        if ($scope.remainingActivePlayers == 9) {
          $scope.message = {
            heading: "Table Full",
            content: "Try after sometime !!",
            error: true
          };
          $scope.showMessageModal();
        }

        $scope.remainingPlayerCount = _.filter($scope.players, function (player) {
          if (player && player.isActive && !player.isFold) {
            return true;
          }
        }).length;
        $scope.blindPlayerCount = _.filter($scope.players, function (player) {
          if (player && player.isActive && !player.isFold && player.isBlind) {
            return true;
          }
        }).length;

        $scope.changeTimer(data.data.data.table.autoFoldDelay);
      });
    }
  };

  $scope.updatePlayers();

  $scope.iAmThere = function (data) {
    $scope.isThere = false;
    _.forEach(data, function (value) {
      if (value && value.memberId == $scope.memberId) {
        $scope.isThere = true;
        myTableNo = value.playerNo;
        startSocketUpdate();
        return false;
      }
    });
    $scope.sitHere = !$scope.isThere;
    // In Case he is already Sitting Please Enable the Game
  };

  //player sitting
  $scope.sitHerefn = function (sitNum) {
    if (!$scope.sitHere) {
      return;
    }
    $scope.ShowLoader = true;
    $scope.dataPlayer = {};
    $scope.dataPlayer.playerNo = sitNum;
    $scope.dataPlayer.tableId = $scope.tableId;
    $scope.dataPlayer.sitNummber = sitNum;

    $timeout(function () {
      if ($scope.ShowLoader) {
        $scope.ShowLoader = false;
        $scope.updatePlayers();
      }
    }, 5000);
    if (!_.isEmpty($scope.dataPlayer.tableId)) {
      // $scope.dataPlayer.socketId = $scope.socketId;
      Service.savePlayerToTable($scope.dataPlayer, function (data) {
        $scope.ShowLoader = false;
        if (data.data.value) {
          $scope.sitHere = false;
          myTableNo = data.data.data.playerNo;
          $scope.updatePlayers();
          startSocketUpdate();
        } else {
          if (data.data.error == "position filled") {
            $scope.message = {
              heading: "Position Filled",
              content: "Position is already filled"
            };
            $scope.showMessageModal();

          } else if (data.data.error == "Insufficient Balance") {
            // $scope.showInsufficientFundsModal();
            $scope.message = {
              heading: "Insufficient Funds",
              content: "Minimum amount required to enter this table is <span class='balance-error'> " + ($scope.chalAmt * 10) + "</span>",
              error: true
            };
            $scope.showMessageModal();
          }
        }
      });
    }
  };

  //loader for table
  $scope.ShowLoader = true;
  if ($.jStorage.get("socketId")) {
    $scope.ShowLoader = false;
  } else {
    $timeout(function () {
      $scope.ShowLoader = false;
    }, 5000);
  }


  //backtolobby
  $scope.backToLobby = function () {
    $scope.destroyAudio();
    if (!_.isEmpty($scope.tableId)) {
      Service.deletePlayer($scope.tableId, function (data) {});
      $scope.destroyAudio();

      $timeout(function () {
        $state.go("lobby");
      }, 1000);
    }
  };

  //stand up
  $scope.standUp = function () {
    $scope.destroyAudio();
    if (!_.isEmpty($scope.tableId)) {
      Service.deletePlayer($scope.tableId, function (data) {
        $scope.destroyAudio();
        navigator.vibrate(500);
        $timeout(function () {
          $state.reload();
        }, 1000)
        if (data.data.value) {} else {

        }
      });
    };
  };


  //show card
  $scope.showCard = function () {
    if (!_.isEmpty($scope.tableId)) {
      Service.makeSeen($scope.tableId, function (data) {
        if (data.data) {}
      });
    }
  };

  io.socket.off("seatSelection", function (data) {
    $scope.message = {
      heading: "Internet Connection",
      content: "Check Your Internet Connection",
      error: true
    };
    $scope.showMessageModal();
  });
  //seat selection Player
  io.socket.on("seatSelection", function (data) {});
  // Update Socket Player
  function updateSocketFunction(data, dontDigest) {
    console.log("socket", data.data);

    $scope.sideShowDataFrom = 0;

    data = data.data;
    $scope.extra = data.extra;

    if ($scope.extra) {
      if ($scope.extra.newGame) {
        $ionicPlatform.ready(function () {
          if (window.cordova) {
            // running on device/emulator
            window.plugins.NativeAudio.stop('winner');
          }

        })


        $scope.updateSocketVar = 0;
        $scope.showNewGameTime = false;
        $scope.chaalAmt = data.table.blindAmt;
        $scope.startCoinAnime = true;
        $scope.winnerPlayerNo = -1;
        $timeout(function () {
          $scope.startCoinAnime = false;
        }, 1000);
      }
      if ($scope.extra.chaalAmt) {
        $scope.chaalAmt = $scope.extra.chaalAmt;
        if (window.cordova) {
          window.plugins.NativeAudio.play('coin');
        }



      }
      //if card stucks up bychance and then make it false
      if ($scope.startAnimation) {
        $scope.startAnimation = false;
      }
      if ($scope.extra.serve) {
        $ionicPlatform.ready(function () {
          if (window.cordova) {
            window.plugins.NativeAudio.play('shuffle');
          }
        })

        // $scope.shuffleAudio.play();
        $scope.winnerPlayerNo = -1;
        $scope.startAnimation = true;

        $timeout(function () {
          $scope.startAnimation = false;
        }, 50);
      }
    }

    if (data.pot) {
      $scope.potAmount = data.pot.totalAmount;
      $scope.updatePotAmount(data.pot.totalAmount);
    } else {
      $scope.potAmount = 0;
    }

    $scope.maxAmt = data.maxAmt;
    $scope.minAmt = data.minAmt;
    $scope.setBetAmount($scope.minAmt, $scope.maxAmt);
    if ($scope.updateSocketVar == 0) {
      reArragePlayers(data.players);
    }

    $scope.changeTimer(data.table.autoFoldDelay);

    $scope.remainingPlayerCount = _.filter($scope.players, function (player) {
      if (player && player.isActive && !player.isFold) {
        return true;
      }
    }).length;
    $scope.blindPlayerCount = _.filter($scope.players, function (player) {
      if (player && player.isActive && !player.isFold && player.isBlind) {
        return true;
      }
    }).length;


    if ($scope.players && $scope.players[8] && ($scope.players[8].balance) < (data.table.chalAmt * 2 * 3)) {
      $scope.insufficientFunds = true;
      // $scope.showInsufficientFundsModal();
    } else {
      $scope.insufficientFunds = false;
    }


    //for vibration on turn

    if ($scope.players[8] && $scope.players[8].isTurn) {

      // $scope.timerAudio.play();
      $ionicPlatform.ready(function () {
        if (window.cordova) {
          window.plugins.NativeAudio.play('timer');
        }
      })

      if ($scope.runVibratorFlag) {
        //to vibrate only one time on socket update
        $scope.runVibratorFlag = false;
        navigator.vibrate(500);
      }



    } else {
      // console.log("turn false");
      $scope.runVibratorFlag = true;
      // $scope.timerAudio.pause();
      $ionicPlatform.ready(function () {
        if (window.cordova) {
          window.plugins.NativeAudio.stop('timer');
          // window.plugins.NativeAudio.stop('coin');
        }
      })

      // $scope.coinAudio.currentTime = 0;

    }



    if (!dontDigest) {
      $scope.$apply();
    }
  }

  function showWinnerFunction(data) {
    console.log("show winner", data);
    $scope.updateSocketVar = 1;
    $ionicPlatform.ready(function () {
      if (window.cordova) {
        window.plugins.NativeAudio.play('winner');
      }
    })

    // $scope.winnerAudio.play();
    $scope.showWinnerPlayer = data.data.players;
    console.log(data.data.players);
    $scope.showNewGameTime = true;
    $scope.winner = _.find($scope.showWinnerPlayer, {
      'winRank': 1,
      'winner': true
    });
    _.forEach($scope.showWinnerPlayer,
      function (p) {
        var playerNo = -1;
        playerNo = _.findIndex($scope.players, function (pl) {
          if (pl) {
            return pl.playerNo == p.playerNo;
          }
        });
        if (playerNo >= 0) {
          $scope.players[playerNo] = p;
          reArragePlayers($scope.players);
        }
      });

    if ($scope.winner && $scope.winner.playerNo) {
      $scope.winnerPlayerNo = $scope.winner.playerNo;
    }
    console.log($scope.winner);
    $scope.changeTableMessage($scope.winner.name + " won the game");
  }

  //showWinner
  $scope.showWinner = function () {
    if (!_.isEmpty($scope.tableId)) {
      $scope.showWinnerPromise = Service.showWinner($scope.tableId, function (data) {});
    }
  };


  io.socket.on("showWinner", showWinnerFunction);
  io.socket.off("showWinner", function (data) {
    $scope.message = {
      heading: "Internet Connection",
      content: "Check Your Internet Connection",
      error: true
    };
    $scope.showMessageModal();
  });

  //to add and remove coin
  $scope.addCoin = function () {
    $scope.betamount = $scope.betamount * 2;
  };

  $scope.removeCoin = function () {
    $scope.betamount = $scope.betamount / 2;
  };

  //fill all player
  $scope.fillAllPlayer = function (array) {
    var filled = [];
    for (i = 0; i < array.length; i++) {
      filled[array[i].playerNo - 1] = array[i];
    }
    for (i = 0; i < 9; i++) {
      if (filled[i] === undefined) {
        filled[i] = 0;
      }
    }
    return filled;
  };

  $scope.playChaal = function () {
    // $scope.coinAudio.play();
    if (!_.isEmpty($scope.tableId)) {
      $scope.chaalPromise = Service.chaal({
        tableId: $scope.tableId,
        amount: $scope.betamount
      }, function (data) {});
    };
  };

  //tip
  $scope.makeTip = function (data) {
    // $scope.coinAudio.play();
    $ionicPlatform.ready(function () {
      if (window.cordova) {
        window.plugins.NativeAudio.play('coin');
      }
    })

    var playerdetails = {};
    playerdetails.amount = data;
    Service.giveTip(playerdetails, function (data) {});
  };

  //tip socket
  io.socket.on("tip", function (data) {
    $scope.tipAmount = data.data.amount;
    $scope.TipPlayerNo = data.data.playerNo;

    //to reset tip and plyr no
    $timeout(function () {
      $scope.tipAmount = -1;
      $scope.TipPlayerNo = -1;
    }, 2000);

  });

  io.socket.off("tip", function (data) {
    $scope.message = {
      heading: "Internet Connection",
      content: "Check Your Internet Connection",
      error: true
    };
    $scope.showMessageModal();
  });
  //pack 
  $scope.pack = function () {
    // $scope.buttonAudio.play();
    $ionicPlatform.ready(function () {
      if (window.cordova) {
        window.plugins.NativeAudio.play('button');
      }
    })


    if (!_.isEmpty($scope.tableId)) {
      $scope.packPromise = Service.pack($scope.tableId, function (data) {});
    }
  };

  //sideshow
  $scope.sideShow = function () {
    // $scope.buttonAudio.play();
    $ionicPlatform.ready(function () {
      if (window.cordova) {
        window.plugins.NativeAudio.play('button');
      }
    })

    if (!_.isEmpty($scope.tableId)) {
      $scope.sideShowPromise = Service.sideShow($scope.tableId, function (data) {
        if (data.data) {
          $scope.sideShowDataFrom = 1;
        }
      });
    }
  };
  io.socket.on("sideShowCancel", function (data) {
    $scope.sideShowDataFrom = 0;
    $scope.$apply();
    console.log("side show cancel", data);
    $scope.closeSideShowModal();
    var mess = data.data.toPlayer.name + " denied the  side show request ";
    $scope.changeTableMessage(mess);
    // if (data.data.fromPlayer.memberId == $scope.memberId) {
    //   $scope.message = {
    //     heading: "Side Show",
    //     content: "Your request for the Side show has been rejected!"
    //   };
    //   $scope.showMessageModal();
    // }
  });


  io.socket.on("sideShow", sideShowSocket);

  io.socket.off("sideShow", function (data) {
    $scope.message = {
      heading: "Internet Connection",
      content: "Check Your Internet Connection",
      error: true
    };
    $scope.showMessageModal();
  });

  function sideShowSocket(data) {
    {
      $scope.sideShowDataFrom = 0;
      // console.log("side show", data.data.fromPlayer.name + " requested a side show with " + data.data.toPlayer.name);
      $scope.slideShowData = data.data;
      console.log("side show", $scope.slideShowData)
      var mess = $scope.slideShowData.fromPlayer.name + " requested a side show with " + $scope.slideShowData.toPlayer.name;
      // $scope.changeTableMessage($scope.slideShowData.fromPlayer.name + " requested a side show with " + $scope.slideShowData.toPlayer.name);
      $scope.changeTableMessage(mess);
      // $scope.changeTableMessage("to check");
      if (data.data.toPlayer.memberId == $scope.memberId) {
        $scope.showSideShowModal();
      }
      // if (data.data.fromPlayer.memberId == $scope.memberId) {
      //   $scope.message = {
      //     heading: "Side Show",
      //     content: "Your request for the Side show has been sent!"
      //   };
      //   $scope.showMessageModal();
      // }

    }
  }

  // $scope.showSideShowModal();

  //sideShow Maker
  $scope.doSideShow = function () {
    $scope.sideShowDataFrom = 0;
    if (!_.isEmpty($scope.tableId)) {
      Service.doSideShow($scope.tableId, function (data) {

      });
    }
  };

  //sideShow Maker
  $scope.rejectSideShow = function () {
    $scope.sideShowDataFrom = 0;
    if (!_.isEmpty($scope.tableId)) {
      Service.rejectSideShow($scope.tableId, function (data) {});
    }
  };

  //  betamount;
  $scope.setBetAmount = function (minamt, maxamt) {
    $scope.betamount = minamt;
  };

  $scope.updatePotAmount = function (potamt) {
    $scope.potAmount = potamt;
  };

  function reArragePlayers(playersData) {
    var diff = 6 - myTableNo;
    var players = _.times(6, function (n) {
      var playerReturn = _.find(playersData, function (singlePlayer) {
        if (singlePlayer) {
          var checkNo = (singlePlayer.playerNo + diff);
          if (checkNo > 6) {
            checkNo = checkNo - 6;
          }

          if ((n + 1) == checkNo) {
            return singlePlayer;
          } else {
            return null;
          }
        }

      });
      return _.cloneDeep(playerReturn);
    });
    $scope.players = players;
    console.log("rearr", $scope.players);
  }
  //seat selection Player
  io.socket.on("removePlayer", function (data) {
    if (data) {
      $state.reload();
    }
  });
  io.socket.off("removePlayer", function (data) {
    $scope.message = {
      heading: "Internet Connection",
      content: "Check Your Internet Connection",
      error: true
    };
    $scope.showMessageModal();
  });

  $scope.getRemaining = function () {
    if ($scope.players[8]) {
      return _.floor(($scope.players[8].balance / $scope.betamount));
    } else {
      return;
    }
  }
  io.socket.off('connect', function () {
    $scope.message = {
      heading: "Internet Connection",
      content: "Check Your Internet Connection",
      error: true
    };
    $scope.showMessageModal();
  });

  $scope.changeTimer = function (duration) {
    $(".animation_wrapper .spinner").css("animation-duration", duration + "s");
    $(".animation_wrapper .filler").css("animation-duration", duration + "  s");
    $(".animation_wrapper .mask").css("animation-duration", duration + "s");
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




  // for displaying table data
  Service.getOneTable($stateParams.id, function (data) {
    console.log("data", data);
    $scope.tableData = data.data.data;
    $scope.bootAmt = $scope.tableData.bootAmt;
    $scope.chalLimit = $scope.tableData.chalLimit;
    $scope.blindAmt = $scope.tableData.blindAmt;
    $scope.chalAmt = $scope.tableData.chalAmt;
    $scope.maxBlind = $scope.tableData.maxBlind;
    $scope.tableShow = $scope.tableData.tableShow;
    $scope.coin = $scope.blindAmt;
  });


  //destroy every modal
  $scope.$on('$destroy', function () {
    $scope.closeAll();
    $scope.playerDetails.remove();
    $scope.tableInfoModal.remove();
  });

});

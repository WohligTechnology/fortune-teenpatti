myApp = angular.module('starter.service', []);
var url = adminUUU + '/api/';
var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile";
var maxRow = 10;
myApp.factory('Service', function ($http, $ionicLoading, $filter, $ionicActionSheet, $timeout, $state) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  io.socket.on('connect', function (socket) {
    socketId = io.socket._raw.id;
    $.jStorage.set("socketId", io.socket._raw.id);
    obj.connectSocket(function () {});
  });

  var obj = {
    all: function () {
      return chats;
    },
    getNavigation: function () {
      return chats;
    },
    remove: function (chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    removeAccessToken: function (data, callback) {
      $.jStorage.flush();
    },
    get: function (chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    },
    playerLogin: function (data, callback) {
      return $http.post(adminurl + 'member/playerLogin', data).then(function (data) {
        data = data.data;
        callback(data);
      });
    },
    playerLogout: function (callback) {
      console.log("fdd");
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        console.log("fdd 1");
        return $http.post(adminurl + 'member/logout', {
          accessToken: accessToken
        }).then(function (data) {
          callback(data);
        });
      }
    },
    passwordchange: function (data, callback) {
      var accessToken = $.jStorage.get("accessToken");
      data.accessToken = accessToken;
      if (!_.isEmpty(accessToken)) {
        return $http.post(adminurl + 'member/changePassword', data).then(function (data) {
          data = data.data;
          callback(data);
        });
      }
    },

    sendAccessToken: function (callback) {
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        $http.post(adminurl + 'member/getAccessLevel', {
          accessToken: accessToken
        }).then(function (data) {
          callback(data);
        });
      } else {
        $state.go("login");
      }
    },
    giveTip: function (data, callback) {
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        $http.post(url + 'Table/makeTip', {
          "accessToken": accessToken,
          "amount": data.amount
        }).then(function (data) {
          callback(data);
        });
      }
    },
    searchPlayerTransaction: function (memberId, pageNo, callback) {
      if (!pageNo) {
        pageNo = 1;
      }
      $http.post(adminurl + 'transaction/searchPlayerTransactionData', {
        _id: memberId,
        pageNo: pageNo
      }).then(function (data) {
        if (data.data) {
          var totalCount = data.data.data.total;
          data.data.data.options.maxPage = _.ceil(data.data.data.total / data.data.data.options.count);
          callback(data);
        } else {}
      });
    },


    //from teenpatti 
    tableData: function (pageNo, callback) {
      if (!pageNo) {
        pageNo = 1;
      }
      $http.post(url + 'Table/search', {
        page: pageNo
      }).then(function (data) {
        if (data.data) {
          var totalCount = data.data.data.total;
          data.data.data.options.maxPage = _.ceil(data.data.data.total / data.data.data.options.count);
          callback(data);
        } else {}
      });
    },
    getFilterTableData: function (data, pageNo, callback) {
      if (!pageNo) {
        pageNo = 1;
      }
      var filter = data;
      var reqData = {
        filter: {
          blindAmt: filter.blindAmt,
          chalAmt: filter.chalAmt,
          name: filter.name,
          type: filter.type,
          gameType: filter.gameType
        },
        page: pageNo
      };
      if (filter.gameType) {
        if (filter.gameType == 'Muflis') {
          filter.gameType = ['Muflis', 'Lowest'];
        }
        reqData.filter.gameType = filter.gameType;
      }
      $http.post(url + 'Table/filterTables', reqData).then(function (data) {
        if (data.data) {
          var totalCount = data.data.data.total;
          data.data.data.options.maxPage = _.ceil(data.data.data.total / data.data.data.options.count);
          callback(data);
        } else {}
      });
    },

    getPrivateTables: function (pageNo, callback) {
      if (!pageNo) {
        pageNo = 1;
      }
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        $http.post(url + 'Table/getPrivateTables', {
          accessToken: accessToken,
          page: pageNo
        }).then(function (data) {
          if (data.data) {
            var totalCount = data.data.data.total;
            data.data.data.options.maxPage = _.ceil(data.data.data.total / data.data.data.options.count);
            callback(data);
          } else {}
        });
      }
    },
    getOneTable: function (id, callback) {
      $http.post(url + 'Table/getOne', {
        _id: id
      }).then(function (data) {
        callback(data);
      });
    },
    getAccessToTable: function (data, callback) {
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        return $http.post(url + 'Table/getAccessToTable', {
          'tableId': data.tableId,
          'password': data.password
        }).then(function (data) {
          callback(data);
        });
      }
    },
    getAll: function (data, callback) {
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        $http.post(url + 'Player/getAll', {
          accessToken: accessToken,
          tableId: data
        }).then(function (data) {
          callback(data);
        });
      }

    },
    savePlayerToTable: function (dataPlayer, callback) {
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        return $http({
          url: url + 'Table/addUserToTable',
          method: 'POST',
          data: {
            playerNo: dataPlayer.playerNo,
            tableId: dataPlayer.tableId,
            socketId: socketId,
            accessToken: accessToken
          }
        }).then(function (data) {
          callback(data);
        });
      }
    },

    getOnePlayer: function (id, callback) {
      $http.post(url + 'Player/getOne', {
        _id: id
      }).then(function (data) {
        callback(data);
      });
    },


    makeSeen: function (data, callback) {
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        return $http.post(url + 'Player/makeSeen', {
          "tableId": data,
          "accessToken": accessToken
        }).then(function (data) {
          callback(data);
        });
      }
    },
    chaal: function (data, callback) {
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        return $http.post(url + 'Player/chaal', {
          "tableId": data.tableId,
          "accessToken": accessToken,
          "amount": data.amount
        }).then(function (data) {
          callback(data);
        });
      }
    },
    pack: function (data, callback) {
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        return $http.post(url + 'Player/fold', {
          "tableId": data,
          "accessToken": accessToken
        }).then(function (data) {
          callback(data);
        });
      }
    },
    sideShow: function (data, callback) {
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        return $http.post(url + 'Player/sideShow', {
          "tableId": data,
          "accessToken": accessToken
        }).then(function (data) {
          callback(data.data);
        });
      }
    },

    doSideShow: function (data, callback) {
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        return $http.post(url + 'Player/doSideShow', {
          "tableId": data,
          "accessToken": accessToken
        }).then(function (data) {
          callback(data);
        });
      }
    },

    showWinner: function (tableId, callback) {
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        return $http.post(url + 'Player/showWinner', {
          "accessToken": accessToken,
          "tableId": tableId,
        }).then(function (data) {
          callback(data);
        });
      }
    },

    rejectSideShow: function (data, callback) {
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        return $http.post(url + 'Player/cancelSideShow', {
          "tableId": data,
          "accessToken": accessToken
        }).then(function (data) {
          callback(data);
        });
      }
    },

    deletePlayer: function (tableId, callback) {
      var accessToken = $.jStorage.get("accessToken");
      console.log(tableId);
      if (!_.isEmpty(accessToken)) {
        return $http.post(url + 'Player/deletePlayer', {
          "tableId": tableId,
          "accessToken": accessToken,
        }).then(function (data) {
          callback(data);
        });
      }
    },

    connectSocket: function (callback) {
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        callApi();
      } else {
        $timeout(function () {
          callApi();
        }, 2000);
      }

      function callApi() {
        var accessToken = $.jStorage.get("accessToken");
        if (!_.isEmpty(accessToken)) {
          $http.post(url + 'Player/updateSocket', {
            accessToken: accessToken,
            socketId: socketId
          }).then(function (data) {
            callback(data);
          });
        }
      };
    },

    getTransaction: function (filterData, pageNo, callback) {
      if (!pageNo) {
        pageNo = 1;
      }
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        return $http.post(url + 'Transaction/getPlayerTransaction', {
          "date": $filter('date')(filterData.date, 'MM-dd-yyyy', '+0530'),
          "page": pageNo,
          "accessToken": accessToken
        }).then(function (data) {
          if (data.data) {
            var totalCount = data.data.data.PagData.total;
            data.data.data.PagData.options.maxPage = _.ceil(data.data.data.PagData.total / data.data.data.PagData.options.count);
            callback(data);
          } else {}
        });
      }
    },
    getByPlrId: function (data, callback) {
      $http.post(url + 'Player/getByPlrId', {
        data: data
      }).then(function (data) {
        callback(data);
      });
    },

    makeDealer: function (data, callback) {
      $http.post(url + 'Player/makeDealer', {
        data: data
      }).then(function (data) {
        callback(data);
      });
    },

    deductBootAmount: function (data, callback) {
      $http.post(url + 'Player/deductBootAmount', {
        data: data
      }).then(function (data) {
        callback(data);
      });
    },

    serve: function (data, callback) {
      $http.post(url + 'Player/serve', {
        "tableId": data.tableId,
      }).then(function (data) {
        callback(data);
      });
    },

    createPot: function (data, callback) {
      $http.post(url + 'Pot/createPot', {
        data: data
      }).then(function (data) {
        callback(data);
      });
    },

    createTable: function (data, callback) {
      var accessToken = $.jStorage.get("accessToken");
      if (!_.isEmpty(accessToken)) {
        data.accessToken = accessToken;
        $http.post(url + 'Table/createPrivateTable', data).then(function (data) {
          data = data.data;
          callback(data);
        });
      }
    },
    deletePrivateTable: function (data, callback) {
      $http.post(url + "Table/delete", {
        '_id': data
      }).then(function (data) {
        callback(data.data);
      });
    },
    addAmountToPot: function (data, callback) {
      $http.post(url + 'Pot/addAmountToPot', {
        data: data
      }).then(function (data) {
        callback(data);
      });
    }
  };
  return obj;
});

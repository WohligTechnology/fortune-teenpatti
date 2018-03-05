var adminurl = "http://192.168.1.134:1337/api/";
var url = "http://192.168.1.134:1338/api/";

var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile";
angular.module('starter.service', [])

  .factory('Service', function ($http, $ionicLoading, $timeout, $ionicActionSheet) {
    // Might use a resource here that returns a JSON array

    // Some fake testing data


    return {
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



      // Set jStorage
      setPlayer: function (data) {
        $.jStorage.set("player", data);
      },


      //from teenpatti backend

      playerLogin: function (data, callback) {
        $http.post(adminurl + 'member/playerLogin', data).then(function (data) {
          data = data.data;
          callback(data);
        });
      },

      // passwordchange: function (data, callback) {
      //   $http.post(adminurl + 'member/changePassword', data).then(function (data) {
      //     data = data.data;
      //     callback(data);
      //   });
      // },



      //from teenpatti 

      sendAccessToken: function (data, callback) {
        $http({
          url: url + 'User/requestSend',
          method: 'POST',
          data: data
        }).then(callback);
      },


      tableData: function (callback) {
        $http({
          url: url + 'Table/search',
          method: 'POST'
        }).then(callback);
      },

      getOneTable: function (id, callback) {
        $http.post(url + 'Table/getOne', {
          _id: id
        }).then(callback);
      },

      // getAllActive: function (data, callback) {
      //   $http({
      //     url: url + 'Table/getAllActive',
      //     method: 'POST',
      //     data: data
      //   }).then(callback);
      // },

      // savePlayerTotable: function (data, callback) {
      //   $http({
      //     url: url + 'Table/addUserToTable',
      //     method: 'POST',
      //     data: data
      //   }).then(callback);
      // },


      // getOnePlayer: function (id, callback) {
      //   $http.post(url + 'Player/getOne', {
      //     _id: id
      //   }).then(callback);
      // },

      // getByPlrNo: function (data, callback) {
      //   $http.post(url + 'Player/getByPlrNo', {
      //     data: data
      //   }).then(callback);
      // },

      // makeDealer: function (data, callback) {
      //   $http.post(url + 'Player/makeDealer', {
      //     data: data
      //   }).then(callback);
      // },

      // deductBootAmount: function (data, callback) {
      //   $http.post(url + 'Player/deductBootAmount', {
      //     data: data
      //   }).then(callback);
      // },

      // serve: function (data, callback) {
      //   $http.post(url + 'Player/serve', {
      //     data: data
      //   }).then(callback);
      // },

      // createPot: function (data, callback) {
      //   $http.post(url + 'Pot/createPot', {
      //     data: data
      //   }).then(callback);
      // },

      // addAmountToPot: function (data, callback) {
      //   $http.post(url + 'Pot/addAmountToPot', {
      //     data: data
      //   }).then(callback);
      // },

    }
  });
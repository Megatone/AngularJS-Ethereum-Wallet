var app = angular.module("app", ['ngRoute' , 'ngCookies'])
    .config(['$routeProvider', function ($routeProvider) {
        for (var path in window.routes) {
            $routeProvider.when(path, window.routes[path]);
        }
        $routeProvider.otherwise({ redirectTo: '/home' });
    }])
    .run(function ($rootScope, $location) {
        $rootScope.$on("$locationChangeStart", function (event, next, current) {
            for (var i in window.routes) {
                if (next.indexOf(i) != -1) {
                    if (window.routes[i].requireLogin &&  $rootScope.activeWallet == null) {
                        $location.path("/home");
                        event.preventDefault();
                    }
                }
            }
        });
    });

window.routes = {
    "/home": {
        templateUrl: "vistas/home.html",      
        requireLogin: false
    },
    "/key": {
        templateUrl: "vistas/key.html",
        controller: "keyController",
        requireLogin: false
    },
    "/wallet": {
        templateUrl: "vistas/wallet.html",
        controller: "walletController",
        requireLogin: true
    },
    "/price": {
        templateUrl: "vistas/price.html",
        controller: "priceController",
        requireLogin: false
    }
};


app.factory('Notify', function () {
    return {
        notify: function (notification) {
            $.notify({
                title: notification.title,
                message: notification.message
            }, {
                    type: notification.type,
                    placement: {
                        from: "bottom",
                        align: "right"
                    },
                    showProgressbar: true,
                    allow_dismiss: true,
                    delay: 5000,
                    offset: 1,
                    timer: 100
                });
        }
    };
});
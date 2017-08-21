var app = angular.module("app", ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        for (var path in window.routes) {
            $routeProvider.when(path, window.routes[path]);
        }
        $routeProvider.otherwise({ redirectTo: '/wallet' });
    }])
    .run(function ($rootScope, $location) {
        $rootScope.$on("$locationChangeStart", function (event, next, current) {
            for (var i in window.routes) {
                if (next.indexOf(i) != -1) {
                    if (window.routes[i].requireLogin) {
                        $location.path("/key");
                        event.preventDefault();
                    }
                }
            }
        });
    });

window.routes = {
    "/key": {
        templateUrl: "vistas/key.html",
        controller: "keyController",
        requireLogin: false
    },
    "/wallet": {
        templateUrl: "vistas/wallet.html",
        controller: "walletController",
        requireLogin: true
    }
};

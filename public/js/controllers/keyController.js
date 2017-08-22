app.controller("keyController", function ($scope, $rootScope , $location) {

    $scope.PrivateKey = null;
    $rootScope.activeWallet = null;

    $scope.OpenWallet = function () {
        if ($scope.PrivateKey.substring(0, 2) !== '0x') { $scope.PrivateKey = '0x' + $scope.PrivateKey; }
        $rootScope.activeWallet = new ethers.Wallet($scope.PrivateKey);
        $rootScope.activeWallet.provider = new ethers.providers.getDefaultProvider(false);
        $location.path("/wallet");
    };

});
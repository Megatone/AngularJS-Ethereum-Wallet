app.controller("keyController", function ($scope, $rootScope, $location, Notify) {
    
    $scope.PrivateKey = "";
    $rootScope.activeWallet = null;

    $scope.OpenWallet = function () {
        if ($scope.PrivateKey.length != 64) {
            var incidence = { type: 'danger', message: 'The private key must have a length of 64 alphanumeric characters.' };
            Notify.notify(incidence);
        } else {
            if ($scope.PrivateKey.substring(0, 2) !== '0x') { $scope.PrivateKey = '0x' + $scope.PrivateKey; }
            try {
                $rootScope.activeWallet = new ethers.Wallet($scope.PrivateKey);
                $rootScope.activeWallet.provider = new ethers.providers.getDefaultProvider(false);
                var incidence = { type: 'success', message: 'Opened wallet successfully "' + $rootScope.activeWallet.address + '"' };
                Notify.notify(incidence);
                $location.path("/wallet");
            } catch (error) {
                var incidence = { type: 'danger', message: error.message };
                Notify.notify(incidence);
            }

        }
    };

});


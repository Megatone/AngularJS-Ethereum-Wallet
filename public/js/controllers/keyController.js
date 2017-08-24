app.controller("keyController", function ($scope, $rootScope, $location, Notify, $cookies) {

    $scope.PrivateKey = ''; 
    $scope.Remember = false;

    init();

    function init() {
        if($rootScope.activeWallet != undefined){
            $location.path("/wallet");
        }
        $scope.Remember = ($cookies.get("Remember") === 'true');
        if ($scope.Remember) {
            $scope.PrivateKey = ($cookies.get("PrivateKey") != undefined) ? $cookies.get("PrivateKey") : '';
        }
    };
 
   

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
                if ($scope.Remember) {
                    $cookies.put("PrivateKey", $scope.PrivateKey.substring(2));
                }
                $location.path("/wallet");
            } catch (error) {
                var incidence = { type: 'danger', message: error.message };
                Notify.notify(incidence);
            }

        }
    };



    $scope.SetRememberValue = function () {
        $cookies.put("Remember", $scope.Remember);
        if (!$scope.Remember) {
            $cookies.put("PrivateKey", '');
        }
    };

});


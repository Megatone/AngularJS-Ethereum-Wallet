app.controller("walletController", function ($scope, $rootScope , $http) {

    $scope.Balance = 0;
    $scope.TransactionCount = 0;
    $scope.TargetAddress = null;
    $scope.Amount = 0;
    $scope.gasPrice = 0x4e3b29200;

    refresh();

    function refresh() {
        getGasPrice();
        addActivity('> Refreshing details...');
        $rootScope.activeWallet.getBalance('pending').then(function (balance) {
            addActivity('< Balance: ' + balance.toString(10));
            $scope.Balance = ethers.utils.formatEther(balance, { commify: true });
            $scope.$apply();
        }, function (error) {
            showError(error);
        });
        $rootScope.activeWallet.getTransactionCount('pending').then(function (transactionCount) {
            addActivity('< TransactionCount: ' + transactionCount);
            $scope.TransactionCount = transactionCount;
            $scope.$apply();
        }, function (error) {
            showError(error);
        });
    };

    $scope.refresh = function () {
        refresh();
    };

    function showError(error) {
        alert('Error \u2014 ' + error.message);
    };

    function addActivity(message, url) {
        var activity = document.getElementById('wallet-activity');
        var line = document.createElement('a');
        line.textContent = message;
        if (url) { line.setAttribute('href', url); }
        activity.appendChild(line);
    };

    $scope.SendEther = function () {
        if (check()) {
            // Matt (from Etherscan) is working on a gasPrice API call, which
            // should be done within a week or so.
            // @TODO https://api.etherscan.io/api?module=proxy&action=eth_gasPrice

         
            console.log('GasPrice: ' + $scope.gasPrice);

         
            var amountWei = ethers.utils.parseEther($scope.Amount);
            $rootScope.activeWallet.send($scope.TargetAddress, amountWei, {
                gasPrice: $scope.gasPrice,
                gasLimit: 21000,
            }).then(function (txid) {
                var url = 'https://etherscan.io/tx/' + txid;
                addActivity('< Transaction sent: ' + txid + '...', url);
                alert('Success!');

                $scope.TargetAddress = null;
                $scope.Amount = null;
                refresh();
            }, function (error) {
                showError(error);
            });
        }
    };

    function check() {
        try {
            ethers.utils.getAddress(inputTargetAddress.value);
            ethers.utils.parseEther(inputAmount.value);
        } catch (error) {

            return false;
        }
        return true;
    };


    function getGasPrice(){
        $http({
            method: 'GET',
            url: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice'
          }).then(function successCallback(response) {
              console.log(response.data.result);              
                $scope.gasPrice = response.data.result;
            }, function errorCallback(response) {
           
            });
    }

});
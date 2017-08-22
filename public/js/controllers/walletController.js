app.controller("walletController", function ($scope, $rootScope, $http, Notify) {

    $scope.WalletInformation = {
        Address: $rootScope.activeWallet.address,
        Balance: 0,
        TransactionCount: 0,
        Transactions: []
    };

    $scope.TransferInformation = {
        TargetAddress: '',
        Amount: 0,
        GasPrice: {         
            fastest: 20.0,
            safeLowWait: 9.5,
            average: 4.0,
            avgWaitC: 3.5,           
            fastWaitC: 1.6,
            avgWait: 1.1,            
            fastWait: 0.7,
            safeLow: 0.01           
        },
        GasLimit: 21000
    };


    $scope.Activity = [];


    refresh();

    function refresh() {
        getGasPrice();
        addActivity(' Obtaining account balance');
        $rootScope.activeWallet.getBalance('pending').then(function (balance) {
            $scope.WalletInformation.Balance = ethers.utils.formatEther(balance, { commify: true });
            addActivity(' This account has ' + $scope.WalletInformation.Balance + ' ETH');
            $scope.$apply();
        }, function (error) {
            showError(error);
        });
        getTransactionsHistory();
    };

    $scope.refresh = function () {
        refresh();
    };

    function showError(error) {
        alert('Error \u2014 ' + error.message);
    };



    function addActivity(message) {
        var d = new Date();
        $scope.Activity.push({ time: d.toLocaleTimeString(), msg: message });
    };

    $scope.SendEther = function () {
        if (check()) {
            var amountWei = ethers.utils.parseEther($scope.TransferInformation.Amount);
            $rootScope.activeWallet.send($scope.TransferInformation.TargetAddress, amountWei, {
                gasPrice: $scope.TransferInformation.GasPrice.average,
                gasLimit: $scope.TransferInformation.GasLimit,
            }).then(function (txid) {
                addActivity('  Transaction sent : ' + txid);
                $scope.TransferInformation.TargetAddress = '';
                $scope.TransferInformation.Amount = 0;
                refresh();
            }, function (error) {
                showError(error);
            });
        }
    };

    function check() {
        try {
            ethers.utils.getAddress($scope.TransferInformation.TargetAddress);
            ethers.utils.parseEther($scope.TransferInformation.Amount);
        } catch (error) {
            var incidence = { type: 'danger', message: error.message };
            Notify.notify(incidence);
            return false;
        }
        return true;
    };
    

  function getGasPrice() {
        addActivity(' Obtaining gas price');
        $http({
            method: 'GET',
            url: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice'
        }).then(function successCallback(response) {
            $scope.TransferInformation.GasPrice = response.data.result;
            addActivity(' The gas price is currently ' + ($scope.TransferInformation.GasPrice * 1));
        }, function errorCallback(response) {

        });
     /*
    function getGasPrice() {
        addActivity(' Obtaining gas price');
        $http({
            method: 'GET',
            url: 'http://ethgasstation.info/json/ethgasAPI.json',
            contentType: "application/json"
        }).then(function successCallback(response) {
            $scope.TransferInformation.GasPrice =   {         
                fastest: response.data.fastest,
                safeLowWait:  response.data.safeLowWait,
                average: response.data.average,
                avgWaitC:  response.data.avgWaitC,           
                fastWaitC:  response.data.fastWaitC,
                avgWait:  response.data.avgWait,            
                fastWait: response.data.fastWait,
                safeLow:  response.data.safeLow           
            };
           // addActivity(' The gas price is currently ' + ($scope.TransferInformation.GasPrice * 1));
        }, function errorCallback(response) {
            console.log(response);
        });
    } }*/

    function getTransactionsHistory() {
        addActivity(' Obtaining transaction history ... ');
        $http({
            method: 'GET',
            url: 'http://api.etherscan.io/api?module=account&action=txlist&address=' + $scope.WalletInformation.Address + '&startblock=0&endblock=99999999&sort=desc'
        }).then(function successCallback(response) {
            $scope.WalletInformation.Transactions = response.data.result;
            $scope.WalletInformation.TransactionCount = $scope.WalletInformation.Transactions.length;
            addActivity(' This account has ' + $scope.WalletInformation.TransactionCount + ' transsactions registered');
        }, function errorCallback(response) {

        });
    };

    $scope.getDateTransacction = function (timeStamp) {
        var d = new Date(timeStamp * 1000);
        return d.toISOString();
    };

    $scope.getValueTransaction = function (value) {
        return ethers.utils.formatEther(value, { commify: true });
    };

    $scope.CalculateTransacctionCost = function () {
        return ethers.utils.formatEther($scope.TransferInformation.GasPrice.average * $scope.TransferInformation.GasLimit);
    };


});
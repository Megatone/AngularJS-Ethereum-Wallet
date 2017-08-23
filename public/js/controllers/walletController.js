app.controller("walletController", function ($scope, $rootScope, $http, Notify , $sce , $window) {

    $scope.WalletInformation = {
        Address: $rootScope.activeWallet.address,
        Balance: 0,
        TransactionCount: 0,
        Transactions: []
    };

    $scope.TransferInformation = {
        TargetAddress: '',
        Amount: 0,
        GasPrice: 0,       
        GasLimit: 21000
    };

    var Colors = {
        yellow : "FCyellow",
        red : "FCred",
        green : "FCgreen"
    };



    $scope.Activity = [];


    refresh();

    function refresh() {      
        getGasPrice();
        addActivity(' Obtaining account balance' , Colors.yellow);
        $rootScope.activeWallet.getBalance('pending').then(function (balance) {
            $scope.WalletInformation.Balance = ethers.utils.formatEther(balance, { commify: true });
            addActivity(' This account has ' + $scope.WalletInformation.Balance + ' ETH' , Colors.green);
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
        addActivity("Error : " + error.message , Colors.red);
    };

  
    function addActivity(message ,color) {
        var d = new Date();
        $scope.Activity.push({ time: d.toLocaleTimeString(), msg: message ,color : color });
    };

    $scope.SendEther = function () {
        if (check()) {
           var amountWei = ethers.utils.parseEther($scope.TransferInformation.Amount);
            $rootScope.activeWallet.send($scope.TransferInformation.TargetAddress, amountWei, {
                gasPrice: $scope.TransferInformation.GasPrice,
                gasLimit: $scope.TransferInformation.GasLimit,
            }).then(function (txid) {
                addActivity('  Transaction sent : ' + txid , Colors.green);
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
            //ethers.utils.parseEther($scope.TransferInformation.Amount);
        
            if(parseFloat($scope.TransferInformation.Amount) +  parseFloat($scope.CalculateTransacctionCost()) > parseFloat($scope.WalletInformation.Balance) ) throw "error"
        } catch (error) {
            var incidence = { type: 'danger', message: error.message };
            Notify.notify(incidence);
            return false;
        }
        return true;
    };


    function getGasPrice() {
        addActivity(' Obtaining gas price.....' , Colors.yellow);
        $http({
            method: 'GET',
            url: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice'
        }).then(function successCallback(response) {
            $scope.TransferInformation.GasPrice = response.data.result;
            addActivity(' The gas price is currently ' + ($scope.TransferInformation.GasPrice * 1) , Colors.green);
        }, function errorCallback(response) {

        });
    }
  

    function getTransactionsHistory() {
        addActivity(' Obtaining transaction history ..... ' , Colors.yellow);
        $http({
            method: 'GET',
            url: 'http://api.etherscan.io/api?module=account&action=txlist&address=' + $scope.WalletInformation.Address + '&startblock=0&endblock=99999999&sort=desc'
        }).then(function successCallback(response) {
            $scope.WalletInformation.Transactions = response.data.result;
            $scope.WalletInformation.TransactionCount = $scope.WalletInformation.Transactions.length;
            addActivity(' This account has ' + $scope.WalletInformation.TransactionCount + ' transsactions registered', Colors.green);
        }, function errorCallback(response) {

        });
    };

    $scope.getDateTransacction = function (timeStamp) {
        var d = new Date(timeStamp * 1000);
        return d;
    };

    $scope.getValueTransaction = function (value) {
        return ethers.utils.formatEther(value, { commify: true });
    };

    $scope.CalculateTransacctionCost = function () {
        return ethers.utils.formatEther($scope.TransferInformation.GasPrice * $scope.TransferInformation.GasLimit);
    };
    //Precio del eth -> eur , usd 
    //https://ethereumprice.org/api/pairs/?p=eur

    //historico precios desde 2015 hasta hoy
    //https://etherchain.org/api/statistics/price

   
});
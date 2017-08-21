function setEnter(source, target) {
    source.onkeyup = function(e) {
        if (e.which === 13) { target.click(); }
    }
}



(function() {
    var inputPrivatekey = document.getElementById('select-privatekey');
    var submit = document.getElementById('select-submit-privatekey');

    function check() {
        if (inputPrivatekey.value.match(/^(0x)?[0-9A-fa-f]{64}$/)) {
            submit.classList.remove('disable');
        } else {
            submit.classList.add('disable');
        }
    }
    inputPrivatekey.oninput = check;

    setEnter(inputPrivatekey, submit);

    submit.onclick = function() {
        if (submit.classList.contains('disable')) { return; }
        var privateKey = inputPrivatekey.value;
        if (privateKey.substring(0, 2) !== '0x') { privateKey = '0x' + privateKey; }
        showWallet(new ethers.Wallet(privateKey));
    }
})();


var activeWallet = null;

function showError(error) {
    alert('Error \u2014 ' + error.message);
}

// Refresh balance and transaction count in the UI
var refresh = (function() {
    var inputBalance = document.getElementById('wallet-balance');
    var inputTransactionCount = document.getElementById('wallet-transaction-count');
    var submit = document.getElementById('wallet-submit-refresh');

    function refresh() {
        addActivity('> Refreshing details...');
        activeWallet.getBalance('pending').then(function(balance) {
            addActivity('< Balance: ' + balance.toString(10));
            inputBalance.value = ethers.utils.formatEther(balance, {commify: true});
        }, function(error) {
            showError(error);
        });
        activeWallet.getTransactionCount('pending').then(function(transactionCount) {
            addActivity('< TransactionCount: ' + transactionCount);
            inputTransactionCount.value = transactionCount;
        }, function(error) {
            showError(error);
        });
    }
    submit.onclick = refresh;

    return refresh;
})();

var addActivity = (function() {
    var activity = document.getElementById('wallet-activity');
    return function(message, url) {
        var line = document.createElement('a');
        line.textContent = message;
        if (url) { line.setAttribute('href', url); }
        activity.appendChild(line);
    }
})();

// Set up the wallet page
(function() {

    var inputTargetAddress = document.getElementById('wallet-send-target-address');
    var inputAmount = document.getElementById('wallet-send-amount');
    var submit = document.getElementById('wallet-submit-send');

    // Validate the address and value (to enable the send button)
    function check() {
        try {
            ethers.utils.getAddress(inputTargetAddress.value);
            ethers.utils.parseEther(inputAmount.value);
        } catch (error) {
            submit.classList.add('disable');
            return;
        }
        submit.classList.remove('disable');
    }
    inputTargetAddress.oninput = check;
    inputAmount.oninput = check;

    // Send ether
    submit.onclick = function() {

        // Matt (from Etherscan) is working on a gasPrice API call, which
        // should be done within a week or so.
        // @TODO
        var gasPrice =  0x4e3b29200;
        console.log('GasPrice: ' + gasPrice);

        var targetAddress = ethers.utils.getAddress(inputTargetAddress.value);
        var amountWei = ethers.utils.parseEther(inputAmount.value);
        activeWallet.send(targetAddress, amountWei, {
            gasPrice: gasPrice,
            gasLimit: 21000,
        }).then(function(txid) {
            var url = 'https://etherscan.io/tx/' + txid;
            addActivity('< Transaction sent: ' + txid.substring(0, 20) + '...', url);
            alert('Success!');

            inputTargetAddress.value = '';
            inputAmount.value = '';
            submit.classList.add('disable');

            refresh();
        }, function(error) {
            showError(error);
        });
    }
})();




function showWallet(wallet) {
    
    activeWallet = wallet;
    activeWallet.provider = new ethers.providers.getDefaultProvider(false);

    document.getElementById('screen-select').style.display = 'none'; 
    document.getElementById('screen-wallet').style.display = 'block';

    var inputWalletAddress = document.getElementById('wallet-address');
    inputWalletAddress.value = wallet.address;
    inputWalletAddress.onclick = function() {
        this.select();
    };

    refresh();
}

//var privateKey = '0x3141592653589793238462643383279502884197169399375105820974944592';
//showWallet(new Wallet(privateKey));

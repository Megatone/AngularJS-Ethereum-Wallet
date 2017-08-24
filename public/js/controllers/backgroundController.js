app.controller("backgroundController" , function($scope ,$rootScope ,  $location){
    $scope.rand =  Math.floor(Math.random() * (5 - 1 + 1) +1);
    $scope.bodyBackgroundClass = function (){
        return "back" + $scope.rand;
    };

    $('[data-toggle=collapse]').click(function(event) {
        event.stopPropagation();
        $('.navbar-collapse').toggleClass('collapse');
        toggleMenu = !toggleMenu;
    });
    var toggleMenu = false;
    $('html').click(function() {
        if(toggleMenu){
            toggleMenu = !toggleMenu;
            $('.navbar-collapse').toggleClass('collapse');
        }
    });
  

    $scope.CloseWallet = function(){
        $rootScope.activeWallet = undefined;
        $location.path("/key");
    };
});

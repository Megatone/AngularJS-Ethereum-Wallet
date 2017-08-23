app.controller("backgroundController" , function($scope){
    $scope.rand =  Math.floor(Math.random() * (5 - 1 + 1) +1);
    $scope.bodyBackgroundClass = function (){
        return "back" + $scope.rand;
    };
});
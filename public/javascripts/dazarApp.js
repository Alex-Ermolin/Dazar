var dazarApp = angular.module('dazarApp', ['ngRoute']);

dazarApp.run(function($rootScope) {
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
    $rootScope.signout = function() {
        $http.get('/auth/signout');
        $rootScope.authenticated = false;
        $rootScope.current_user = '';
    };
});

dazarApp.config(function($routeProvider) {
    $routeProvider

        //main page
        .when('/', {
            templateUrl: 'main.html',
            controller: 'mainController'
        })

        //login page
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'authController'
        })

        //registration page
        .when('/register', {
            templateUrl: 'register.html',
            controller: 'authController'
        })
});

dazarApp.controller('mainController', function($scope){
    $scope.posts = [];
    $scope.newPost = {created_by: '', text: '', created_at: ''};

    $scope.post = function(){
        $scope.newPost.created_at = Date.now();
        $scope.posts.push($scope.newPost);
        $scope.newPost = {created_by: '', text: '', created_at: ''};
    };
});

dazarApp.controller('authController', function($scope) {
    $scope.user = {username: '', password: ''};
    $scope.error_message = '';

    // postService.getAll().success(function(data){
    //    	$scope.posts = data;
    //  	});

    $scope.login = function(){
        //placeholder until authentication is implemented
        $scope.error_message = 'login request for ' + $scope.user.username;
    };

    $scope.register = function(){
        //placeholder until authentication is implemented
        $scope.error_message = 'registeration request for ' + $scope.user.username;
    };
});
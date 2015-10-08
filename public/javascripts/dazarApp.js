var dazarApp = angular.module('dazarApp', ['ngRoute', 'ngResource']);

dazarApp.run(function($rootScope) {
    $rootScope.isAuthenticated = false;
    $rootScope.current_user = '';
    $rootScope.signout = function() {
        $http.get('/auth/signout');
        $rootScope.isAuthenticated = false;
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

        .when('/#', {
            templateUrl: 'main.html',
            controller: 'mainController'
        })

        //login page
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'authController'
        })

        //registration page
        .when('/signup', {
            templateUrl: 'register.html',
            controller: 'authController'
        })
});

dazarApp.factory('postService', function($resource) {
    return $resource('/api/posts/:id');
});

dazarApp.controller('mainController', function(postService, $scope, $rootScope){
    $scope.posts = postService.query();
    $scope.newPost = {created_by: '', text: '', created_at: '', edits: []};

    $scope.post = function(){
        $scope.newPost.created_by = $rootScope.current_user;
        //$scope.newPost.created_at = Date.now();
        postService.save($scope.newPost, function() {
            $scope.posts = postService.query();
            $scope.newPost = {created_by: '', text: '', created_at: '', edits: []};
        });
    };
});

dazarApp.controller('authController', function($scope, $location, $http, $rootScope) {
    $scope.user = {username: '', password: ''};
    $scope.error_message = '';

    $scope.login = function(){
        $http.post('/auth/login', $scope.user).success(function(data) {
            if(data.state == 'success') {
                $rootScope.isAuthenticated = true;
                $rootScope.current_user = data.username;
                $location.path('/');
            } else {
                $scope.error_message = data.error;
            }
        });
    };

    $scope.register = function(){
        $http.post('/auth/signup', $scope.user).success(function(data) {
            if(data.state == 'success') {
                $rootScope.isAuthenticated = true;
                $rootScope.current_user = data.username;
                $location.path('/');
            } else {
                $scope.error_message = data.error;
            }
        })
    };
});
var dazarApp = angular.module('dazarApp', ['ngRoute', 'ngResource']);

dazarApp.run(function($rootScope, $http) {
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

dazarApp.controller('mainController', function(postService, $scope, $rootScope, $http, $q){
    $scope.posts = postService.query();
    $scope.newPost = {created_by: '', text: '', created_at: '', edits: []};

    $scope.usernameFromId = function(userId) {

        var deferred = $q.defer();

        var successCallback = function(data){
            var username = data.data.username;
            console.log('successCallback was called with id: ' + data.data._id + ', username:' + username);
            return username;
        };

        var failureCallback = function(data) {
            return 'DB - this means that the get request failed';
        };

        if(userId) {
            var promise = $http.get('/api/users/' + userId).then(successCallback, failureCallback);
            console.dir('promise[0]: ' + promise[0]);
            console.dir('promise[1]: ' + promise[1]);

            console.dir('promise: ' + promise);
            return promise;
        } else {
            return 'DB - this means that userId sent was null';
        }
    };

    $scope.usernameFromPost = function(post) {
        if(post.created_by) {
            var created_by_id = post.created_by;
            console.log('going to pass this id: ' + post.created_by);
            console.log('created_by_id = ' + created_by_id);
            console.log($scope.usernameFromId('5614344eb82b49e82bd9f235'));
            console.dir($scope.usernameFromId(created_by_id));
            return $scope.usernameFromId(created_by_id);
        } else {
            return 'db - this means that post.created_by is null';
        }
    };

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
                $rootScope.current_user = data.user;
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
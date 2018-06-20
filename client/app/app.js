'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'listpolls',
  'polldetails',
  'test',
  'mypolls',
  'createpoll',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  //$locationProvider.hashPrefix('!');
  /*$locationProvider.html5Mode({
  enabled: true,
  requireBase: false,
  rewriteLinks: false
  });
  */
//routes definition
  $routeProvider.
        when('/', {
          template: '<listpolls></listpolls>'
        }).
        when('/poll/:id', {
          template: '<polldetails></polldetails>'
          //template: '<h1>It works!!!</h1>'
        }).
        when('/newpoll', {
          template: '<createpoll></createpoll>'
          //template: '<h1>It works!!!</h1>'
        }).
        when('/mypolls',{
          template:'<mypolls></mypolls>'
        }).
        //otherwise('/view1');
        otherwise({
          template: '<test data="[10, 10, 20]"></test>'
          //template: '<h1>It works!!!</h1>'
        })


}]).
controller('Main',function MainController($scope,$http){
  //controller for the main page
  $http.get("/isloggedin").success(function(response){
    if(response.status=="in")
      $scope.loggedin=true;
    else
      $scope.loggedin=false;
  }).error(function(error){
    console.log(error);
  })
  
  });

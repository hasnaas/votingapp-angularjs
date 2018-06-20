angular.
  module('Polls').
  factory('Polls', ['$resource',
    function($resource) {
      return $resource('/polls');
    }
  ]);
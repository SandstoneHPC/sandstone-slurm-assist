'use strict';

angular.module('oide.slurm', ['ngRoute','ui.bootstrap','ui.ace'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/slurm', {
    templateUrl: '/static/slurm/slurm.html',
    controller: 'SlurmCtrl'
  });
}])

.controller('SlurmCtrl', ['$scope', '$log', function($scope,$log) {

}]);

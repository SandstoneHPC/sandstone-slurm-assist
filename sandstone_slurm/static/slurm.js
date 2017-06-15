'use strict';

angular.module('sandstone.slurm', ['ui.bootstrap','ui.ace','smart-table','ui.router'])

.config(['$stateProvider', '$urlRouterProvider' ,function($stateProvider, $urlRouterProvider){
  $stateProvider.state('slurm', {
      url: '/slurm',
      templateUrl: '/static/slurm/slurm.html',
      controller: 'StatusCtrl',
      controllerAs: 'ctrl'
    });
}]);

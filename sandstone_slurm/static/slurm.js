'use strict';

angular.module('sandstone.slurm', ['ui.bootstrap','ui.ace','smart-table','ui.router'])

.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('slurm', {
    'url': '/slurm',
    'views': {
      '': {
        templateUrl: '/static/slurm/slurm.html'
      },
      'schedule@slurm': {
        templateUrl: '/static/slurm/templates/schedule.html',
        controller: 'ScheduleCtrl as ctrl',
        resolve: {
          formConfig: function(ScheduleService) {
            return ScheduleService.loadFormConfig();
          }
        }
      },
      'status@slurm': {
        templateUrl: '/static/slurm/templates/status.html',
        controller: 'StatusCtrl as ctrl'
      }
    }
  });
}])

'use strict';

angular.module('oide.slurm', ['ngRoute','ui.bootstrap','ui.ace'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/slurm', {
    templateUrl: '/static/slurm/slurm.html',
    controller: 'SlurmCtrl',
    resolve: {
      formConfig: function (FormService) {
        return FormService.getFormConfig();
      }
    }
  });
}])
.factory('FormService', ['$http', function ($http) {
  var formConfig = {};
  var formFields = [
    {
      key: 'array'
    },
    {
      key: 'account'
    },
    {
      key: 'begin'
    },
    {
      key: 'checkpoint'
    },
    {
      key: 'checkpointDir'
    },
    {
      key: 'cpusPerTask'
    },
    {
      key: 'workDir'
    },
    {
      key: 'error'
    },
    {
      key: 'export'
    },
    {
      key: 'exportFile'
    },
    {
      key: 'nodefile'
    },
    {
      key: 'getUserEnv'
    },
    {
      key: 'immediate'
    },
    {
      key: 'input'
    },
    {
      key: 'jobName'
    },
    {
      key: 'jobid'
    },
    {
      key: 'noKill'
    },
    {
      key: 'licenses'
    },
    {
      key: 'mailType'
    },
    {
      key: 'mailUser'
    },
    {
      key: 'mem'
    },
    {
      key: 'memPerCpu'
    },
    {
      key: 'nodes'
    },
    {
      key: 'noRequeue'
    },
    {
      key: 'output'
    },
    {
      key: 'qos'
    },
    {
      key: 'requeue'
    },
    {
      key: 'time'
    }
  ];
  return {
    setFormConfig: function (fc) {
      formConfig = fc;
    },
    getFormConfig: function () {
      return $http
        .get('/slurm/a/config')
        .success(function (data, status, headers, config) {
          return data;
        });
    }
  };
}])
.controller('SlurmCtrl', ['$scope', 'formConfig', 'FormService', '$log', function($scope,formConfig,FormService,$log) {
  FormService.setFormConfig(formConfig);
}]);

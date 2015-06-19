'use strict';

angular.module('oide.slurm', ['ngRoute','ui.bootstrap','ui.ace'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/slurm', {
    templateUrl: '/static/slurm/slurm.html',
    controller: 'SlurmCtrl'//,
    //resolve: {
    //  formConfig: function (FormService) {
    //    return FormService.getFormConfig();
    //  }
    //}
  });
}])
.factory('FormService', ['$http', function ($http) {
  var formConfig = {};
  var formFields = [
    {
      key: 'array',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'account',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'begin',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'checkpoint',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'checkpointDir',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'cpusPerTask',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'workDir',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'error',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'export',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'exportFile',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'nodefile',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'getUserEnv',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'immediate',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'input',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'jobName',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'jobid',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'noKill',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'licenses',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'mailType',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'mailUser',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'mem',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'memPerCpu',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'nodes',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'noRequeue',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'output',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'qos',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'requeue',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    },
    {
      key: 'time',
      type:'input',
      templateOptions:{
        type:'text',
        label:'foo',
        placeholder:'bar',
        required:true
      }
    }
  ];
  return {
    formFieldsObj:{formFields:formFields},
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
.controller('SlurmCtrl', ['$scope',/* 'formConfig',*/ 'FormService', '$log', function($scope,/*formConfig,*/FormService,$log) {
  //FormService.setFormConfig(formConfig);
  $scope.test = "THIS IS TEST";
  $scope.model = {array:''};
  $scope.formFields = FormService.formFieldsObj.formFields; // passing by reference

}]);

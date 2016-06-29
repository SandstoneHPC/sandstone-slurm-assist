'use strict';

angular.module('sandstone.slurm')

.factory('ScheduleService', ['$http','$log',function($http,$log) {
  var formConfig;
  return {
    loadFormConfig: function() {
      return $http
        .get('/slurm/a/config')
        .success(function (data, status, headers, config) {
          $log.log(data);
          formConfig = data.formConfig;
        });
    },
    getFormConfig: function() {
      return formConfig;
    }
  };
}]);

'use strict';

angular.module('sandstone.slurm')

.factory('StatusService', ['$http','$log',function($http,$log) {
  return {
    getJobList: function(callback) {
      $http
        .get('/slurm/a/jobs')
        .success(function(response) {
          callback(response);
        });
    },
    getJob: function(jobId,callback) {
      $http
        .get('/slurm/a/jobs/'+jobId)
        .success(function(response) {
          callback(response);
        });
    }
  };
}]);

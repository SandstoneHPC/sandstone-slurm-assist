'use strict';

angular.module('sandstone.slurm')

.controller('ScheduleCtrl', ['$scope','$log','$modal','ScheduleService',function($scope,$log,$modal,ScheduleService) {
  var self = this;

  self.formConfig = ScheduleService.getFormConfig();
  self.form = {};
}]);

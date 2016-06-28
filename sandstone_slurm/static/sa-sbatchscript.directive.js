'use strict';

angular.module('sandstone.slurm')

.directive('saSbatchScript', [function() {
  return {
    restrict: 'A',
    scope: {
      
    },
    templateUrl: '/static/slurm/templates/sa-sbatchscript.html',
    controller: function($scope,$element,$timeout) {

    }
  };
}]);

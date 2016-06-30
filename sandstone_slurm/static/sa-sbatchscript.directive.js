'use strict';

angular.module('sandstone.slurm')

.directive('saSbatchScript', [function() {
  return {
    restrict: 'A',
    scope: {
      sbatch: '='
    },
    templateUrl: '/static/slurm/templates/sa-sbatchscript.html',
    controller: function($scope,$element,$timeout) {
      $scope.directives = '#!/bin/bash\n';

      $scope.$watch('sbatch', function(newVal, oldVal) {
        var dirString = '#!/bin/bash\n';
        for (var k in newVal) {
          if ((typeof newVal[k] !== 'undefined') && (newVal[k] !== '') && (newVal[k] !== false)) {
            if ((typeof newVal[k] === 'boolean') && (newVal[k])) {
              dirString += '#SBATCH --' + k + '\n';
            } else {
              dirString += '#SBATCH --' + k + '=' + newVal[k] + '\n';
            }
          }
        }
        $scope.directives = dirString;
      }, true);
    }
  };
}]);

'use strict';

angular.module('sandstone.slurm')

.directive('saSbatchScript', [function() {
  return {
    restrict: 'A',
    scope: {
      sbatch: '=',
      script: '=',
      sbatchScript: '='
    },
    templateUrl: '/static/slurm/templates/sa-sbatchscript.html',
    controller: function($scope,$element,$timeout) {
      $scope.directives = '#!/bin/bash\n';
      $scope.script = '# Add your script below\n# ex: "srun echo $(hostname)"\n'

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
        $scope.sbatchScript = dirString + $scope.script;
      }, true);
    }
  };
}]);

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
          if (k === 'selectedProfile') {
            var cmps = newVal[k].split(',');
            if ((typeof cmps[0] !== 'undefined') && (cmps[0] !== '')) {
              dirString += '#SBATCH --qos=' + cmps[0] + '\n';
            }
            if ((typeof cmps[1] !== 'undefined') && (cmps[1] !== '')) {
              dirString += '#SBATCH --partition=' + cmps[1] + '\n';
            }
          } else if ((typeof newVal[k] !== 'undefined') && (newVal[k] !== '') && (newVal[k] !== false)) {
            dirString += '#SBATCH --' + k + '=' + newVal[k] + '\n';
          }
        }
        $scope.directives = dirString;
      }, true);
    }
  };
}]);

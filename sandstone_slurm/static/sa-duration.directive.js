'use strict';

angular.module('sandstone.slurm')

.directive('saDuration', function (){
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      minDuration: '=',
      maxDuration: '='
    },
    link: function($scope, elem, attr, ngModel) {
      var isValid = function(duration) {
        var min = parseInt($scope.minDuration, 10);
        var max = parseInt($scope.maxDuration, 10);
        var valid, validMin, validMax;
        valid = validMin = validMax = false;
        var cmps = duration.split(/\:|\-/).reverse();
        var mins = 0;
        var secs = parseFloat(cmps[0]) / 60.0;
        mins += parseInt(secs);
        mins += parseInt(cmps[1],10);
        mins += 60 * parseInt(cmps[2],10);
        if (cmps.length === 4) {
          mins += 1440 * parseInt(cmps[3],10);
        }
        // secs = mins * 60;
        if (typeof min !== 'undefined') {
          validMin = min <= mins;
        } else {
          validMin = true;
        }
        if (typeof max !== 'undefined') {
          validMax = mins <= max;
        } else {
          validMax = true;
        }
        valid = validMin && validMax;
        return valid;
      };

      ngModel.$parsers.unshift(function(value) {
        var valid = isValid(value);
        ngModel.$setValidity('saDuration', valid);
        return valid ? value : undefined;
      });

      ngModel.$formatters.unshift(function(value) {
        var valid = isValid(value);
        ngModel.$setValidity('saDuration', valid);
        return value;
      });
    }
  };
});

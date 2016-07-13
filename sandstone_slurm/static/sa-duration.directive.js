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
        var cmps;
        var min = parseInt($scope.minDuration, 10);
        var max = parseInt($scope.maxDuration, 10);
        var valid, validMin, validMax;
        valid = validMin = validMax = false;
        try {
          cmps = duration.split(/\:|\-/).reverse();
        } catch(err) {
          return false;
        }
        var mins = 0;

        if (cmps.length === 1) {
          // MM
          mins += parseInt(cmps[0],10);
        } else {
          // ...:SS
          var secs = parseFloat(cmps[0]) / 60.0;
          mins += parseInt(secs);
        }
        if (cmps.length > 1) {
          // MM:SS
          mins += parseInt(cmps[1],10);
        }
        if (cmps.length > 2) {
          // HH:MM:SS
          mins += 60 * parseInt(cmps[2],10);
        }
        if (cmps.length > 3) {
          // DD-HH:MM:SS
          mins += 1440 * parseInt(cmps[3],10);
        }
        if ((typeof min !== 'undefined') && (!isNaN(min))) {
          validMin = min <= mins;
        } else {
          validMin = true;
        }
        if ((typeof max !== 'undefined') && (!isNaN(max))) {
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

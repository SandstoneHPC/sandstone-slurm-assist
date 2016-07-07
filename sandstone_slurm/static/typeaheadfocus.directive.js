'use strict';

angular.module('sandstone.slurm')

.directive('typeaheadFocus', function (){
  return {
    require: 'ngModel',
    link: function (scope,element,attr,ngModel){
      element.bind('click', function () {
        var viewValue = ngModel.$viewValue;

        if (ngModel.$viewValue == ' '){
          ngModel.$setViewValue(null);
        }
        ngModel.$setViewValue(' ');
        ngModel.$setViewValue(viewValue || ' ');
      });

      element.bind('keyup', function(event){
        if (event.which === 8){ // when backspace is released
          if (ngModel.$viewValue.length < 1 && ngModel.$viewValue === ''){
            ngModel.$setViewValue(' ');
          }
        }
      });

      scope.emptyOrMatch = function (actual,expected){
        if (expected == ' ') return true;
        return actual.indexOf(expected) > -1;
      };
    }

  };
});

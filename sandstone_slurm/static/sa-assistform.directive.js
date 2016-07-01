'use strict';

angular.module('sandstone.slurm')

.directive('saAssistForm', [function() {
  return {
    restrict: 'A',
    scope: {
      config: '=',
      sbatch: '='
    },
    templateUrl: '/static/slurm/templates/sa-assistform.html',
    controller: function($scope,$element,$timeout) {
      $scope.selectedProfile = '';
      $scope.fields = [];

      var addField = function(fieldName) {

      };

      $scope.removeField = function(field) {
        var i;
        i = $scope.fields.indexOf(field);
        if (i >= 0) {
          delete $scope.sbatch[field.title];
          $scope.fields.splice(i, 1);
        }
      };

      $scope.onTypeaheadKey = function($event) {
        if ($event.which===13){
          var sel = $scope.selectedProp;
          var propSchema;
          try {
            propSchema = $scope
                .config.profiles[$scope.selectedProfile]
                .schema.properties[sel];
            $scope.fields.push(propSchema);
            $scope.selectedProp = '';
          } catch(err) {
            return;
          }
        }
      };

      $scope.getProperties = function() {
        var props = [];
        try {
          for (var p in $scope.config.profiles[$scope.selectedProfile].schema.properties) {
            if (!$scope.form.hasOwnProperty(p)) {
              props.push(p);
            }
          }
        } catch(err) {}
        return props;
      };

      $scope.getProfiles = function() {
        var keys = [];
        for (var k in $scope.config.profiles) keys.push(k);
        return keys;
      };

      $scope.selectProfile = function() {
        // Update schema, transfer values
        $scope.fields = [];

        var prof = $scope.config.profiles[$scope.selectedProfile];
        if (prof.schema.hasOwnProperty('required')) {
          for (var i=0;i<prof.schema.required.length;i++) {
            $scope.fields.push(prof.schema.properties[prof.schema.required[i]]);
          }
        }
        if (prof.hasOwnProperty('initial')) {
          for (var i=0;i<prof.initial.length;i++) {
            if (prof.schema.required.lastIndexOf(prof.initial[i]) < 0) {
              $scope.fields.push(prof.schema.properties[prof.initial[i]]);
            }
          }
        }
      };
    }
  };
}]);

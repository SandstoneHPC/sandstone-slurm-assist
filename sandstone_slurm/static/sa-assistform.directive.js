'use strict';

angular.module('sandstone.slurm')

.directive('saAssistForm', [function() {
  return {
    restrict: 'A',
    scope: {
      config: '@',
      sbatch: '=',
      form: '='
    },
    templateUrl: '/static/slurm/templates/sa-assistform.html',
    controller: function($scope,$element,$timeout) {
      $scope.selectedProfile = '';

      $scope.$watch(
        function() {
          return $scope.form.profile.$modelValue;
        },
        function(newVal) {
          $scope.selectProfile();
        }
      );

      $scope.getFields = function() {
        var fieldNames = [];
        var fields = [];
        if (!$scope.selectedProfile) {
          return fields;
        }
        var schema = $scope
          .config
          .profiles[$scope.selectedProfile]
          .schema;
          
        for (var k in $scope.form) {
          if ((!k.startsWith('$')) && (k !== 'profile')) {
            var s = schema.properties[k];
            fieldNames.push(k);
            fields.push(s);
          }
        }

        for (k in sbatch) {
          if (fieldNames.indexOf(k) < 0) {
            var s = schema.properties[k];
            fieldNames.push(k);
            fields.push(s);
          }
        }

        return fields;
      };

      $scope.addField = function(prop) {

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
        var k;
        // $scope.fields = [];
        // $scope.sbatch = {};
        if (!$scope.selectedProfile) {
          return;
        }
        var prof = $scope.config.profiles[$scope.selectedProfile];
        if (prof.schema.hasOwnProperty('required')) {
          for (var i=0;i<prof.schema.required.length;i++) {
            k = prof.schema.required[i];
            $scope.fields.push(prof.schema.properties[k]);
            if (prof.schema.properties[k].hasOwnProperty('default')) {
              $scope.sbatch[k] = prof.schema.properties[k].default;
            }
          }
        }
        if (prof.hasOwnProperty('initial')) {
          for (var i=0;i<prof.initial.length;i++) {
            if (prof.schema.required.lastIndexOf(prof.initial[i]) < 0) {
              k = prof.initial[i];
              $scope.fields.push(prof.schema.properties[k]);
              if (prof.schema.properties[k].hasOwnProperty('default')) {
                $scope.sbatch[k] = prof.schema.properties[k].default;
              }
            }
          }
        }
      };
    }
  };
}]);

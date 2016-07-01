'use strict';

angular.module('sandstone.slurm')

.controller('ScheduleCtrl', ['$log','$modal','ScheduleService',function($log,$modal,ScheduleService) {
  var self = this;

  self.sbatch = {};
  self.script = '';
  self.form = {}

  self.formConfig = ScheduleService.getFormConfig();
  self.saveScript = function() {
    var contents = self.script;
    var saveScriptModalInstance = $modal.open({
      templateUrl: '/static/slurm/templates/modals/savescript.modal.html',
      controller: 'SaveScriptCtrl',
      controllerAs: 'ctrl',
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      resolve: {
        action: function () {
          return 'save';
        }
      }
    });
    saveScriptModalInstance.result.then(
      function(filepath) {
        ScheduleService.saveScript(filepath,contents);
      },
      function(filepath) {
        $log.debug('Modal dismissed at: ' + new Date());
      }
    );
  };
  self.submitScript = function() {
    var contents = self.script;
    var submitScriptModalInstance = $modal.open({
      templateUrl: '/static/slurm/templates/modals/savescript.modal.html',
      controller: 'SaveScriptCtrl',
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      resolve: {
        action: function () {
          return 'submit';
        }
      }
    });
    submitScriptModalInstance.result.then(
      function(filepath) {
        ScheduleService.submitScript(filepath,contents);
      },
      function(filepath) {
        $log.debug('Modal dismissed at: ' + new Date());
      }
    );
  };
  self.getEstimate = function() {
    var estimateModalInstance = $modal.open({
      templateUrl: '/static/slurm/templates/modals/estimate.modal.html',
      controller: 'EstimateCtrl',
      size: 'lg',
      resolve: {
        sbatch: function () {
          return self.sbatch;
        }
      }
    });
  };
}])
.controller('EstimateCtrl', ['$scope','$modalInstance','sbatch',function($scope,$modalInstance,sbatch) {
  $scope.sbatch = sbatch;
  // nodes * time (min) * 12 (no node sharing)
  $scope.estimate = {
    su: NaN,
    reason: 'No node count specified.'
  };

  $scope.dismiss = function () {
    $modalInstance.dismiss('cancel');
  };

  if (sbatch.hasOwnProperty('nodes')) {
    if (sbatch.hasOwnProperty('time')) {
      var cmps = sbatch.time.split(/\:|\-/).reverse();
      var mins = 0;
      mins += parseInt(cmps[1],10);
      mins += 3600 * parseInt(cmps[2],10);
      if (cmps.length === 4) {
        mins += (24 * 3600) * parseInt(cmps[3],10);
      }
      $scope.estimate.su = sbatch.nodes * mins * 12;
      $scope.estimate.reason = undefined;
    } else {
      $scope.estimate.reason = 'No wall time specified.';
    }
  }
}])
.controller('SaveScriptCtrl', ['$scope','$modalInstance','action',function($scope,$modalInstance,action) {
  if (action === 'save') {
    $scope.title = "Save Script As";
  } else if (action === 'submit') {
    $scope.title = "Save & Schedule Script";
  }
  $scope.treeData = {
    filetreeContents: [],
    selectedNodes: []
  };

  $scope.newFile = {
    filename: '',
    filepath: '-/'
  }
  $scope.invalidFilepath = true;

  $scope.$watch(function(){
    return $scope.treeData.selectedNodes;
  }, function(newValue){
    if(newValue.length > 0) {
      if (newValue[0].type === 'file') {
        $scope.newFile.filename = newValue[0].filename;
        $scope.newFile.filepath = newValue[0].filepath.replace(newValue[0].filename,'');
      } else {
        $scope.newFile.filepath = newValue[0].filepath;
      }
    }
    $scope.updateSaveName();
  });

  $scope.updateSaveName = function () {
    if (($scope.newFile.filepath.substr(0,1) !== '-') && (typeof $scope.newFile.filename !== 'undefined')) {
      $scope.invalidFilepath = false;
    }
  };

  $scope.saveAs = function () {
    var filepath = $scope.newFile.filepath + $scope.newFile.filename;
    if (filepath.substr(filepath.length-3) !== '.sh') {
      filepath += '.sh';
    }
    $modalInstance.close(filepath);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

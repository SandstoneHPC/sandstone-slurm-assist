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
      size: 'lg'
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
}])
.controller('SaveScriptCtrl', ['$scope','$modalInstance',function($scope,$modalInstance) {
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

'use strict';

angular.module('sandstone.slurm')

.controller('FilepathSelectCtrl', ['$log','$scope','$modal',function($log,$scope,$modal) {
  var self = this;

  self.selectFilepath = function() {
    var selectFilepathModalInstance = $modal.open({
      templateUrl: '/static/slurm/sa-assistform/filepathselect.modal.html',
      controller: 'FiletreeSelectCtrl',
      controllerAs: 'ctrl',
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      resolve: {
        filepath: function () {
          return $scope.sbatch[$scope.field.title];
        },
        dironly: function() {
          return $scope.field.dironly;
        }
      }
    });
    selectFilepathModalInstance.result.then(
      function(filepath) {
        $scope.sbatch[$scope.field.title] = filepath;
      },
      function(filepath) {
        $log.debug('Modal dismissed at: ' + new Date());
      }
    );
  };
}])
.controller('FiletreeSelectCtrl', ['$scope','$modalInstance','filepath','dironly',function($scope,$modalInstance,filepath,dironly) {
  $scope.dironly = dironly;
  $scope.title = "Select or create filepath";
  if (dironly) {
    $scope.title = "Select directory";
  }
  $scope.treeData = {
    filetreeContents: [],
    selectedNodes: []
  };

  if (filepath) {
    var fn = filepath.substring(filepath.lastIndexOf('/')+1);
    var dn = filepath.replace(fn, '');
    $scope.newFile = {
      filename: fn,
      filepath: dn
    }
    $scope.invalidFilepath = false;
  } else {
    $scope.newFile = {
      filename: '',
      filepath: '-/'
    }
    $scope.invalidFilepath = true;
  }

  $scope.$watch(function(){
    return $scope.treeData.selectedNodes;
  }, function(newValue){
    if(newValue.length > 0) {
      if (newValue[0].type === 'file') {
        $scope.newFile.filename = newValue[0].filename;
        $scope.newFile.filepath = newValue[0].filepath.replace(newValue[0].filename,'');
      } else {
        $scope.newFile.filepath = newValue[0].filepath;
        if (newValue[0].filepath.substr(newValue[0].filepath.length-1) !== '/') {
          $scope.newFile.filepath = $scope.newFile.filepath + '/';
        }
      }
    }
    $scope.updateSaveName();
  });

  $scope.updateSaveName = function () {
    if ($scope.newFile.filepath.substr(0,1) !== '-') {
      $scope.invalidFilepath = false;
    }
  };

  $scope.selectPath = function () {
    var filepath = $scope.newFile.filepath + $scope.newFile.filename;
    $modalInstance.close(filepath);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

'use strict';

angular.module('oide.slurm', ['ngRoute','ui.bootstrap','schemaForm','ui.ace','smart-table'])

.config(['$routeProvider','schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
 function($routeProvider,schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {
  $routeProvider.when('/slurm', {
    templateUrl: '/static/slurm/slurm.html',
    controller: 'SbatchCtrl'
  });
  //Add to the bootstrap directive
    schemaFormDecoratorsProvider.addMapping(
      'bootstrapDecorator',
      'custom_input',
      '/static/slurm/templates/custom_elements/custom_input.html'
    );
    schemaFormDecoratorsProvider.createDirective(
      'custom_input',
      '/static/slurm/templates/custom_elements/custom_input.html'
    );

    schemaFormDecoratorsProvider.addMapping(
      'bootstrapDecorator',
      'custom_checkbox',
      '/static/slurm/templates/custom_elements/custom_checkbox.html'
    );
    schemaFormDecoratorsProvider.createDirective(
      'custom_checkbox',
      '/static/slurm/templates/custom_elements/custom_checkbox.html'
    );
}])

.factory('FormService', ['$http', function ($http) {
  var formFieldsObj = {};
  // check is for checking if a specific field is selected by a user
  // Default fields have true at the beginning
  var check = {
    array:false,
    account:false,
    begin:false,
    checkpoint:false,
    checkpointDir:false,
    cpusPerTask:false,
    workdir:false,
    error:false,
    export:false,
    exportFile:false,
    nodefile:false,
    getUserEnv:false,
    immediate:false,
    input:false,
    jobName:false,
    jobid:false,
    noKill:false,
    licenses:false,
    mailType:false,
    mailUser:false,
    mem:false,
    memPerCpu:false,
    nodes:false,
    noRequeue:false,
    output:false,
    qos:false,
    requeue:false,
    time:false
  };
  formFieldsObj.formModel = {check:check};
  
  var getFormSchema = function () {
      return $http
        .get('/slurm/a/config')
        .success(function (data, status, headers, config) {
          formFieldsObj.schema = data.formSchema;
        });
    };
  getFormSchema();

  return {
    formFieldsObj:formFieldsObj
  };
}])

.factory('ScriptService',function(){
  // script is used from SBATCH SCRIPT
  var SbatchScript = {script:''};
  var SbatchDirectives = {script:''};
  return {
    SbatchScript:SbatchScript,
    SbatchDirectives:SbatchDirectives
  };
})

.factory('AjaxCallService',['$http','$q',function($http,$q){
  return {
  getJobList: function(){

    var defer = $q.defer();
    $http
      .get('/slurm/a/jobs')
      .success(function (response){
        defer.resolve(response);
     }
   );

   return defer.promise;
  },

  getJob: function(jobid){

    var defer = $q.defer();
    $http
      .get('/slurm/a/jobs/id'.replace('id',jobid))
      .success(function (response){
        defer.resolve(response);
      }
  );

  return defer.promise;
  }
};
}
])

// a directive below is kind of a hacky solution to
// the issue of typeahead
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
})
.controller('SbatchCtrl', ['$scope','FormService','$log',function($scope,FormService,$log) {
  $scope.formModel = FormService.formFieldsObj.formModel;
  $scope.schema = FormService.formFieldsObj.schema;
  $scope.options = Object.keys($scope.formModel.check);
  $scope.form = [
      {
        "key": "array",
        "type":"custom_input",
        "condition": "model.check.array",
        "popover":"Anta Bakaa?",
        "delete": function (key){$scope.formModel.check[key] = false;},
        "required": true
      },
      {
        "key": 'immediate',
        "type":"custom_checkbox",
        "condition": "model.check.immediate",
        "popover":"Anta Bakaa?",
        "delete": function (key){$scope.formModel.check[key] = false;},
        "required": true
      }
  ];


  $scope.onEnter = function($event) {
    if ($event.which===13){
        $scope.formModel.check[$scope.selected] = true;
        $scope.selected = "";
    }
  };

}])
.controller('DirectivesCtrl', ['$scope','FormService','ScriptService','$log',function($scope,FormService,ScriptService,$log) {
  // This function distinguishes boolean values and "no option" string from other options
  var noBoolean = function (s){ return ((typeof s === 'boolean')||(/^([nN]o[\s\-][oO]ptions?)$/.test(s)))?  '' : '=' + s; };
  $scope.aceModelDirectives = ScriptService.SbatchDirectives;
  $scope.directivesObj = FormService.formFieldsObj.formModel;
  $scope.$watch('directivesObj', function(newVal, oldVal){
  var dirString = '';

    for (var k in newVal) {
      if ((typeof newVal[k] !== 'undefined') && (newVal[k] !== '') && (k !== 'check')) {
        dirString += '#SBATCH --' + k.replace(/([A-Z])/g,function(whole,s1){return '-'+s1.toLowerCase();}) + noBoolean(newVal[k]) + '\n';
      }
    }
    $scope.aceModelDirectives.script = dirString;
  }, true);

}])

.controller('ScriptCtrl',['$scope','ScriptService','$log',function($scope,ScriptService,$log){
  // Two way biding by object reference. $scope.aceModelScript.script is the actual string
  $scope.aceModelScript = ScriptService.SbatchScript;
}])


.controller('controlBar',['$scope','$modal','FormService','ScriptService','$log',function($scope,$modal,FormService,ScriptService,$log){

  $scope.loadScript = function(){
    var loadScriptModal = $modal.open({
      templateUrl: '/static/slurm/templates/modals/load_script_modal.html',
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      controller:'LoadScriptCtrl'
    });
    };

  $scope.saveScript = function(){
    var saveScriptModal = $modal.open({
      templateUrl: '/static/slurm/templates/modals/save_script_modal.html',
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      controller:'SaveScriptCtrl',
    });
  };

  $scope.estimate = function (){
    var estimateModal = $modal.open({
       templateUrl: '/static/slurm/templates/modals/estimateModal.html',
       controller: 'estimateCtrl',
       resolve:{
         serviceUnit: function (){
           return $scope.serviceUnitEstimate();
         }
       }
    });
  };

  $scope.Submit = function () {
    /*
    var SbatchDirectives = ScriptService.SbatchDirectives;
    var SbatchScript = ScriptService.SbatchScript;
    var matched = SbatchScript.script.match(/#!\/bin\/(sh|ksh|bash|zsh|csh|tcsh)\n/);
    // if matched is not null (or undefined)
    var shellType = 'bash';
    if (matched) shellType = matched[1];
    var content = '#!/bin/'+shellType+'\n' + SbatchDirectives.script + SbatchScript.script.replace(/#!\/bin\/(sh|ksh|bash|zsh|csh|tcsh)/,"");
    console.log(content);
    */
    var submittModal = $modal.open({
      templateUrl: '/static/slurm/templates/modals/submit_modal.html',
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      controller:'SubmitCtrl',
    });
  };

  // Limits values may change.
  $scope.timeLimits = {
    "crc-himem": 14*24,
    "crc-seria": 14*24,
    "crc-gpu"  : 4,
    "janus"    : 24,
    "ipcc"     : 4
  };

  $scope.nodeLimits = {
    "crc-himem": 1,
    "crc-seria": 11,
    "crc-gpu"  : 2,
    "janus"    : 1037,
    "ipcc"     : 4

  };
  $scope.serviceUnitEstimate = function(){
    var seconds = "(:[0-5][0-9])";
    var minutes = "([0-5][0-9])";
    var hours   = "(2[0-3]|[01][0-9])";
    var days    = "([1-9]|[1-9]+[0-9])"

    var defaultTimeLimit = $scope.timeLimits["janus"];
    var defaultNodeLimit = $scope.nodeLimits["janus"];
    var timeLimit = 0;
    var nodeLimit = 0;
    var model = FormService.formFieldsObj.formModel;

    //----Get time limit-------------------------------------
    if (model["time"] === undefined){
      timeLimit = defaultTimeLimit;
    }

    else{
      /* minutes or minutes:seconds */
      if (RegExp("^" + minutes + seconds + "?" + "$").test(model["time"])){
        var match = RegExp("^" + minutes + seconds + "?" + "$").exec(model["time"]);
        timeLimit = parseInt(match[1])/60;
      }
      /* hours:minutes:seconds */
      else if (RegExp("^" + hours + ":" + minutes + seconds + "$").test(model["time"])){
        var match = RegExp("^" + hours + ":" + minutes + seconds + "$").exec(model["time"]);
        timeLimit = parseInt(match[1]) + parseInt(match[2])/60;
      }
      /* days-hours:minutes?seconds? */
      else if (RegExp("^" + days +"-"+ hours + "(:" + minutes + ")?" + seconds + "?" + "$").test(model["time"])){
        var match = RegExp("^" + days +"-"+ hours + "(:" + minutes + ")?" + seconds + "?" + "$").exec(model["time"]);
        timeLimit = parseInt(match[1])*24 + parseInt(match[2]);
      }

    }

    //-------Get node limit------------------------------------
    if (model["nodes"] === undefined){
      nodeLimit = defaultNodeLimit;
    }

    else {
      var match = /(^[1-9]\d*)(-[1-9]\d*)?$/.exec(model["nodes"]);
      if (match[2] === undefined) nodeLimit = parseInt(match[1]);
      else nodeLimit = -1*parseInt(match[2]); // notice the minus sign.
    };

    return {
      'timeLimit': timeLimit,
      'nodeLimit': nodeLimit,
      'result': timeLimit*nodeLimit
    };
  }
}])

.controller('estimateCtrl', function($scope,$modalInstance,serviceUnit){
  $scope.serviceUnit = serviceUnit;
})

.controller('LoadScriptCtrl',function($scope,$modalInstance,FormService,ScriptService,$http,$log){
  $scope.formModel = FormService.formFieldsObj.formModel;
  $scope.SbatchScript = ScriptService.SbatchScript;
  $scope.treeData = {};
  var initialContents = $http
   .get('/filebrowser/filetree/a/dir')
   .success(function(data, status, headers, config) {
     for (var i=0;i<data.length;i++) {
       data[i].children = [];
     }
     $scope.treeData.filetreeContents = data;
   }).
   error(function(data, status, headers, config) {
     $log.error('Failed to initialize filetree.');
   });
   $scope.getDirContents = function (node,expanded) {
     $http
       .get('/filebrowser/filetree/a/dir', {
         params: {
           dirpath: node.filepath
         }
       }).
       success(function(data, status, headers, config) {
         for (var i=0;i<data.length;i++) {
           if (!data[i].hasOwnProperty('children')) {
             data[i].children = [];
           }
         }
         node.children = data;
       }).
       error(function(data, status, headers, config) {
         $log.error('Failed to grab dir contents from ',node.filepath);
       });
 };
 $scope.loadFile = {};
 $scope.invalidFilepath = false;

 $scope.updateSaveName = function (node, selected) {
   $scope.invalidFilepath = false;
   if (node.type === 'dir') {
     $scope.loadFile.filepath = node.filepath;
   } else {
     var index = node.filepath.lastIndexOf('/')+1;
     var filepath = node.filepath.substring(0,index);
     var filename = node.filepath.substring(index,node.filepath.length);
     $scope.loadFile.filepath = filepath;
     $scope.loadFile.filename = filename;
   }
 };
 $scope.treeOptions = {
   multiSelection: false,
   isLeaf: function(node) {
     return node.type !== 'dir';
   },
   injectClasses: {
     iExpanded: "filetree-icon fa fa-folder-open",
     iCollapsed: "filetree-icon fa fa-folder",
     iLeaf: "filetree-icon fa fa-file",
   }
 };

 $scope.load = function () {
    // initialize the script string
   $scope.SbatchScript.script = ''
   // initialize the form model
   for (var k in $scope.formModel) {
     if (k === 'check') {
       for (var kk in $scope.formModel.check) {
         // hide all of the present input fileds
         $scope.formModel.check[kk] = false;
       }
     }
     else delete $scope.formModel[k];
   }

   $scope.loadFile.filepath = $scope.loadFile.filepath+$scope.loadFile.filename;
   $modalInstance.close($scope.loadFile);
   $http
     .get('/filebrowser/localfiles' + $scope.loadFile.filepath)
     .success(function (data,status,headers,config){
       var script = data.content.split("\n")
       for (var i = 0; i < script.length; i++) {
        //-------------------------SBATCH BUILDER------------------------------------
         // if a string starts with #SBATCH
         if (/^#SBATCH/.test(script[i])){
           // and if a command takes some optional parameters (e.g. --begin=12:00)
           if (/--[a-z/-]+=/.test(script[i])){
             var command = script[i].split('--')[1].split("=")[0];
             var args = script[i].split('--')[1].split("=")[1];
             //camelize the command
             command = command.replace(/-([a-z])/g,function(whole,s1){return s1.toUpperCase();});
             $scope.formModel.check[command] = true;
             $scope.formModel[command] = args;
           }
           // if parameter specification uses whitespaces (e.g. --nodes 10)
           else if (/--[a-z/-]+\s+\S+/.test(script[i])){
             var command = script[i].split('--')[1].split(" ")[0];
             var x = script[i].split('--')[1]  // this should look like "nodes  10"
             var args = x.split(" ")[x.split(' ').length-1];
             //camelize the command
             command = command.replace(/-([a-z])/g,function(whole,s1){return s1.toUpperCase();});
             $scope.formModel.check[command] = true;
             $scope.formModel[command] = args;
           }

           // else, namely the command does not take any options (e.g. --immediate, --requeue)
           else {
             //camelize the command
             var command = script[i].split('--')[1].replace(/-([a-z])/g,function(whole,s1){return s1.toUpperCase();});
             $scope.formModel.check[command] = true;
             if (command === "getUserEnv") $scope.formModel[command] = "no option";
             else $scope.formModel[command] = true;
           }
         }
         //------------------------- SBATCH SCRIPT------------------------------------
         else {
           $scope.SbatchScript.script += script[i] + '\n';
         }
       }
     })
 };

 $scope.cancel = function () {
   $modalInstance.dismiss('cancel');
 };
})

.controller('SaveScriptCtrl',function($scope,$modalInstance,FormService,ScriptService,$http,$log){
  $scope.SbatchDirectives = ScriptService.SbatchDirectives;
  $scope.SbatchScript = ScriptService.SbatchScript;
  $scope.treeData = {};
  var initialContents = $http
   .get('/filebrowser/filetree/a/dir')
   .success(function(data, status, headers, config) {
     for (var i=0;i<data.length;i++) {
       data[i].children = [];
     }
     $scope.treeData.filetreeContents = data;
   }).
   error(function(data, status, headers, config) {
     $log.error('Failed to initialize filetree.');
   });
   $scope.getDirContents = function (node,expanded) {
     $http
       .get('/filebrowser/filetree/a/dir', {
         params: {
           dirpath: node.filepath
         }
       }).
       success(function(data, status, headers, config) {
         for (var i=0;i<data.length;i++) {
           if (!data[i].hasOwnProperty('children')) {
             data[i].children = [];
           }
         }
         node.children = data;
       }).
       error(function(data, status, headers, config) {
         $log.error('Failed to grab dir contents from ',node.filepath);
       });
 };
 $scope.newFile = {};
 $scope.invalidFilepath = false;

 $scope.updateSaveName = function (node, selected) {
   $scope.invalidFilepath = false;
   if (node.type === 'dir') {
     $scope.newFile.filepath = node.filepath;
   } else {
     var index = node.filepath.lastIndexOf('/')+1;
     var filepath = node.filepath.substring(0,index);
     var filename = node.filepath.substring(index,node.filepath.length);
     $scope.newFile.filepath = filepath;
     $scope.newFile.filename = filename;
   }
 };
 $scope.treeOptions = {
   multiSelection: false,
   isLeaf: function(node) {
     return node.type !== 'dir';
   },
   injectClasses: {
     iExpanded: "filetree-icon fa fa-folder-open",
     iCollapsed: "filetree-icon fa fa-folder",
     iLeaf: "filetree-icon fa fa-file",
   }
 };

 $scope.saveAs = function () {
      var matched = $scope.SbatchScript.script.match(/#!\/bin\/(sh|ksh|bash|zsh|csh|tcsh)\n/);
      // if matched is not null (or undefined)
      var shellType = 'bash';
      if (matched) shellType = matched[1];
      var content = '#!/bin/'+shellType+'\n' + $scope.SbatchDirectives.script + $scope.SbatchScript.script.replace(/#!\/bin\/(sh|ksh|bash|zsh|csh|tcsh)/,"");
      var file_abs_path = $scope.newFile.filepath + $scope.newFile.filename;

      $http
        .get(
          '/filebrowser/a/fileutil',
          {
            params: {
             operation: 'CHECK_EXISTS',
              filepath: file_abs_path
            }
          }
        )
        .success(function (data, status, headers, config) {
          if (data.result) {
            $http({
              url: '/filebrowser/localfiles'+file_abs_path,
              method: 'PUT',
              params: {
                _xsrf: getCookie('_xsrf')
              },
              data: {'content': content}
            })
            .success(function (data,status, headers, config) {
              $log.debug('Saved file: ', file_abs_path);
            });
          } else {
            $http({
              url: '/filebrowser/localfiles'+file_abs_path,
              method: 'POST',
              params: {
                _xsrf: getCookie('_xsrf')
              }
            })
            .success(function (data,status, headers, config) {
              $http({
                url: '/filebrowser/localfiles'+file_abs_path,
                method: 'PUT',
                params: {
                  _xsrf: getCookie('_xsrf')
                },
                data: {'content': content}
              })
              .success(function (data,status, headers, config) {
                $log.debug('Saved file: ', file_abs_path);
              });
            });
          }
          });

        $modalInstance.dismiss('cancel');
        };

 $scope.cancel = function () {
   $modalInstance.dismiss('cancel');
 };
})

.controller('SubmitCtrl',function($scope,$modalInstance,FormService,ScriptService,$http,$log){
  $scope.treeData = {};
  var initialContents = $http
   .get('/filebrowser/filetree/a/dir')
   .success(function(data, status, headers, config) {
     for (var i=0;i<data.length;i++) {
       data[i].children = [];
     }
     $scope.treeData.filetreeContents = data;
   }).
   error(function(data, status, headers, config) {
     $log.error('Failed to initialize filetree.');
   });
   $scope.getDirContents = function (node,expanded) {
     $http
       .get('/filebrowser/filetree/a/dir', {
         params: {
           dirpath: node.filepath
         }
       }).
       success(function(data, status, headers, config) {
         for (var i=0;i<data.length;i++) {
           if (!data[i].hasOwnProperty('children')) {
             data[i].children = [];
           }
         }
         node.children = data;
       }).
       error(function(data, status, headers, config) {
         $log.error('Failed to grab dir contents from ',node.filepath);
       });
   };
 $scope.loadFile = {};
 $scope.invalidFilepath = false;

 $scope.updateSaveName = function (node, selected) {
   $scope.invalidFilepath = false;
   if (node.type === 'dir') {
     $scope.loadFile.filepath = node.filepath;
   } else {
     var index = node.filepath.lastIndexOf('/')+1;
     var filepath = node.filepath.substring(0,index);
     var filename = node.filepath.substring(index,node.filepath.length);
     $scope.loadFile.filepath = filepath;
     $scope.loadFile.filename = filename;
   }
 };
 $scope.treeOptions = {
   multiSelection: false,
   isLeaf: function(node) {
     return node.type !== 'dir';
   },
   injectClasses: {
     iExpanded: "filetree-icon fa fa-folder-open",
     iCollapsed: "filetree-icon fa fa-folder",
     iLeaf: "filetree-icon fa fa-file",
   }
 };

 $scope.submit = function () {

   $scope.loadFile.filepath = $scope.loadFile.filepath+$scope.loadFile.filename;
   $modalInstance.close($scope.loadFile);
   $http({
     url: "/slurm/a/jobs",
     method: "POST",
     params: {_xsrf: getCookie('_xsrf')},
     data:{'content': $scope.loadFile.filepath}
   });
 };

 $scope.cancel = function () {
   $modalInstance.dismiss('cancel');
 };
})

.controller('JobListCtrl', ['$scope','$modal','AjaxCallService', function ($scope,$modal,AjaxCallService) {

    $scope.rowCollection = [];
    $scope.displayCollection = [];

    $scope.getJobList = function () {
      var promise = AjaxCallService.getJobList();
      promise.then(function(data){
        $scope.rowCollection = data;
        $scope.displayCollection = [].concat($scope.rowCollection);
      });
    };

    $scope.getDetail = function (row) {
      var detailModal = $modal.open({
        templateUrl: '/static/slurm/templates/modals/detail_modal.html',
        controller:'DetailModalCtrl',
	resolve: {
          row: function(){ return row; }
        }
      });
    };

    $scope.getters = {
      State: function(value){
         var ordered_states = ["PENDING","RUNNING","SUSPENDED","CANCELLED","COMPLETING",
                               "COMPLETED","CONFIGURING","FAILED","TIMEOUT","PREEMPTED",
                               "NODE_FAIL","SPECIAL_EXIT" ];
         var s = value.State;
         return ordered_states.indexOf(s);
        }
    }

    $scope.getJobList();

}])
.controller('DetailModalCtrl', function($scope,$modalInstance,row){
  $scope.row = row;
});

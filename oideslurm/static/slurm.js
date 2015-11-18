'use strict';
angular.module('oide.slurm', ['ui.bootstrap','schemaForm','ui.ace','smart-table', 'ui.router'])

.run(["$templateCache", function($templateCache) {
  $templateCache.put('/static/slurm/templates/custom_elements/custom_input.html','<div class=\"form-group schema-form-{{form.type}} {{form.htmlClass}}\" ng-class=\"{\'has-error\': form.disableErrorState !== true && hasError(), \'has-success\': form.disableSuccessState !== true && hasSuccess(), \'has-feedback\': form.feedback !== false }\"> <label class=\"control-label {{form.labelHtmlClass}}\" ng-class=\"{\'sr-only\': !showTitle()}\" for=\"{{form.key.slice(-1)[0]}}\">{{form.title}}</label><div class=\"input-group\"> <input ng-show=\"form.key\" type=\"{{form.type}}\" step=\"any\" sf-changed=\"form\" placeholder=\"{{form.placeholder}}\" class=\"form-control {{form.fieldHtmlClass}}\" id=\"{{form.key.slice(-1)[0]}}\" ng-model-options=\"form.ngModelOptions\" sf-field-model ng-disabled=\"form.readonly\" schema-validate=\"form\" name=\"{{form.key.slice(-1)[0]}}\" aria-describedby=\"{{form.key.slice(-1)[0] + \'Status\'}}\"> <span ng-if=\"hasError() || hasSuccess()\" id=\"{{form.key.slice(-1)[0] + \'Status\'}}\" class=\"sr-only\">{{ hasSuccess() ? \'(success)\' : \'(error)\' }}</span> <span class=\"input-group-btn\"> <button class=\"btn btn-default\" type=\"button\" popover=\"{{form.popover}}\" popover-placement=\"left\"> <i class=\"fa fa-question\"></i> </button> <button class=\"btn btn-default\" type=\"button\" ng-click=\"form.delete(form.key)\" ng-disabled=\"form.disabled\"> <i class=\"fa fa-times\"></i> </button> </span></div></div>');
  $templateCache.put('/static/slurm/templates/custom_elements/custom_checkbox.html','<div class=\"checkbox schema-form-checkbox {{form.htmlClass}}\"> <label class=\"{{form.labelHtmlClass}}\"> <div class=\"input-group\"> <input type=\"checkbox\" sf-changed=\"form\" ng-disabled=\"form.readonly\" sf-field-model ng-model-options=\"form.ngModelOptions\" schema-validate=\"form\" class=\"{{form.fieldHtmlClass}}\" name=\"{{form.key.slice(-1)[0]}}\"> <span ng-bind-html=\"form.title\"></span> <span class=\"input-group-btn\"> <button class=\"btn btn-default\" type=\"button\" popover=\"{{form.popover}}\" popover-placement=\"left\"> <i class=\"fa fa-question\"></i> </button> <button class=\"btn btn-default\" type=\"button\" ng-click=\"form.delete(form.key)\" ng-disabled=\"form.disabled\"> <i class=\"fa fa-times\"></i> </button> </span> </div> </label> </div>');

  }])

.config(['$stateProvider','$urlRouterProvider', 'schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfBuilderProvider','sfPathProvider',
 function($stateProvider, $urlRouterProvider, schemaFormProvider,  schemaFormDecoratorsProvider, sfBuilderProvider, sfPathProvider) {
  // $routeProvider.when('/slurm', {
  //   templateUrl: '/static/slurm/slurm.html',
  //   controller: 'SbatchCtrl'
  // });

    $stateProvider.state('slurm', {
      'url': '/slurm',
      'views': {
        '': {
          templateUrl: '/static/slurm/slurm.html'
        },
        'schedule@slurm': {
          templateUrl: '/static/slurm/templates/schedule.html'
        },
        'jobstatus@slurm': {
          templateUrl: '/static/slurm/templates/job_status.html'
        },
        'directives@slurm': {
          templateUrl: '/static/slurm/templates/directives.html',
          controller: 'DirectivesCtrl'
        },
        'sbatch@slurm': {
          templateUrl: '/static/slurm/templates/sbatch.html',
          controller: 'SbatchCtrl',
          resolve: {
            config: function(FormService) {
              return FormService.getFormSchema();
            }
          }
        },
        'sbatchscript@slurm': {
          templateUrl: '/static/slurm/templates/sbatchscript.html',
          controller: 'ScriptCtrl'
        }
      }
    });

  schemaFormDecoratorsProvider.defineAddOn(
    'bootstrapDecorator',         // Name of the decorator you want to add to.
    'input',                    // Form type that should render this add-on
    '/static/slurm/templates/custom_elements/custom_input.html',    // Template name in $templateCache
    sfBuilderProvider.stdBuilders // List of builder functions to apply.
  );

  schemaFormDecoratorsProvider.defineAddOn(
    'bootstrapDecorator',         // Name of the decorator you want to add to.
    'checkbox',                    // Form type that should render this add-on
    '/static/slurm/templates/custom_elements/custom_checkbox.html',    // Template name in $templateCache
    sfBuilderProvider.stdBuilders // List of builder functions to apply.
  );

  schemaFormDecoratorsProvider.defineAddOn(
    'bootstrapDecorator',         // Name of the decorator you want to add to.
    'number',                    // Form type that should render this add-on
    '/static/slurm/templates/custom_elements/custom_input.html',    // Template name in $templateCache
    sfBuilderProvider.stdBuilders // List of builder functions to apply.
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
    'checkpoint-dir':false,
    'cpu-per-task':false,
    workdir:false,
    error:false,
    export:false,
    'export-file':false,
    nodefile:false,
    'get-user-env':false,
    immediate:false,
    input:false,
    'job-name':false,
    jobid:false,
    'no-kill':false,
    licenses:false,
    'mail-type':false,
    'mail-user':false,
    mem:false,
    'mem-per-cpu':false,
    nodes:false,
    'no-requeue':false,
    output:false,
    requeue:false,
    time:false
  };
  formFieldsObj.formModel = {check:check};
  formFieldsObj.qosSchema = {};
  formFieldsObj.qosSelected = undefined;
  formFieldsObj.invalid = true;

  var getFormSchema = function () {
      return $http
        .get('/slurm/a/config')
        .success(function (data, status, headers, config) {
          formFieldsObj.schemas = data.formSchema;
          formFieldsObj.qosOptions = Object.keys(data.formSchema);
          formFieldsObj.qosSelected = formFieldsObj.qosOptions[0];
          formFieldsObj.qosSchema = formFieldsObj.schemas[formFieldsObj.qosSelected];
        });
    };

  return {
    formFieldsObj:formFieldsObj,
    getFormSchema:getFormSchema,
    changeQos: function (newQos) {
      formFieldsObj.qosSchema = formFieldsObj.schemas[newQos];
      formFieldsObj.qosSelected = newQos;
    }
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

.factory('ModalService',['$modal','FormService',function($modal,FormService){
   var timeLimits = {
    "crc-himem": 14*24,
    "crc-seria": 14*24,
    "crc-gpu"  : 4,
    "janus"    : 24,
    "ipcc"     : 4
  };

  var nodeLimits = {
    "crc-himem": 1,
    "crc-seria": 11,
    "crc-gpu"  : 2,
    "janus"    : 1037,
    "ipcc"     : 4

  };
  
  var serviceUnitEstimate = function(){
    var seconds = "(:[0-5][0-9])";
    var minutes = "([0-5][0-9])";
    var hours   = "(2[0-3]|[01][0-9])";
    var days    = "([1-9]|[1-9]+[0-9])"

    var defaultTimeLimit = timeLimits["janus"];
    var defaultNodeLimit = nodeLimits["janus"];
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

  return {
    loadScript: function(){
    var loadScriptModal = $modal.open({
      templateUrl: '/static/slurm/templates/modals/load_script_modal.html',
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      controller:'LoadScriptCtrl'
    });
    },
    saveScript: function(){
    var saveScriptModal = $modal.open({
      templateUrl: '/static/slurm/templates/modals/save_script_modal.html',
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      controller:'SaveScriptCtrl',
    });
    },
    estimate: function (){
    var estimateModal = $modal.open({
       templateUrl: '/static/slurm/templates/modals/estimateModal.html',
       controller: 'estimateCtrl',
       resolve:{
         serviceUnit: function (){
           return serviceUnitEstimate();
         }
       }
    });
    },
    SaveAndSubmit: function () {
    var submittModal = $modal.open({
      templateUrl: '/static/slurm/templates/modals/submit_modal.html',
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      controller:'SaveAndSubmitScriptCtrl',
    });
  },
  ShowResult: function (result) {
    var submittModal = $modal.open({
      templateUrl: '/static/slurm/templates/modals/result_modal.html',
      controller:'ShowResultCtrl',
      resolve:{
        submission_result: function(){
	   return result;
	}
      }
    });
  }

};
}])

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
.controller('SbatchCtrl', ['$scope','FormService','$log','config',function($scope,FormService,$log,config) {
  $scope.formModel = FormService.formFieldsObj.formModel;
  $scope.qosOptions = FormService.formFieldsObj.qosOptions;
  $scope.qosSelected = FormService.formFieldsObj.qosSelected;
  $scope.schema = FormService.formFieldsObj.qosSchema;

  $scope.formModel["qos"] = $scope.qosSelected;

  $scope.changeQos = function() {
    console.log("Changed qos!");
    FormService.changeQos($scope.qosSelected);
    $scope.schema = FormService.formFieldsObj.qosSchema;
    $scope.form = angular.copy($scope.defaultForm);

    $scope.defaultUpdate($scope);
    $scope.formModel["qos"] = $scope.qosSelected;
    $scope.$broadcast("schemaFormValidate");
    $scope.$broadcast("schemaFormRedraw");
  };

  // updating default form fields specific to a qos config
  $scope.defaultUpdate = function (scope){
    var required = scope.schema.required;
    if (required !== undefined){
      required.forEach(function(e,i,array){
        scope.formModel.check[e] = true;
        scope.form.forEach(function(e2,i2,array){
          if (e2.key === e) {               // if the key is in required
            array[i2].disabled = true;  // disable the delete function
          }
        });
      });
    }
  };

  $scope.delete =function (key){$scope.formModel.check[key] = false;};
  $scope.defaultForm = [
      {
        "key": "array",
        "type":"input",
        "condition": "model.check.array",
        "popover":'Submit a job array, multiple jobs to be executed with identical parameters. The indexes specification identifies what array index values should be used. Multiple values may be specified using a comma separated list and/or a range of values with a "-" separator. For example, "--array=0-15" or "--array=0,6,16-32". A step function can also be specified with a suffix containing a colon and number. For example, "--array=0-15:4" is equivalent to "--array=0,4,8,12". A maximum number of simultaneously running tasks from the job array may be specified using a "%" separator. For example "--array=0-15%4" will limit the number of simultaneously running tasks from this job array to 4. The minimum index value is 0. the maximum value is one less than the configuration parameter MaxArraySize.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": "account",
        "type":"input",
        "condition": "model.check.account",
        "popover":"Charge resources used by this job to specified account. The account is an arbitrary string. The account name may be changed after job submission using the scontrol command.",
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'begin',
        "type":"input",
        "condition": "model.check.begin",
        "popover":"Submit the batch script to the SLURM controller immediately, like normal, but tell the controller to defer the allocation of the job until the specified time. Time may be of the form HH:MM:SS to run a job at a specific time of day (seconds are optional). (If that time is already past, the next day is assumed.) You may also specify midnight, noon, fika (3 PM) or teatime (4 PM) and you can have a time-of-day suffixed with AM or PM for running in the morning or the evening. You can also say what day the job will be run, by specifying a date of the form MMDDYY or MM/DD/YY YYYY-MM-DD. Combine date and time using the following format YYYY-MM-DD[THH:MM[:SS]]. You can also give times like now + count time-units, where the time-units can be seconds (default), minutes, hours, days, or weeks and you can tell SLURM to run the job today with the keyword today and to run the job tomorrow with the keyword tomorrow. The value may be changed after job submission using the scontrol command. For example: --begin=16:00 , --begin=now+1hour, --begin=now+60 (seconds by default), --begin=2016-01-20T12:34:00, Notes on date/time specifications: - Although the \'seconds\' field of the HH:MM:SS time specification is allowed by the code, note that the poll time of the SLURM scheduler is not precise enough to guarantee dispatch of the job on the exact second. The job will be eligible to start on the next poll following the specified time. The exact poll interval depends on the SLURM scheduler (e.g., 60 seconds with the default sched/builtin).- If no time (HH:MM:SS) is specified, the default is (00:00:00). - If a date is specified without a year (e.g., MM/DD) then the current year is assumed, unless the combination of MM/DD and HH:MM:SS has already passed for that year, in which case the next year is used.",
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },

      {
        "key": 'checkpoint',
        "type":"input",
        "condition": "model.check['checkpoint']",
        "popover":'Specifies the interval between creating checkpoints of the job step. By default, the job step will have no checkpoints created. Acceptable time formats include "minutes", "minutes:seconds", "hours:minutes:seconds", "days-hours", "days-hours:minutes" and "days-hours:minutes:seconds".',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },

      {
        "key": 'checkpoint-dir',
        "type":"input",
        "condition": "model.check['checkpoint-dir']",
        "popover":'Specifies the directory into which the job or job step\'s checkpoint should be written (used by the checkpoint/blcrm and checkpoint/xlch plugins only). The default value is the current working directory. Checkpoint files will be of the form "<job_id>.ckpt" for jobs and "<job_id>.<step_id>.ckpt" for job steps.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },

      {
        "key": 'cpu-per-task',
        "type":"number",
        "condition": "model.check['cpu-per-task']",
        "popover":'Advise the SLURM controller that ensuing job steps will require ncpus number of processors per task. Without this option, the controller will just try to allocate one processor per task. For instance, consider an application that has 4 tasks, each requiring 3 processors. If our cluster is comprised of quad-processors nodes and we simply ask for 12 processors, the controller might give us only 3 nodes. However, by using the --cpus-per-task=3 options, the controller knows that each task requires 3 processors on the same node, and the controller will grant an allocation of 4 nodes, one for each of the 4 tasks.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'workdir',
        "type":"input",
        "condition": "model.check['workdir']",
        "popover":'Set the working directory of the batch script to directory before it is executed. The path can be specified as full path or relative path to the directory where the command is executed.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },

      {
        "key": 'error',
        "type":"input",
        "condition": "model.check['error']",
        "popover":'Instruct SLURM to connect the batch script\'s standard error directly to the file name specified in the "filename pattern". By default both standard output and standard error are directed to the same file. For job arrays, the default file name is "slurm-%A_%a.out", "%A" is replaced by the job ID and "%a" with the array index. For other jobs, the default file name is "slurm-%j.out", where the "%j" is replaced by the job ID. See the --input option for filename specification options.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'export',
        "type":"input",
        "condition": "model.check['export']",
        "popover":'Identify which environment variables are propagated to the batch job. Multiple environment variable names should be comma separated. Environment variable names may be specified to propagate the current value of those variables (e.g. "--export=EDITOR") or specific values for the variables may be exported (e.g.. "--export=EDITOR=/bin/vi") in addition to the environment variables that would otherwise be set. This option particularly important for jobs that are submitted on one cluster and execute on a different cluster (e.g. with different paths). By default all environment variables are propagated. If the argument is NONE or specific environment variable names, then the --get-user-env option will implicitly be set to load other environment variables based upon the user\'s configuration on the cluster which executes the job.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },

      {
        "key": 'export-file',
        "type":"input",
        "condition": "model.check['export-file']",
        "popover":'If a number between 3 and OPEN_MAX is specified as the argument to this option, a readable file descriptor will be assumed (STDIN and STDOUT are not supported as valid arguments). Otherwise a filename is assumed. Export environment variables defined in <filename> or read from <fd> to the job\'s execution environment. The content is one or more environment variable definitions of the form NAME=value, each separated by a null character. This allows the use of special characters in environment definitions.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },

      {
        "key": 'nodefile',
        "type":"input",
        "condition": "model.check['nodefile']",
        "popover":'Much like --nodelist, but the list is contained in a file of name node file. The node names of the list may also span multiple lines in the file. Duplicate node names in the file will be ignored. The order of the node names in the list is not important; the node names will be sorted by SLURM.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'get-user-env',
        "type":"input",
        "condition": "model.check['get-user-env']",
        "popover":'This option will tell sbatch to retrieve the login environment variables for the user specified in the --uid option. The environment variables are retrieved by running something of this sort "su - <username> -c /usr/bin/env" and parsing the output. Be aware that any environment variables already set in sbatch\'s environment will take precedence over any environment variables in the user\'s login environment. Clear any environment variables before calling sbatch that you do not want propagated to the spawned program. The optional timeout value is in seconds. Default value is 8 seconds. The optional mode value control the "su" options. With a mode value of "S", "su" is executed without the "-" option. With a mode value of "L", "su" is executed with the "-" option, replicating the login environment. If mode not specified, the mode established at SLURM build time is used. Example of use include "--get-user-env"(in this case, write "no option" to the input field), "--get-user-env=10" "--get-user-env=10L", and "--get-user-env=S". This option was originally created for use by Moab.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },

      {
        "key": 'immediate',
        "type":"checkbox",
        "condition": "model.check.immediate",
        "popover":'Specifies the directory into which the job or job step\'s checkpoint should be written (used by the checkpoint/blcrm and checkpoint/xlch plugins only). The default value is the current working directory. Checkpoint files will be of the form "<job_id>.ckpt" for jobs and "<job_id>.<step_id>.ckpt" for job steps.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'input',
        "type":"input",
        "condition": "model.check['input']",
        "popover":'Instruct SLURM to connect the batch script\'s standard input directly to the file name specified in the "filename pattern". By default, "/dev/null" is open on the batch script\'s standard input and both standard output and standard error are directed to a file of the name "slurm-%j.out", where the "%j" is replaced with the job allocation number, as described below. The filename pattern may contain one or more replacement symbols, which are a percent sign "%" followed by a letter (e.g. %j). Supported replacement symbols are: %A:Job array\'s master job allocation number. %a:Job array ID (index) number. %j:Job allocation number.%N:Node name. Only one file is created, so %N will be replaced by the name of the first node in the job, which is the one that runs the script.%u:User name.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'job-name',
        "type":"input",
        "condition": "model.check['job-name']",
        "popover":'Specify a name for the job allocation. The specified name will appear along with the job id number when querying running jobs on the system. The default is the name of the batch script, or just "sbatch" if the script is read on sbatch\'s standard input.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'jobid',
        "type":"input", // this should be a number
        "condition": "model.check['jobid']",
        "popover":'Allocate resources as the specified job id. NOTE: Only valid for user root.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'no-kill',
        "type":"checkbox",
        "condition": "model.check['no-kill']",
        "popover":'Do not automatically terminate a job if one of the nodes it has been allocated fails. The user will assume the responsibilities for fault-tolerance should a node fail. When there is a node failure, any active job steps (usually MPI jobs) on that node will almost certainly suffer a fatal error, but with --no-kill, the job allocation will not be revoked so the user may launch new job steps on the remaining nodes in their allocation. By default SLURM terminates the entire job allocation if any node fails in its range of allocated nodes.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'licenses',
        "type":"input",
        "condition": "model.check['licenses']",
        "popover":'Specification of licenses (or other resources available on all nodes of the cluster) which must be allocated to this job. License names can be followed by a colon and count (the default count is one). Multiple license names should be comma separated (e.g. "--licenses=foo:4,bar"). To submit jobs using remote licenses, those served by the slurmdbd, specify the name of the server providing the licenses. For example "--license=nastran@slurmdb:12".',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'mail-type',
        "type":"input",
        "condition": "model.check['mail-type']",
        "popover":'Notify user by email when certain event types occur. Valid type values are BEGIN, END, FAIL, REQUEUE, ALL (equivalent to BEGIN, END, FAIL and REQUEUE), TIME_LIMIT, TIME_LIMIT_90 (reached 90 percent of time limit), TIME_LIMIT_80 (reached 80 percent of time limit), and TIME_LIMIT_50 (reached 50 percent of time limit). Multiple type values may be specified in a comma separated list. The user to be notified is indicated with --mail-user.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'mail-user',
        "type":"input",
        "condition": "model.check['mail-user']",
        "popover":'User to receive email notification of state changes as defined by --mail-type. The default value is the submitting user.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'mem',
        "type":"number",
        "condition": "model.check['mem']",
        "popover":'Specify the real memory required per node in MegaBytes. Default value is DefMemPerNode and the maximum value is MaxMemPerNode. If configured, both parameters can be seen using the scontrol show config command. This parameter would generally be used if whole nodes are allocated to jobs (SelectType=select/linear). Also see --mem-per-cpu. --mem and --mem-per-cpu are mutually exclusive. NOTE: A memory size specification is treated as a special case and grants the job access to all of the memory on each node. NOTE: Enforcement of memory limits currently relies upon the task/cgroup plugin or enabling of accounting, which samples memory use on a periodic basis (data need not be stored, just collected). In both cases memory use is based upon the job\'s Resident Set Size (RSS). A task may exceed the memory limit until the next periodic accounting sample.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'mem-per-cpu',
        "type":"number",
        "condition": "model.check['mem-per-cpu']",
        "popover":'Mimimum memory required per allocated CPU in MegaBytes. Default value is DefMemPerCPU and the maximum value is MaxMemPerCPU (see exception below). If configured, both parameters can be seen using the scontrol show config command. Note that if the job\'s --mem-per-cpu value exceeds the configured MaxMemPerCPU, then the user\'s limit will be treated as a memory limit per task; --mem-per-cpu will be reduced to a value no larger than MaxMemPerCPU; --cpus-per-task will be set and the value of --cpus-per-task multiplied by the new --mem-per-cpu value will equal the original --mem-per-cpu value specified by the user. This parameter would generally be used if individual processors are allocated to jobs (SelectType=select/cons_res). If resources are allocated by the core, socket or whole nodes; the number of CPUs allocated to a job may be higher than the task count and the value of --mem-per-cpu should be adjusted accordingly. Also see --mem. --mem and --mem-per-cpu are mutually exclusive.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },

      {
        "key": 'nodes',
        "type":"number",
        "condition": "model.check.nodes",
        "popover":'Request that a minimum of minnodes nodes be allocated to this job. A maximum node count may also be specified with maxnodes. If only one number is specified, this is used as both the minimum and maximum node count. The partition\'s node limits supersede those of the job. If a job\'s node limits are outside of the range permitted for its associated partition, the job will be left in a PENDING state. This permits possible execution at a later time, when the partition limit is changed. If a job node limit exceeds the number of nodes configured in the partition, the job will be rejected. Note that the environment variable SLURM_NNODES will be set to the count of nodes actually allocated to the job. See the ENVIRONMENT VARIABLES section for more information. If -N is not specified, the default behavior is to allocate enough nodes to satisfy the requirements of the -n and -c options. The job will be allocated as many nodes as possible within the range specified and without delaying the initiation of the job. The node count specification may include a numeric value followed by a suffix of "k" (multiplies numeric value by 1,024) or "m" (multiplies numeric value by 1,048,576).',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'no-requeue',
        "type":"checkbox",
        "condition": "model.check['no-requeue']",
        "popover":'Specifies that the batch job should not be requeued after node failure. Setting this option will prevent system administrators from being able to restart the job (for example, after a scheduled downtime). When a job is requeued, the batch script is initiated from its beginning. Also see the --requeue option. The JobRequeue configuration parameter controls the default behavior on the cluster.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'output',
        "type":"input",
        "condition": "model.check['output']",
        "popover":'Instruct SLURM to connect the batch script\'s standard output directly to the file name specified in the "filename pattern". By default both standard output and standard error are directed to the same file. For job arrays, the default file name is "slurm-%A_%a.out", "%A" is replaced by the job ID and "%a" with the array index. For other jobs, the default file name is "slurm-%j.out", where the "%j" is replaced by the job ID. See the --input option for filename specification options.',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      },
      {
        "key": 'time',
        "type":"input",
        "condition": "model.check['time']",
        "popover":'Set a limit on the total run time of the job allocation. If the requested time limit exceeds the partition\'s time limit, the job will be left in a PENDING state (possibly indefinitely). The default time limit is the partition\'s default time limit. When the time limit is reached, each task in each job step is sent SIGTERM followed by SIGKILL. The interval between signals is specified by the SLURM configuration parameter KillWait. A time limit of zero requests that no time limit be imposed. Acceptable time formats are "DD-HH:MM:SS" or "HH:MM:SS".',
        "delete": $scope.delete,
        "disabled": false,
        "required": true
      }

  ];
  // below for the reason why using angular.copy
  // https://github.com/Textalk/angular-schema-form/issues/428
  $scope.form = angular.copy($scope.defaultForm);

  // $scope.options only includes form fileds defined in $scope.form
  $scope.options = $scope.form.map(function(e){return e.key;});

  $scope.defaultUpdate($scope);


  // $scope.$watchCollection watches $scope.form and if a new element is pushed into the array
  // or an existing one is deleted, it broadcasts "schemaFormRedraw" to schemaForm and renders
  // the form fileds .
  $scope.$watchCollection("form",function(newVal,oldVal){
    $scope.options = newVal.map(function(e){return e.key;});
    console.log("New field added.");
    $scope.$broadcast("schemaFormRedraw");
    $scope.$broadcast("schemaFormValidate");
  });

  // This watches the value of selected qos
  $scope.$watch(
    function(){ return FormService.formFieldsObj.qosSelected;}
    ,function(newVal, oldVal){
      console.log(newVal,oldVal);
      $scope.qosSelected = newVal;
      $scope.changeQos();
  });

  // This watches the validity of the form
  $scope.$watch(
    function(){return $scope.slurmForm.$invalid;},
    function(newVal,oldVal){
      FormService.formFieldsObj.invalid = newVal;
    });

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
      if ((typeof newVal[k] !== 'undefined') && (newVal[k] !== '') && (k !== 'check') && (newVal[k] !== false)) {
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


.controller('controlBar',['$scope','$modal','FormService','ScriptService','ModalService','$log',function($scope,$modal,FormService,ScriptService,ModalService,$log){

  // For disabling the submit button
  $scope.formFieldsObj = FormService.formFieldsObj;

  $scope.loadScript = ModalService.loadScript; 
  $scope.saveScript = ModalService.saveScript;
  $scope.estimate = ModalService.estimate;
  $scope.SaveAndSubmit = ModalService.SaveAndSubmit;

}])

.controller('estimateCtrl', function($scope,$modalInstance,serviceUnit){
  $scope.serviceUnit = serviceUnit;
})

.controller('LoadScriptCtrl',function($scope,$modalInstance,FormService,ScriptService,$http,$log){
  $scope.schema = FormService.formFieldsObj.qosSchema;
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
             //command = command.replace(/-([a-z])/g,function(whole,s1){return s1.toUpperCase();});
             if (command === "qos"){
               $scope.formModel[command] = args;
               FormService.formFieldsObj.qosSelected = args;
               console.log(FormService.formFieldsObj.qosSelected,args);
             }
             else {
               $scope.formModel.check[command] = true;
               if($scope.schema.properties[command].type === 'string'){
                 $scope.formModel[command] = args;
               }
               else{
                 $scope.formModel[command] = Number(args);
               }
             }

           }
           // if parameter specification uses whitespaces (e.g. --nodes 10)
           else if (/--[a-z/-]+\s+\S+/.test(script[i])){
             var command = script[i].split('--')[1].split(" ")[0];
             var x = script[i].split('--')[1]  // this should look like "nodes  10"
             var args = x.split(" ")[x.split(' ').length-1];
             //camelize the command
             //command = command.replace(/-([a-z])/g,function(whole,s1){return s1.toUpperCase();});
             if (command === "qos"){
               $scope.formModel[command] = args;
               FormService.formFieldsObj.qosSelected = args;
             }
             else {
               $scope.formModel.check[command] = true;
               if($scope.schema.properties[command].type === 'string'){
                 $scope.formModel[command] = args;
               }
               else{
                 $scope.formModel[command] = Number(args);
               }
             }
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
      var content = '#!/bin/'+shellType +'\n'+ $scope.SbatchDirectives.script + $scope.SbatchScript.script.replace(/#!\/bin\/(sh|ksh|bash|zsh|csh|tcsh)\n/,"");
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
.controller('SaveAndSubmitScriptCtrl',function($scope,$modalInstance,FormService,ScriptService,ModalService,$http,$log){
  
  $scope.ShowResult = ModalService.ShowResult;

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

 $scope.saveAndSubmit = function () {
      var result = {status: 'Test', description:'This should not be shown.'};
      var matched = $scope.SbatchScript.script.match(/#!\/bin\/(sh|ksh|bash|zsh|csh|tcsh)\n/);
      // if matched is not null (or undefined)
      var shellType = 'bash';
      if (matched) shellType = matched[1];
      var content = '#!/bin/'+shellType +'\n'+ $scope.SbatchDirectives.script + $scope.SbatchScript.script.replace(/#!\/bin\/(sh|ksh|bash|zsh|csh|tcsh)\n/,"");
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

              // submit a job with a specified script
              $modalInstance.close($scope.newFile);
              $http({
                url: "/slurm/a/jobs",
                method: "POST",
                params: {_xsrf: getCookie('_xsrf')},
                data:{'content': file_abs_path}
              }).success(function(data, status, header, config){
			$log.debug("Successful Submission");
			result.status = "Success";
			result.description = "Successful Submission";
			$scope.ShowResult(result); 
	      }).error(function(data, status, header, config){
			$log.error("Submission Failed", data ,status, header, config);
			result.status = "Error";
			result.description = data;
			$scope.ShowResult(result);
	      });

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

                // submit a job with a specified script
                $modalInstance.close($scope.newFile);
                $http({
                  url: "/slurm/a/jobs",
                  method: "POST",
                  params: {_xsrf: getCookie('_xsrf')},
                  data:{'content': file_abs_path}
                }).success(function(data, status, header, config){
			$log.debug("Successful Submission");
			result.status = "Success";
			result.description = "Successful Submission";
			$scope.ShowResult(result);
		}).error(function(data, status, header, config){
			$log.error("Submission Failed", data ,status, header, config);
			result.status = "Error";
			result.description = data;
			$scope.ShowResult(result);
		});
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
.controller('ShowResultCtrl',function($scope,$modalInstance,submission_result){
   $scope.result = submission_result;
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

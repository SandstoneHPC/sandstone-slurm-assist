'use strict';

angular.module('oide.slurm', ['ngRoute','ui.bootstrap','formly','formlyBootstrap','ui.ace'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/slurm', {
    templateUrl: '/static/slurm/slurm.html',
    controller: 'SbatchCtrl'//,
    //resolve: {
    //  formConfig: function (FormService) {
    //    return FormService.getFormConfig();
    //  }
    //}
  });

}])
.run(function(formlyConfig){

  // Set custom wrapper templates
  formlyConfig.setWrapper({
    name:'customLabel',
    templateUrl:'/static/slurm/templates/custom_label_wrapper.html'
  })

  // Set custom templates
  formlyConfig.setType([
    {
      name:'input',
      templateUrl:'/static/slurm/templates/custom_input.html',
      wrapper:["customLabel", "bootstrapHasError"],
      overwriteOk: true
    },
    {
      name:'checkbox',
      templateUrl:'/static/slurm/templates/custom_checkbox.html',
      wrapper:["customLabel", "bootstrapHasError"],
      overwriteOk: true
    }
  ]);
})
.factory('FormService', ['$http', function ($http) {
  var formConfig = {};

  // check is for checking if a specific field is selected by a user
  // Default fields have true at the beginning
  var check = {
    array:true,
    account:true,
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
    jobId:false,
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
  var formModel = {check:check};
  var formFields = [{
      key: 'array',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.array;
      },
      defaultValue: "1,2,3-4:5%6",
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--array',
          args: '=<indices>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.array = false;
              delete scope.$parent.model.array;
            }
          },
          popover:'Submit a job array, multiple jobs to be executed with identical parameters. The indexes specification identifies what array index values should be used. Multiple values may be specified using a comma separated list and/or a range of values with a "-" separator. For example, "--array=0-15" or "--array=0,6,16-32". A step function can also be specified with a suffix containing a colon and number. For example, "--array=0-15:4" is equivalent to "--array=0,4,8,12". A maximum number of simultaneously running tasks from the job array may be specified using a "%" separator. For example "--array=0-15%4" will limit the number of simultaneously running tasks from this job array to 4. The minimum index value is 0. the maximum value is one less than the configuration parameter MaxArraySize.',
          required: true
      },
      validators: {
          arrayValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  // example; 23,34-46,54
                  var flag = true;
                  var indices = $viewValue.split(",");
                  var reg = /^\d+$|^(\d+-\d+)(:\d+)?$/;
                  var last_reg = /^\d+(%\d+)?$|^(\d+-\d+)(:\d+)?(%\d+)?$/; // used for validating the last value  because of '%' separetor

                  for (var i = 0; i < indices.length - 1; i++) {
                      flag = reg.test(indices[i]);
                      if (!flag) return false;
                  }

                  if (!last_reg.test(indices[indices.length - 1])) return false;
                  else return true;
              }
          }
      }
  }, {
      key: 'account',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.account;
      },
      defaultValue: "account",
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--account',
          args: '=<account>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.account = false;
              delete scope.$parent.model.account;
            }
          },
          popover:'Charge resources used by this job to specified account. The account is an arbitrary string. The account name may be changed after job submission using the scontrol command.',
          required: true
      }
  }, {
      key: 'begin',
      type: 'input',
      hideExpression: function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.begin;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--begin',
          args: '=<time>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.begin = false;
              delete scope.$parent.model.begin;
            }
          },
          popover:'Submit the batch script to the SLURM controller immediately, like normal, but tell the controller to defer the allocation of the job until the specified time. Time may be of the form HH:MM:SS to run a job at a specific time of day (seconds are optional). (If that time is already past, the next day is assumed.) You may also specify midnight, noon, fika (3 PM) or teatime (4 PM) and you can have a time-of-day suffixed with AM or PM for running in the morning or the evening. You can also say what day the job will be run, by specifying a date of the form MMDDYY or MM/DD/YY YYYY-MM-DD. Combine date and time using the following format YYYY-MM-DD[THH:MM[:SS]]. You can also give times like now + count time-units, where the time-units can be seconds (default), minutes, hours, days, or weeks and you can tell SLURM to run the job today with the keyword today and to run the job tomorrow with the keyword tomorrow. The value may be changed after job submission using the scontrol command. For example: --begin=16:00 , --begin=now+1hour, --begin=now+60 (seconds by default), --begin=2016-01-20T12:34:00, Notes on date/time specifications: - Although the \'seconds\' field of the HH:MM:SS time specification is allowed by the code, note that the poll time of the SLURM scheduler is not precise enough to guarantee dispatch of the job on the exact second. The job will be eligible to start on the next poll following the specified time. The exact poll interval depends on the SLURM scheduler (e.g., 60 seconds with the default sched/builtin).- If no time (HH:MM:SS) is specified, the default is (00:00:00). - If a date is specified without a year (e.g., MM/DD) then the current year is assumed, unless the combination of MM/DD and HH:MM:SS has already passed for that year, in which case the next year is used.',
          required: true
      },
      validators: {
          beginValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  var YY = "(1[5-9]|[2-9][0-9])"; // Year > 15
                  var MO = "(0[1-9]|1[0-2])"; // MO stands for MOnth
                  var DD = "([0-2][0-9]|3[01])"; // Day
                  var HH = "(2[0-3]|[01][0-9])"; // Hour
                  var MM = "[0-5][0-9]"; // Minute
                  var SS = "(:[0-5][0-9])?"; // note that since SS (Second) is optional, the literal contains ':' and '?'
                  var YYYY = "20" + YY; // Year > 2015

                  /* HH:MM[:SS] format*/
                  if (RegExp("^" + HH + ":" + MM + SS + "$").test($viewValue)) return true;

                  /* MO(Month)DDYY format*/
                  else if (RegExp("^" + MO + DD + YY + "$").test($viewValue)) return true;

                  /* MO/DD/YY format*/
                  else if (RegExp("^" + MM + "\/" + DD + "\/" + YY + "$").test($viewValue)) return true;

                  /* YYYY-MO-DD format */
                  else if (RegExp("^" + YYYY + "-" + MO + "-" + DD + "$").test($viewValue)) return true;

                  /* YYYY-MO-DD[THH:MM[:SS]] format (= date + time)*/
                  else if (RegExp("^" + YYYY + "-" + MO + "-" + DD + "T" + HH + ":" + MM + SS + "$").test($viewValue)) return true;

                  /* now+(some number)(time unit) format*/
                  else if (RegExp("^now\\+1(second|minute|hour|day|week)?$").test($viewValue)) return true;

                  /* now+(some number)(time unit) format, but plural*/
                  else if (RegExp("^now\\+([2-9]|[1-9]\\d+)(seconds|minutes|hours|days|weeks)?$").test($viewValue)) return true;

                  else return false;
              }
          }
      }
  }, {
      key: 'checkpoint',
      type: 'input',
      hideExpression: function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.checkpoint;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--checkpoint',
          args: '=<time>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.checkpoint = false;
              delete scope.$parent.model.checkpoint;
            }
          },
          popover:'Specifies the interval between creating checkpoints of the job step. By default, the job step will have no checkpoints created. Acceptable time formats include "minutes", "minutes:seconds", "hours:minutes:seconds", "days-hours", "days-hours:minutes" and "days-hours:minutes:seconds".',
          required: true
      },
      validators: {
          checkpointValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  var minutes = "([0-5][0-9])";
                  var seconds = "(:[0-5][0-9])";
                  var hours = "(2[0-3]|[01][0-9])";
                  var days = "(\\d{2}-)";

                  /* minutes or minutes:seconds */
                  if (RegExp("^" + minutes + seconds + "?" + "$").test($viewValue)) return true;
                  /* hours:minutes:seconds */
                  else if (RegExp("^" + hours + ":" + minutes + seconds + "$").test($viewValue)) return true;
                  /* days-hours:minutes?seconds? */
                  else if (RegExp("^" + days + hours + "(:" + minutes + ")?" + seconds + "?" + "$").test($viewValue)) return true;

                  else return false;
              }
          }
      }
  }, {
      key: 'checkpointDir',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.checkpointDir;
      },
      defaultValue: "./",
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--checkpointDir',
          args: '=<directory>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.checkpointDir = false;
              delete scope.$parent.model.checkpointDir;
            }
          },
          popover:'Specifies the directory into which the job or job step\'s checkpoint should be written (used by the checkpoint/blcrm and checkpoint/xlch plugins only). The default value is the current working directory. Checkpoint files will be of the form "<job_id>.ckpt" for jobs and "<job_id>.<step_id>.ckpt" for job steps.',
          required: true
      },
      validators: {
          checkpointDirValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return /^([.a-zA-Z0-9_-]*)\/(([a-zA-Z0-9_-]+\/?)*)$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'cpusPerTask',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.cpusPerTask;
      },
      defaultValue: "1",
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--cpusPerTask',
          args: '=<ncpus>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.cpusPerTask = false;
              delete scope.$parent.model.cpusPerTask;
            }
          },
          popover:'Advise the SLURM controller that ensuing job steps will require ncpus number of processors per task. Without this option, the controller will just try to allocate one processor per task. For instance, consider an application that has 4 tasks, each requiring 3 processors. If our cluster is comprised of quad-processors nodes and we simply ask for 12 processors, the controller might give us only 3 nodes. However, by using the --cpus-per-task=3 options, the controller knows that each task requires 3 processors on the same node, and the controller will grant an allocation of 4 nodes, one for each of the 4 tasks.',
          required: true
      },
      validators: {
          cpusPerTaskValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return /^\d+$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'workdir',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.workdir;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--workdir',
          args: '=<directory>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.workdir = false;
              delete scope.$parent.model.workdir;
            }
          },
          popover:'Set the working directory of the batch script to directory before it is executed. The path can be specified as full path or relative path to the directory where the command is executed.',
          required: true
      },
      validators: {
          workdirValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return /^([.a-zA-Z0-9_-]*)\/(([a-zA-Z0-9_-]+\/?)*)$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'error',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.error;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--error',
          args: '=<filename pattern>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.error = false;
              delete scope.$parent.model.error;
            }
          },
          popover:'Instruct SLURM to connect the batch script\'s standard error directly to the file name specified in the "filename pattern". By default both standard output and standard error are directed to the same file. For job arrays, the default file name is "slurm-%A_%a.out", "%A" is replaced by the job ID and "%a" with the array index. For other jobs, the default file name is "slurm-%j.out", where the "%j" is replaced by the job ID. See the --input option for filename specification options.',
          required: true
      },
      validators: {
          errorValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return /^([a-zA-Z0-9_-]|%[AajNu])+\.[a-zA-Z]+$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'export',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.export;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--export',
          args: '=<environment variables | ALL | NONE>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.export = false;
              delete scope.$parent.model.export;
            }
          },
          popover:'Identify which environment variables are propagated to the batch job. Multiple environment variable names should be comma separated. Environment variable names may be specified to propagate the current value of those variables (e.g. "--export=EDITOR") or specific values for the variables may be exported (e.g.. "--export=EDITOR=/bin/vi") in addition to the environment variables that would otherwise be set. This option particularly important for jobs that are submitted on one cluster and execute on a different cluster (e.g. with different paths). By default all environment variables are propagated. If the argument is NONE or specific environment variable names, then the --get-user-env option will implicitly be set to load other environment variables based upon the user\'s configuration on the cluster which executes the job.',
          required: true
      },
      validators: {
          exportValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  if (/^(|ALL|NONE)$/.test($viewValue)) return true;
                  /* below is for one env variable*/
                  /* below is for other env variables (notice the * before $)*/
                  else if (/^[A-Z]+=\/[a-z0-9]+(\/[a-z0-9]+)*(,[A-Z]+=\/[a-z0-9]+(\/[a-z0-9]+)*)*$/.test($viewValue)) return true;
              }
          }
      }
  }, {
      key: 'exportFile',
      type: 'input',
      hideExpression: function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.exportFile;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--exportFile',
          args: '=<filename | td>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.exportFile = false;
              delete scope.$parent.model.exportFile;
            }
          },
          popover:'If a number between 3 and OPEN_MAX is specified as the argument to this option, a readable file descriptor will be assumed (STDIN and STDOUT are not supported as valid arguments). Otherwise a filename is assumed. Export environment variables defined in <filename> or read from <fd> to the job\'s execution environment. The content is one or more environment variable definitions of the form NAME=value, each separated by a null character. This allows the use of special characters in environment definitions.',
          required: true
      },
      validators: {
          exportFileValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  /* when file descriptor (it's just an integer and is >= 3) is specified */
                  if (/^([3-9]|[1-9][0-9][0-9]*)$/.test($viewValue)) return true;

                  /* relative or absolute file path  */
                  else if (/^([.a-zA-Z0-9_-]*)\/(([a-zA-Z0-9_-]+\/?)*)[.a-zA-Z0-9_-]+$/.test($viewValue)) return true;

                  /* file name*/
                  else if (/^[.a-zA-Z0-9_-]+$/.test($viewValue)) return true;
              }
          }
      }
  }, {
      key: 'nodefile',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.nodefile;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--nodefile',
          args: '=<node file>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.nodefile = false;
              delete scope.$parent.model.nodefile;
            }
          },
          popover:'Much like --nodelist, but the list is contained in a file of name node file. The node names of the list may also span multiple lines in the file. Duplicate node names in the file will be ignored. The order of the node names in the list is not important; the node names will be sorted by SLURM.',
          required: true
      },
      validators: {
          nodefileValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  /* relative or absolute file path  */
                  if (/^([.a-zA-Z0-9_-]*)\/(([a-zA-Z0-9_-]+\/?)*)[.a-zA-Z0-9_-]+$/.test($viewValue)) return true;

                  /* file name*/
                  else if (/^[.a-zA-Z0-9_-]+$/.test($viewValue)) return true;
              }
          }
      }
  }, {
      key: 'getUserEnv',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.getUserEnv;
      },
      validation:{show: true},
      defaultValue:'no option',
      templateOptions: {
          type: 'text',
          label: '--getUserEnv',
          args: '[=timeout][mode]',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.getUserEnv = false;
              delete scope.$parent.model.getUserEnv;
            }
          },
          popover:'This option will tell sbatch to retrieve the login environment variables for the user specified in the --uid option. The environment variables are retrieved by running something of this sort "su - <username> -c /usr/bin/env" and parsing the output. Be aware that any environment variables already set in sbatch\'s environment will take precedence over any environment variables in the user\'s login environment. Clear any environment variables before calling sbatch that you do not want propagated to the spawned program. The optional timeout value is in seconds. Default value is 8 seconds. The optional mode value control the "su" options. With a mode value of "S", "su" is executed without the "-" option. With a mode value of "L", "su" is executed with the "-" option, replicating the login environment. If mode not specified, the mode established at SLURM build time is used. Example of use include "--get-user-env"(in this case, write "no option" to the input field), "--get-user-env=10" "--get-user-env=10L", and "--get-user-env=S". This option was originally created for use by Moab.',
          required: false
      },
      validators: {
          getUserEnvValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return /^(\d*[SL]?)$|^([nN]o[\s\-][oO]ptions?)$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'immediate',
      type: 'checkbox',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.immediate;
      },

      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--immediate',
          args: '',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.immediate = false;
              delete scope.$parent.model.immediate;
            }
          },
          popover:'The batch script will only be submitted to the controller if the resources necessary to grant its job allocation are immediately available. If the job allocation will have to wait in a queue of pending jobs, the batch script will not be submitted. NOTE: There is limited support for this option with batch jobs.',
          required: true
      }

  }, {
      key: 'input',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.input;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--input',
          args: '=<filename pattern>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.input = false;
              delete scope.$parent.model.input;
            }
          },
          popover:'Instruct SLURM to connect the batch script\'s standard input directly to the file name specified in the "filename pattern". By default, "/dev/null" is open on the batch script\'s standard input and both standard output and standard error are directed to a file of the name "slurm-%j.out", where the "%j" is replaced with the job allocation number, as described below. The filename pattern may contain one or more replacement symbols, which are a percent sign "%" followed by a letter (e.g. %j). Supported replacement symbols are: %A:Job array\'s master job allocation number. %a:Job array ID (index) number. %j:Job allocation number.%N:Node name. Only one file is created, so %N will be replaced by the name of the first node in the job, which is the one that runs the script.%u:User name.',
          required: true
      },
      validators: {
          inputValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return /^([a-zA-Z0-9_-]|%[AajNu])+\.[a-zA-Z]+$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'jobName',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.jobName;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--jobName',
          args: '=<jobname>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.jobName = false;
              delete scope.$parent.model.jobName;
            }
          },
          popover:'Specify a name for the job allocation. The specified name will appear along with the job id number when querying running jobs on the system. The default is the name of the batch script, or just "sbatch" if the script is read on sbatch\'s standard input.',
          required: true
      },
      validators: {
          jobNameValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return /^[.a-zA-Z0-9_-]+$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'jobId',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.jobId;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--jobId',
          args: '=<jobid>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.jobId = false;
              delete scope.$parent.model.jobId;
            }
          },
          popover:'Allocate resources as the specified job id. NOTE: Only valid for user root.',
          required: true
      },
      validators: {
          jobIdValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return /^[0-9]+$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'noKill',
      type: 'checkbox',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.noKill;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--noKill',
          args: '',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.noKill = false;
              delete scope.$parent.model.noKill;
            }
          },
          popover:'Do not automatically terminate a job if one of the nodes it has been allocated fails. The user will assume the responsibilities for fault-tolerance should a node fail. When there is a node failure, any active job steps (usually MPI jobs) on that node will almost certainly suffer a fatal error, but with --no-kill, the job allocation will not be revoked so the user may launch new job steps on the remaining nodes in their allocation. By default SLURM terminates the entire job allocation if any node fails in its range of allocated nodes.',
          required: true
      }

  }, {
      key: 'licenses',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.licenses;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--licenses',
          args: '=<license>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.licenses = false;
              delete scope.$parent.model.licenses;
            }
          },
          popover:'Specification of licenses (or other resources available on all nodes of the cluster) which must be allocated to this job. License names can be followed by a colon and count (the default count is one). Multiple license names should be comma separated (e.g. "--licenses=foo:4,bar"). To submit jobs using remote licenses, those served by the slurmdbd, specify the name of the server providing the licenses. For example "--license=nastran@slurmdb:12".',
          required: true
      },
      validators: {
          licensesValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return /^[0-9a-zA-Z]+(@[.a-zA-Z0-9]+)?(:[0-9]+)?(,[0-9a-zA-Z]+(@[.a-zA-Z0-9]+)?(:[0-9]+)?)*$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'mailType',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.mailType;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--mailType',
          args: '=<type>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.mailType = false;
              delete scope.$parent.model.mailType;
            }
          },
          popover:'Notify user by email when certain event types occur. Valid type values are BEGIN, END, FAIL, REQUEUE, ALL (equivalent to BEGIN, END, FAIL and REQUEUE), TIME_LIMIT, TIME_LIMIT_90 (reached 90 percent of time limit), TIME_LIMIT_80 (reached 80 percent of time limit), and TIME_LIMIT_50 (reached 50 percent of time limit). Multiple type values may be specified in a comma separated list. The user to be notified is indicated with --mail-user.',
          required: true
      },
      validators: {
          mailTypeValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  var reg = "(BEGIN|END|FAIL|REQUEUE|TIME_LIMIT(_[589]0)*)"
                  return RegExp("^" + reg + "(," + reg + ")*" + "$").test($viewValue);
              }
          }
      }
  }, {
      key: 'mailUser',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.mailUser;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--mailUser',
          args: '=<user>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.mailUser = false;
              delete scope.$parent.model.mailUser;
            }
          },
          popover:'User to receive email notification of state changes as defined by --mail-type. The default value is the submitting user.',
          required: true
      },
      validators: {
          mailUserValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return true;
              }
          }
      }
  }, {
      key: 'mem',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.mem;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--mem',
          args: '=<MB>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.mem = false;
              delete scope.$parent.model.mem;
            }
          },
          popover:'Specify the real memory required per node in MegaBytes. Default value is DefMemPerNode and the maximum value is MaxMemPerNode. If configured, both parameters can be seen using the scontrol show config command. This parameter would generally be used if whole nodes are allocated to jobs (SelectType=select/linear). Also see --mem-per-cpu. --mem and --mem-per-cpu are mutually exclusive. NOTE: A memory size specification is treated as a special case and grants the job access to all of the memory on each node. NOTE: Enforcement of memory limits currently relies upon the task/cgroup plugin or enabling of accounting, which samples memory use on a periodic basis (data need not be stored, just collected). In both cases memory use is based upon the job\'s Resident Set Size (RSS). A task may exceed the memory limit until the next periodic accounting sample.',
          required: true
      },
      validators: {
          memValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return /^[1-9]\d*$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'memPerCpu',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.memPerCpu;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--memPerCpu',
          args: '=<MB>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.memPerCpu = false;
              delete scope.$parent.model.memPerCpu;
            }
          },
          popover:'Mimimum memory required per allocated CPU in MegaBytes. Default value is DefMemPerCPU and the maximum value is MaxMemPerCPU (see exception below). If configured, both parameters can be seen using the scontrol show config command. Note that if the job\'s --mem-per-cpu value exceeds the configured MaxMemPerCPU, then the user\'s limit will be treated as a memory limit per task; --mem-per-cpu will be reduced to a value no larger than MaxMemPerCPU; --cpus-per-task will be set and the value of --cpus-per-task multiplied by the new --mem-per-cpu value will equal the original --mem-per-cpu value specified by the user. This parameter would generally be used if individual processors are allocated to jobs (SelectType=select/cons_res). If resources are allocated by the core, socket or whole nodes; the number of CPUs allocated to a job may be higher than the task count and the value of --mem-per-cpu should be adjusted accordingly. Also see --mem. --mem and --mem-per-cpu are mutually exclusive.',
          required: true
      },
      validators: {
          memPerCpuValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return /^[1-9]\d*$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'nodes',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.nodes;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--nodes',
          args: '=<minnodes[-maxnodes]>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.nodes = false;
              delete scope.$parent.model.nodes;
            }
          },
          popover:'Request that a minimum of minnodes nodes be allocated to this job. A maximum node count may also be specified with maxnodes. If only one number is specified, this is used as both the minimum and maximum node count. The partition\'s node limits supersede those of the job. If a job\'s node limits are outside of the range permitted for its associated partition, the job will be left in a PENDING state. This permits possible execution at a later time, when the partition limit is changed. If a job node limit exceeds the number of nodes configured in the partition, the job will be rejected. Note that the environment variable SLURM_NNODES will be set to the count of nodes actually allocated to the job. See the ENVIRONMENT VARIABLES section for more information. If -N is not specified, the default behavior is to allocate enough nodes to satisfy the requirements of the -n and -c options. The job will be allocated as many nodes as possible within the range specified and without delaying the initiation of the job. The node count specification may include a numeric value followed by a suffix of "k" (multiplies numeric value by 1,024) or "m" (multiplies numeric value by 1,048,576).',
          required: true
      },
      validators: {
          nodesValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return /^[1-9]\d*(-[1-9]\d*)?$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'noRequeue',
      type: 'checkbox',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.noRequeue;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--noRequeue',
          args: '',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.noRequeue = false;
              delete scope.$parent.model.noRequeue;
            }
          },
          popover:'Specifies that the batch job should not be requeued after node failure. Setting this option will prevent system administrators from being able to restart the job (for example, after a scheduled downtime). When a job is requeued, the batch script is initiated from its beginning. Also see the --requeue option. The JobRequeue configuration parameter controls the default behavior on the cluster.',
          required: true
      }
  }, {
      key: 'output',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.output;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--output',
          args: '=<filename pattern>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.output = false;
              delete scope.$parent.model.output;
            }
          },
          popover:'Instruct SLURM to connect the batch script\'s standard output directly to the file name specified in the "filename pattern". By default both standard output and standard error are directed to the same file. For job arrays, the default file name is "slurm-%A_%a.out", "%A" is replaced by the job ID and "%a" with the array index. For other jobs, the default file name is "slurm-%j.out", where the "%j" is replaced by the job ID. See the --input option for filename specification options.',
          required: true
      },
      validators: {
          outputValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return /^([a-zA-Z0-9_-]|%[AajNu])+\.[a-zA-Z]+$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'qos',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.qos;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--qos',
          args: '=<qos>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.qos = false;
              delete scope.$parent.model.qos;
            }
          },
          popover:'Request a quality of service for the job. QOS values can be defined for each user/cluster/account association in the SLURM database. Users will be limited to their association\'s defined set of qos\'s when the SLURM configuration parameter, AccountingStorageEnforce, includes "qos" in it\'s definition.',
          required: true
      },
      validators: {
          qosValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return /^(express|normal|long)$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'requeue',
      type: 'checkbox',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.requeue;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--requeue',
          args: '',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.requeue = false;
              delete scope.$parent.model.requeue;
            }
          },
          popover:'Specifies that the batch job should be requeued after node failure. When a job is requeued, the batch script is initiated from its beginning. Also see the --no-requeue option. The JobRequeue configuration parameter controls the default behavior on the cluster.',
          required: true
      }
  }, {
      key: 'time',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.time;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--time',
          args: '=<time>',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.time = false;
              delete scope.$parent.model.time;
            }
          },
          popover:'Set a limit on the total run time of the job allocation. If the requested time limit exceeds the partition\'s time limit, the job will be left in a PENDING state (possibly indefinitely). The default time limit is the partition\'s default time limit. When the time limit is reached, each task in each job step is sent SIGTERM followed by SIGKILL. The interval between signals is specified by the SLURM configuration parameter KillWait. A time limit of zero requests that no time limit be imposed. Acceptable time formats include "minutes", "minutes:seconds", "hours:minutes:seconds", "days-hours", "days-hours:minutes" and "days-hours:minutes:seconds".',
          required: true
      },
      validators: {
          timeValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  var minutes = "([0-5][0-9])";
                  var seconds = "(:[0-5][0-9])";
                  var hours = "(2[0-3]|[01][0-9])";
                  var days = "(\\d{2}-)";

                  /* minutes or minutes:seconds */
                  if (RegExp("^" + minutes + seconds + "?" + "$").test($viewValue)) return true;
                  /* hours:minutes:seconds */
                  else if (RegExp("^" + hours + ":" + minutes + seconds + "$").test($viewValue)) return true;
                  /* days-hours:minutes?seconds? */
                  else if (RegExp("^" + days + hours + "(:" + minutes + ")?" + seconds + "?" + "$").test($viewValue)) return true;

                  else return false;
              }
          }
      }
  }];

  return {
    formFieldsObj:{
      formFields:formFields,
      formModel:formModel
    },
    setFormConfig: function (fc) {
      formConfig = fc;
    },
    getFormConfig: function () {
      return $http
        .get('/slurm/a/config')

        .success(function (data, status, headers, config) {
          return data;
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
.controller('SbatchCtrl', ['$scope',/* 'formConfig',*/ 'FormService', '$log', function($scope,/*formConfig,*/FormService,$log) {
  //FormService.setFormConfig(formConfig);

  $scope.formModel = FormService.formFieldsObj.formModel;
  console.log($scope.formModel);
  $scope.formFields = FormService.formFieldsObj.formFields;
  $scope.options = Object.keys($scope.formModel.check);


  $scope.onEnter = function($event) {
    if ($event.which===13){
        $scope.formModel.check[$scope.selected] = true;
        $scope.selected = "";
    }
  };

}])
.controller('DirectivesCtrl', ['$scope','FormService','$log',function($scope,FormService,$log) {
  // This function distinguishes boolean values and "no option" string from other options
  var noBoolean = function (s){ return ((typeof s === 'boolean')||(/^([nN]o[\s\-][oO]ptions?)$/.test(s)))?  '' : '=' + s; };
  $scope.aceModel = '';
  $scope.directivesObj = FormService.formFieldsObj.formModel;
  $scope.$watch('directivesObj', function(newVal, oldVal){
  var dirString = '';

    for (var k in newVal) {
      if ((typeof newVal[k] !== 'undefined') && (newVal[k] !== '') && (k !== 'check')) {
        dirString += '#SBATCH --' + k.replace(/([A-Z])/g,function(whole,s1){return '-'+s1.toLowerCase();}) + noBoolean(newVal[k]) + '\n';
      }
    }
    $scope.aceModel = dirString;
  }, true);

}])

.controller('ScriptCtrl',['$scope','$modal','FormService','$log',function($scope,$modal,FormService,$log){

  $scope.loadScript = function(){
    var loadScriptModal = $modal.open({
      templateUrl: '/static/slurm/templates/load_script_modal.html',
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      controller:'LoadScriptCtrl'
    });

    };
}])

.controller('LoadScriptCtrl',function($scope,$modalInstance,FormService,$http){
  $scope.formModel = FormService.formFieldsObj.formModel;
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
   $scope.loadFile.filepath = $scope.loadFile.filepath+$scope.loadFile.filename;
   $modalInstance.close($scope.loadFile);
   $http
     .get('/filebrowser/localfiles' + $scope.loadFile.filepath)
     .success(function (data,status,headers,config){
       var script = data.content.split("\n")
       for (var i = 0; i < script.length; i++) {

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

           // else, namely the command does not take any options (e.g. --immediate, --requeue)
           else {
             //camelize the command
             var command = script[i].split('--')[1].replace(/-([a-z])/g,function(whole,s1){return s1.toUpperCase();});
             $scope.formModel.check[command] = true;
             if (command === "getUserEnv") $scope.formModel[command] = "no option";
             else $scope.formModel[command] = true;
           }
         }
       }
     })
 };

 $scope.cancel = function () {
   $modalInstance.dismiss('cancel');
 };
});

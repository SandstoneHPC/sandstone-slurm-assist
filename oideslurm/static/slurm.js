'use strict';

angular.module('oide.slurm', ['ngRoute','ui.bootstrap','formly','formlyBootstrap','ui.ace'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/slurm', {
    templateUrl: '/static/slurm/slurm.html',
    controller: 'SlurmCtrl'//,
    //resolve: {
    //  formConfig: function (FormService) {
    //    return FormService.getFormConfig();
    //  }
    //}
  });

}])
.run(function(formlyConfig){

  // define custom templates
  formlyConfig.setType([
    {
      name:'input',
      template:['<input class="form-control" ng-model="model[options.key]">',
                '<span class="input-group-addon ng-scope"',
                      'popover="{{to.popover}}"',
                      'style="cursor:pointer;">?</span>'].join(''),
      wrapper:["bootstrapLabel", "bootstrapHasError"],
      overwriteOk: true
    },
    {
      name:'checkbox',
      template:['<div class="checkbox">',
	                '<label>',
		                '<input type="checkbox"',
                           'class="formly-field-checkbox"',
		                       'ng-model="model[options.key]">',
	                '</label>',
                '</div>',
                '<span class="input-group-addon ng-scope"',
                      'popover="{{to.popover}}"',
                      'style="cursor:pointer;">?</span>'].join(''),
      wrapper:["bootstrapLabel", "bootstrapHasError"],
      overwriteOk: true
    }
  ]);
})
.factory('FormService', ['$http', function ($http) {
  var formConfig = {};
  var formModel = {};
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.array = false;
              delete scope.$parent.model.array;
            }
          },
          popover:"array",
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.account = false;
              delete scope.$parent.model.account;
            }
          },
          popover:"account",
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.begin = false;
              delete scope.$parent.model.begin;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.checkpoint = false;
              delete scope.$parent.model.checkpoint;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.checkpointDir = false;
              delete scope.$parent.model.checkpointDir;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.cpusPerTask = false;
              delete scope.$parent.model.cpusPerTask;
            }
          },
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
      key: 'workDir',
      type: 'input',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.workDir;
      },
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--workDir',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.workDir = false;
              delete scope.$parent.model.workDir;
            }
          },
          required: true
      },
      validators: {
          workDirValidate: function($viewValue, $formModelValue, scope) {
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.error = false;
              delete scope.$parent.model.error;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.export = false;
              delete scope.$parent.model.export;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.exportFile = false;
              delete scope.$parent.model.exportFile;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.nodefile = false;
              delete scope.$parent.model.nodefile;
            }
          },
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
      templateOptions: {
          type: 'text',
          label: '--getUserEnv',
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.getUserEnv = false;
              delete scope.$parent.model.getUserEnv;
            }
          },
          required: false
      },
      validators: {
          getUserEnvValidate: function($viewValue, $formModelValue, scope) {
              if ($viewValue) {
                  return /^\d*[SL]?$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'immediate',
      type: 'checkbox',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.immediate;
      },
      defaultValue: 'false',
      validation:{show: true},
      templateOptions: {
          type: 'text',
          label: '--immediate',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.immediate = false;
              delete scope.$parent.model.immediate;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.input = false;
              delete scope.$parent.model.input;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.jobName = false;
              delete scope.$parent.model.jobName;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.jobId = false;
              delete scope.$parent.model.jobId;
            }
          },
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
      defaultValue: 'false',
      templateOptions: {
          type: 'text',
          label: '--noKill',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.noKill = false;
              delete scope.$parent.model.noKill;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.licenses = false;
              delete scope.$parent.model.licenses;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.mailType = false;
              delete scope.$parent.model.mailType;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.mailUser = false;
              delete scope.$parent.model.mailUser;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.mem = false;
              delete scope.$parent.model.mem;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.memPerCpu = false;
              delete scope.$parent.model.memPerCpu;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.nodes = false;
              delete scope.$parent.model.nodes;
            }
          },
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
      key: 'onRequeue',
      type: 'checkbox',
      hideExpression:  function($viewValue, $formModelValue, scope) {
          return !scope.$parent.formModel.check.onRequeue;
      },
      validation:{show: true},
      defaultValue: 'false',
      templateOptions: {
          type: 'text',
          label: '--onRequeue',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.onRequeue = false;
              delete scope.$parent.model.onRequeue;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.output = false;
              delete scope.$parent.model.output;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.qos = false;
              delete scope.$parent.model.qos;
            }
          },
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
      defaultValue: 'false',
      templateOptions: {
          type: 'text',
          label: '--requeue',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.requeue = false;
              delete scope.$parent.model.requeue;
            }
          },
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
          placeholder: 'bar',
          addonRight:{
            class:'glyphicon glyphicon-minus',
            onClick: function(options, scope) {
              scope.$parent.model.check.time = false;
              delete scope.$parent.model.time;
            }
          },
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
.controller('SlurmCtrl', ['$scope',/* 'formConfig',*/ 'FormService', '$log', function($scope,/*formConfig,*/FormService,$log) {
  //FormService.setFormConfig(formConfig);

  // check is for checking if a specific field is selected by a user
  // Default fields have true at the beginning
  var check = {
    array:true,
    account:true,
    begin:false,
    checkpoint:false,
    checkpointDir:false,
    cpusPerTask:false,
    workDir:false,
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
    onRequeue:false,
    output:false,
    qos:false,
    requeue:false,
    time:false
  };

  $scope.formModel = FormService.formFieldsObj.formModel;
  $scope.formModel.check = check;

  $scope.formFields = FormService.formFieldsObj.formFields;
  $scope.options = Object.keys(check);


  $scope.onEnter = function($event) {
    if ($event.which===13){
        $scope.formModel.check[$scope.selected] = true;
        $scope.selected = "";
    }
  };

}])
.controller('DirectivesCtrl', ['$scope','FormService','$log',function($scope,FormService,$log) {
  $scope.aceModel = '';
  $scope.directivesObj = FormService.formFieldsObj.formModel;
  $scope.$watch('directivesObj', function(newVal, oldVal){
    var dirString = '';
    for (var k in newVal) {
      if ((typeof newVal[k] !== 'undefined') && (newVal[k] !== '')) {
        dirString += '#SBATCH --' + k + ' ' + newVal[k] + '\n';
      }
    }
    $scope.aceModel = dirString;
  }, true);
}]);

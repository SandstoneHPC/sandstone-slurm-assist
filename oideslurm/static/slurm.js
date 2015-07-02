'use strict';

angular.module('oide.slurm', ['formly','ngRoute','ui.bootstrap','ui.ace','formlyBootstrap'])

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
.factory('FormService', ['$http', function ($http) {
  var formConfig = {};
  var formFields = [{
      key: 'array',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.array;
      },
      templateOptions: {
          type: 'text',
          label: '--array',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          arrayValidate: function($viewValue, $modelValue, scope) {
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
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.account;
      },
      templateOptions: {
          type: 'text',
          label: '--account',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      }
  }, {
      key: 'begin',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          console.log("now evaluated!");
          return !scope.$parent.check.begin;
      },
      //expressionProperties: {
      //  'templateOptions.ngHide': "check.begin"
      //},
      templateOptions: {
          type: 'text',
          label: '--begin',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          beginValidate: function($viewValue, $modelValue, scope) {
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
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.checkpoint;
      },
      templateOptions: {
          type: 'text',
          label: '--checkpoint',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          checkpointValidate: function($viewValue, $modelValue, scope) {
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
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.checkpointDir;
      },
      defaultValue: "./",
      templateOptions: {
          type: 'text',
          label: '--checkpointDir',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          checkpointDirValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  return /^([.a-zA-Z0-9_-]*)\/(([a-zA-Z0-9_-]+\/?)*)$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'cpusPerTask',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.cpusPerTask;
      },
      defaultValue: "1",
      templateOptions: {
          type: 'text',
          label: '--cpusPerTask',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          cpusPerTaskValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  return /^\d+$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'workDir',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.workDir;
      },
      templateOptions: {
          type: 'text',
          label: '--workDir',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          workDirValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  return /^([.a-zA-Z0-9_-]*)\/(([a-zA-Z0-9_-]+\/?)*)$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'error',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.error;
      },
      templateOptions: {
          type: 'text',
          label: '--error',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          errorValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  return /^([a-zA-Z0-9_-]|%[AajNu])+\.[a-zA-Z]+$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'export',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.export;
      },
      templateOptions: {
          type: 'text',
          label: '--export',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          exportValidate: function($viewValue, $modelValue, scope) {
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
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.exportFile;
      },
      templateOptions: {
          type: 'text',
          label: '--exportFile',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          exportFileValidate: function($viewValue, $modelValue, scope) {
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
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.nodefile;
      },
      templateOptions: {
          type: 'text',
          label: '--nodefile',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          nodefileValidate: function($viewValue, $modelValue, scope) {
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
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.getUserEnv;
      },
      defaultValue: "",
      templateOptions: {
          type: 'text',
          label: '--getUserEnv',
          placeholder: 'bar',
          required: false,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          getUserEnvValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  return /^\d*[SL]?$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'immediate',
      type: 'checkbox',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.immediate;
      },
      templateOptions: {
          type: 'text',
          label: '--immediate',
          required: true
      }

  }, {
      key: 'input',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.input;
      },
      templateOptions: {
          type: 'text',
          label: '--input',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          inputValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  return /^([a-zA-Z0-9_-]|%[AajNu])+\.[a-zA-Z]+$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'jobName',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.jobName;
      },
      templateOptions: {
          type: 'text',
          label: '--jobName',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          jobNameValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  return /^[.a-zA-Z0-9_-]+$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'jobId',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.jobId;
      },
      templateOptions: {
          type: 'text',
          label: '--jobId',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          jobIdValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  return /^[0-9]+$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'noKill',
      type: 'checkbox',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.noKill;
      },
      templateOptions: {
          type: 'text',
          label: '--noKill',
          required: true
      }

  }, {
      key: 'licenses',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.licenses;
      },
      templateOptions: {
          type: 'text',
          label: '--licenses',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          licensesValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  return /^[0-9a-zA-Z]+(@[.a-zA-Z0-9]+)?(:[0-9]+)?(,[0-9a-zA-Z]+(@[.a-zA-Z0-9]+)?(:[0-9]+)?)*$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'mailType',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.mailType;
      },
      templateOptions: {
          type: 'text',
          label: '--mailType',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          mailTypeValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  var reg = "(BEGIN|END|FAIL|REQUEUE|TIME_LIMIT(_[589]0)*)"
                  return RegExp("^" + reg + "(," + reg + ")*" + "$").test($viewValue);
              }
          }
      }
  }, {
      key: 'mailUser',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.mailUser;
      },
      templateOptions: {
          type: 'text',
          label: '--mailUser',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          mailUserValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  return true;
              }
          }
      }
  }, {
      key: 'mem',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.mem;
      },
      templateOptions: {
          type: 'text',
          label: '--mem',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          memValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  return /^[1-9]\d*$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'memPerCpu',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.memPerCpu;
      },
      templateOptions: {
          type: 'text',
          label: '--memPerCpu',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          memPerCpuValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  return /^[1-9]\d*$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'nodes',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.nodes;
      },
      templateOptions: {
          type: 'text',
          label: '--nodes',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          nodesValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  return /^[1-9]\d*(-[1-9]\d*)?$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'onRequeue',
      type: 'checkbox',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.onRequeue;
      },
      templateOptions: {
          type: 'text',
          label: '--onRequeue',
          required: true
      }
  }, {
      key: 'output',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.output;
      },
      templateOptions: {
          type: 'text',
          label: '--output',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          outputValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  return /^([a-zA-Z0-9_-]|%[AajNu])+\.[a-zA-Z]+$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'qos',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.qos;
      },
      templateOptions: {
          type: 'text',
          label: '--qos',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          qosValidate: function($viewValue, $modelValue, scope) {
              if ($viewValue) {
                  return /^(express|normal|long)$/.test($viewValue);
              }
          }
      }
  }, {
      key: 'requeue',
      type: 'checkbox',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.requeue;
      },
      templateOptions: {
          type: 'text',
          label: '--requeue',
          required: true
      }
  }, {
      key: 'time',
      type: 'input',
      hideExpression:  function($viewValue, $modelValue, scope) {
          return !scope.$parent.check.time;
      },
      templateOptions: {
          type: 'text',
          label: '--time',
          placeholder: 'bar',
          required: true,
          onBlur: function($viewValue, $modelValue) {
              $modelValue.validation.show = null;
          },
          onFocus: function($viewValue, $modelValue) {
              $modelValue.validation.show = false;
          }
      },
      validators: {
          timeValidate: function($viewValue, $modelValue, scope) {
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
    formFieldsObj:{formFields:formFields},
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
.controller('SlurmCtrl', ['$scope',/* 'formConfig',*/ 'FormService', '$log', function($scope,/*formConfig,*/FormService,$log) {
  //FormService.setFormConfig(formConfig);
  $scope.model = {};

  // $scope.check is for checking if a specific field is selected by a user
  // Default fields have true at the beginning
  $scope.check = {
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
    noRequeue:false,
    output:false,
    qos:false,
    requeue:false,
    time:false
  };
  $scope.formFields = FormService.formFieldsObj.formFields;
  $scope.options = Object.keys($scope.check);
  $scope.onEnter = function($event) {
    if ($event.which===13){
      $scope.check[$scope.selected] = true; // if not exist, this creates new property
      $scope.selected = "";
    }
  };
  $scope.onSubmit = function() {
    alert(JSON.stringify($scope.model),null,2);
  };

}]);

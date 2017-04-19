'use strict';

angular.module('sandstone.slurm')

.factory('ScheduleService', ['$http','$log','$q','$rootScope','FilesystemService','AlertService',function($http,$log,$q,$rootScope,FilesystemService,AlertService) {
  var formConfig;

  var saveScript = function (filepath,content) {
    var deferred = $q.defer();

    var writeContents = function(contents) {
      var writeFile = FilesystemService.writeFileContents(filepath,content);
      writeFile.then(function(data) {
        deferred.resolve();
      },function(data) {
        deferred.reject();
      });
    };

    var createAndWriteContents = function(filepath,contents) {
      var createFile = FilesystemService.createFile(filepath);
      createFile.then(function(data) {
        writeContents(filepath,content);
      },function(data) {
        deferred.reject();
      });
    };

    var fileExists = FilesystemService.getFileDetails(filepath);
    fileExists.then(function(fileDetails) {
      writeContents(content);
    },function(data) {
      if(data.status === 404) {
        // Create the file first
        createAndWriteContents(filepath,content);
      }
    });

    return deferred.promise;
  };

  var parseScriptContents = function(contents) {
    // Returns directives object, and script string
    // All scripts assumed to be BASH
    var fullScript = contents.split('\n');
    var dirs = {}
    var renderScript = ''
    // Separate script components
    for (var i=0;i<fullScript.length;i++) {
      if (fullScript[i].startsWith('#!/bin/bash')) {
        continue;
      } else if (fullScript[i].startsWith('#SBATCH')) {
        var cmp = fullScript[i].replace('#SBATCH --','').split('=');
        dirs[cmp[0]] = cmp[1];
      } else {
        renderScript += fullScript[i] + '\n';
      }
    }
    // Trim extra white space at tail
    renderScript = renderScript.trim();
    renderScript += '\n';
    // Determine profile from directives
    var qos = dirs.qos;
    var partition = dirs.partition;
    var matchedProfile;
    for (var pname in formConfig.profiles) {
      if (
        (formConfig.profiles[pname].schema.properties.qos.default == qos)
        &&
        (formConfig.profiles[pname].schema.properties.partition.default == partition)
      ) {
        matchedProfile = pname;
        break;
      }
    }
    // Default to custom profile if none matched
    if (!matchedProfile) {
      matchedProfile = 'custom';
    }
    // Validate data types
    var props = formConfig.profiles[matchedProfile].schema.properties;
    for (var k in dirs) {
      if ((props[k].type === 'integer') || (props[k].type === 'number')) {
        if (typeof dirs[k] !== 'number') {
          dirs[k] = Number(dirs[k]);
        }
      }
    }
    // Push to interface
    $rootScope.$emit('sa:set-form-contents', matchedProfile, dirs);
    return {
      directives: dirs,
      script: renderScript
    };
  }

  return {
    loadFormConfig: function() {
      return $http
        .get('/slurm/a/config')
        .success(function (data, status, headers, config) {
          $log.log(data);
          formConfig = data.formConfig;
        });
    },
    getFormConfig: function() {
      return formConfig;
    },
    loadScript: function(filepath) {
      var deferred = $q.defer();
      var deferredLoadScript = FilesystemService.getFileContents(filepath);
      deferredLoadScript.then(function(scriptContents) {
        deferred.resolve(scriptContents);
      },function(data) {
        deferred.reject(data);
      });
      return deferred.promise;
    },
    saveScript: saveScript,
    submitScript: function (filepath,content) {
      var deferred = $q.defer();

      var deferredSaveScript = saveScript(filepath,content);
      deferredSaveScript.then(function() {
        $http({
          url: "/slurm/a/jobs",
          method: "POST",
          data:{'content': filepath}
        })
        .success(function(data, status, header, config) {
          $log.debug('Submitted: ', filepath);
          deferred.resolve(data);
        })
        .error(function(data, status, header, config) {
          $log.error("Submission failed:", data ,status, header, config);
          deferred.reject();
        });
      },function() {
        deferred.reject();
      });

      return deferred.promise;
    },
    parseScriptContents: parseScriptContents
  };
}]);

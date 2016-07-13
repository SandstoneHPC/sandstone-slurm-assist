'use strict';

angular.module('sandstone.slurm')

.factory('ScheduleService', ['$http','$log','FilesystemService',function($http,$log,FilesystemService) {
  var formConfig;
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
    loadScript: function(filepath,callback) {
      $http
        .get('/filebrowser/localfiles'+filepath)
        .success(function(data, status, headers, config) {
          callback(data);
        });
    },
    saveScript: function (filepath,content) {
      $http
        .get(
          '/filebrowser/a/fileutil',
          {
            params: {
              operation: 'CHECK_EXISTS',
              filepath: filepath
            }
          }
        )
        .success(function (data, status, headers, config) {
          if (data.result) {
            $http({
              url: '/filebrowser/localfiles'+filepath,
              method: 'PUT',
              params: {
                _xsrf: getCookie('_xsrf')
              },
              data: {'content': content}
            })
            .success(function (data,status, headers, config) {
              $log.debug('Saved file: ', filepath);
            });
          } else {
            $http({
              url: '/filebrowser/localfiles'+filepath,
              method: 'POST',
              params: {
                _xsrf: getCookie('_xsrf')
              }
            })
            .success(function (data,status, headers, config) {
              $http({
                url: '/filebrowser/localfiles'+filepath,
                method: 'PUT',
                params: {
                  _xsrf: getCookie('_xsrf')
                },
                data: {'content': content}
              })
              .success(function (data,status, headers, config) {
                $log.debug('Saved file: ', filepath);
              });
            });
          }
        });
    },
    submitScript: function (filepath,content,successCb,errorCb) {
      $http
        .get(
          '/filebrowser/a/fileutil',
          {
            params: {
              operation: 'CHECK_EXISTS',
              filepath: filepath
            }
          }
        )
        .success(function (data, status, headers, config) {
          if (data.result) {
            $http({
              url: '/filebrowser/localfiles'+filepath,
              method: 'PUT',
              params: {
                _xsrf: getCookie('_xsrf')
              },
              data: {'content': content}
            })
            .success(function (data,status, headers, config) {
              $log.debug('Saved file: ', filepath);
              $http({
                url: "/slurm/a/jobs",
                method: "POST",
                params: {_xsrf: getCookie('_xsrf')},
                data:{'content': filepath}
              })
              .success(function(data, status, header, config) {
                $log.debug('Submitted: ', filepath);
                successCb(data, status);
              })
              .error(function(data, status, header, config) {
                $log.error("Submission failed:", data ,status, header, config);
                errorCb(data, status);
              });
            });
          } else {
            $http({
              url: '/filebrowser/localfiles'+filepath,
              method: 'POST',
              params: {
                _xsrf: getCookie('_xsrf')
              }
            })
            .success(function (data,status, headers, config) {
              $http({
                url: '/filebrowser/localfiles'+filepath,
                method: 'PUT',
                params: {
                  _xsrf: getCookie('_xsrf')
                },
                data: {'content': content}
              })
              .success(function (data,status, headers, config) {
                $log.debug('Saved file: ', filepath);
                $http({
                  url: "/slurm/a/jobs",
                  method: "POST",
                  params: {_xsrf: getCookie('_xsrf')},
                  data:{'content': filepath}
                })
                .success(function(data, status, header, config) {
                  $log.debug('Submitted: ', filepath);
                  successCb(data, status);
                })
                .error(function(data, status, header, config) {
                  $log.error("Submission failed:", data ,status, header, config);
                  errorCb(data, status);
                });
              });
            });
          }
        });
    }
  };
}]);

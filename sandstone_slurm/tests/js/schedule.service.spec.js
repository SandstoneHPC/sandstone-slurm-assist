'use strict';

describe('sandstone.slurm.ScheduleService', function() {
  var FilesystemService;
  var mockResolve;

  beforeEach(module('sandstone'));
  beforeEach(module('sandstone.filesystemservice'));
  beforeEach(module('sandstone.slurm'));

  beforeEach(inject(function(_FilesystemService_,_$q_) {
    FilesystemService = _FilesystemService_;

    mockResolve = function(data) {
      var deferred = _$q_.defer();
      deferred.resolve(data);
      return deferred.promise;
    };
  }));

  describe('form methods', function() {

    it('loadFormConfig',function() {});

    it('getFormConfig',function() {});

  });

  describe('script methods', function() {

    it('loadScript',function() {});

    it('saveScript',function() {});

    it('submitScript',function() {});

  });

});

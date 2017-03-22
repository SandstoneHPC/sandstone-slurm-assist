'use strict';

describe('sandstone.slurm.StatusService', function() {
  var mockResolve;

  beforeEach(module('sandstone'));
  beforeEach(module('sandstone.slurm'));

  beforeEach(inject(function(_$q_) {

    mockResolve = function(data) {
      var deferred = _$q_.defer();
      deferred.resolve(data);
      return deferred.promise;
    };
  }));

  it('getJobList',function() {});

  it('getJob',function() {});

});

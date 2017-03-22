'use strict';

describe('sandstone.slurm.ScheduleCtrl', function() {
  var ScheduleService;
  var ctrl;
  var $controller;
  var $scope;

  beforeEach(module('sandstone'));
  beforeEach(module('sandstone.slurm'));

  beforeEach(inject(function(_ScheduleService_,_$rootScope_,_$controller_) {
    ScheduleService = _ScheduleService_;
    $controller = _$controller_;

    $scope = _$rootScope_.$new();
    ctrl = $controller('ScheduleCtrl', {$scope:$scope});

  }));

  describe('script loading', function() {

    it('loads a script with no sbatch directives',function() {});

    it('loads a script with sbatch directives',function() {});

    it('loads a script with comments and whitespace',function() {});

    it('loads a script with incorrect directives',function() {});

  });

  describe('job submission', function() {

    it('saves a script',function() {});

    it('submits a saved script',function() {});

  });

});

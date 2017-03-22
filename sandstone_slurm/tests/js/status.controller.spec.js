'use strict';

describe('sandstone.slurm.StatusCtrl', function() {
  var StatusService;
  var ctrl;
  var $controller;
  var $scope;

  beforeEach(module('sandstone'));
  beforeEach(module('sandstone.slurm'));

  beforeEach(inject(function(_StatusService_,_$rootScope_,_$controller_) {
    StatusService = _StatusService_;
    $controller = _$controller_;

    $scope = _$rootScope_.$new();
    ctrl = $controller('StatusCtrl', {$scope:$scope});

  }));

  describe('job table', function() {

    it('state code translated appropriately',function() {});

    it('queue collection updates',function() {});

  });

});

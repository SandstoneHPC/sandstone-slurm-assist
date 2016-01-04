
exports.readModule = function (){
  var dummy =[{
    JobID:'1',
    Start:"Unknown",
    End:"Unknown",
    State:"PENDING",
    AllocCPUS:"1",
    QOS:"janus",
    NodeList:"Unknown",
    TotalCPU:"Unknown",
    CPUTime:"Unknown",
    NNodes:"Unknown"
  },{
    JobID:'2',
    Start:"Unknown",
    End:"Unknown",
    State:"PENDING",
    AllocCPUS:"1",
    QOS:"janus-long",
    NodeList:"Unknown",
    TotalCPU:"Unknown",
    CPUTime:"Unknown",
    NNodes:"Unknown"
  }
  ];

  angular.module('httpMocker', ['oide.slurm','ngMockE2E'])
  .run(function($httpBackend) {
    // fetching a fake JSON object for submitted jobs
    $httpBackend.whenGET('/slurm/a/jobs')
      .respond(function(method,url,data,headers){
        return [200,dummy,{}];
      });
    // call the actual back-end
    $httpBackend.whenGET(/.*/).passThrough();
  })
}

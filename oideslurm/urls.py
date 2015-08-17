from oideslurm.handlers import FormConfigHandler
from oideslurm.handlers import JobListHandler
from oideslurm.handlers import JobHandler



URL_SCHEMA = [
            (r"/slurm/a/config", FormConfigHandler),
            (r"/slurm/a/jobs", JobListHandler),
            (r"/slurm/a/job/?(?P<jobid>[0-9]+)?", JobHandler),
        ]

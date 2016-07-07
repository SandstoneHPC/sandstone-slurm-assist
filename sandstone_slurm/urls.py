from sandstone_slurm.handlers import FormConfigHandler
from sandstone_slurm.handlers import JobListHandler
from sandstone_slurm.handlers import JobHandler



URL_SCHEMA = [
            (r"/slurm/a/config", FormConfigHandler),
            (r"/slurm/a/jobs", JobListHandler),
            (r"/slurm/a/jobs/(?P<jobid>[0-9]+)?", JobHandler),
        ]

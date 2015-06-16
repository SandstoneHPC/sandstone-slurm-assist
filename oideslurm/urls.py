from oideslurm.handlers import FormConfigHandler



URL_SCHEMA = [
            (r"/slurm/a/config", FormConfigHandler),
        ]

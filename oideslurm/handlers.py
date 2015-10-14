import tornado.web
import json

import oide.lib.decorators
import oideslurm.settings as app_settings
from oideslurm.mixins.slurm_mixin import SlurmCmdMixin
from oide.lib.handlers.base import BaseHandler
from oideslurm.config_utils import ConfigLoader



class FormConfigHandler(BaseHandler):

    @oide.lib.decorators.authenticated
    def get(self):
        schema = ConfigLoader.getFormConfigs()
        ctx = {
            'formSchema': schema
            }
        self.write(ctx)

class JobListHandler(BaseHandler,SlurmCmdMixin):

    @oide.lib.decorators.authenticated
    def get(self):
        # This method should return all sacct data for
        # the running user.
        sacct_out = self.run_sacct()
        json_obj = json.dumps(sacct_out)
        self.write(json_obj)


    @oide.lib.decorators.authenticated
    def post(self):
        # This method should take the filepath of an
        # sbatch file as an argument, and then schedule
        # a job with the indicated file using sbatch.
        # The jobid of the scheduled job should be returned.
        self.job_submit(filepath=json.loads(self.request.body)['content'])


class JobHandler(BaseHandler,SlurmCmdMixin):

    @oide.lib.decorators.authenticated
    def get(self,jobid):
        # This method should retrieve sacct data
        # for the job specified by jobid
        self.write(self.run_sacct(jobid=jobid))

    @oide.lib.decorators.authenticated
    def delete(self,jobid):
        # This method should dequeue the job specified
        # by jobid, via scancel.
        pass

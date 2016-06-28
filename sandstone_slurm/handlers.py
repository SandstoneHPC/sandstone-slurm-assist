import tornado.web
import json

import sandstone.lib.decorators
import sandstone_slurm.settings as app_settings
from sandstone_slurm.mixins.slurm_mixin import SlurmCmdMixin
from sandstone.lib.handlers.base import BaseHandler
from sandstone_slurm.config_utils import ConfigLoader



class FormConfigHandler(BaseHandler):

    @sandstone.lib.decorators.authenticated
    def get(self):
        schema = ConfigLoader.getFormConfigs()
        ctx = {
            'formSchema': schema
            }
        self.write(ctx)

class JobListHandler(BaseHandler,SlurmCmdMixin):

    @sandstone.lib.decorators.authenticated
    def get(self):
        # This method should return all sacct data for
        # the running user.
        sacct_out = self.run_sacct()
        json_obj = json.dumps(sacct_out)
        self.write(json_obj)


    @sandstone.lib.decorators.authenticated
    def post(self):
        # This method should take the filepath of an
        # sbatch file as an argument, and then schedule
        # a job with the indicated file using sbatch.
        # The jobid of the scheduled job should be returned.
        return_code,output = self.job_submit(filepath=json.loads(self.request.body)['content'])
	if return_code != 0:
	    self.set_status(500)
	    self.write(output)
	else:
	    self.write("Successful Submission")

class JobHandler(BaseHandler,SlurmCmdMixin):

    @sandstone.lib.decorators.authenticated
    def get(self,jobid):
        # This method should retrieve sacct data
        # for the job specified by jobid
        self.write(self.run_sacct(jobid=jobid))

    @sandstone.lib.decorators.authenticated
    def delete(self,jobid):
        # This method should dequeue the job specified
        # by jobid, via scancel.
        pass

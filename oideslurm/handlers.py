import tornado.web


import oide.lib.decorators
import oideslurm.settings as app_settings
from oideslurm.mixins.slurm_mixin import SlurmCmdMixin
from oide.lib.handlers.base import BaseHandler



class FormConfigHandler(BaseHandler):

    @oide.lib.decorators.authenticated
    def get(self):
        ctx = {
            'formConfig': app_settings.FORM_CONFIG['configs']
            }
        self.write(ctx)

class JobListHandler(BaseHandler,SlurmCmdMixin):

    @oide.lib.decorators.authenticated
    def get(self):
        # This method should return all sacct data for
        # the running user.
        self.write(self.run_sacct())

    @oide.lib.decorators.authenticated
    def post(self):
        # This method should take the filepath of an
        # sbatch file as an argument, and then schedule
        # a job with the indicated file using sbatch.
        # The jobid of the scheduled job should be returned.
        pass


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

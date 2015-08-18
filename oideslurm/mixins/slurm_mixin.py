import tornado.web
import subprocess



class SlurmCmdMixin(tornado.web.RequestHandler):
    # This class will contain any methods necessary
    # for running slurm commands and parsing output.
    def run_sacct(self,**kwargs):
        # Handle keyword arguments, translate them into
        # corresponding options for sacct via subprocess
        options = ['-P']
        cmd = ['sacct'] + options
        cmd_out = subprocess.check_output(cmd)
        # Parse output and return

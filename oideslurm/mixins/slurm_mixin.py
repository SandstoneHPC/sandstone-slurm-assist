import tornado.web
import subprocess



class SlurmCmdMixin(tornado.web.RequestHandler):
    # This class will contain any methods necessary
    # for running slurm commands and parsing output.

    def run_sacct(self,**kwargs):
        # Handle keyword arguments, translate them into
        # corresponding options for sacct via subprocess

        output = []
        # if job id is specified
        if kwargs.get('jobid'):
            options = ['-P','--format=JobId,Start,End','-j '+str(kwargs['jobid'])]
        else:
            options = ['-P','--format=JobId,Start,End']

        cmd = ['sacct'] + options
        cmd_out = subprocess.check_output(cmd).split('\n')[:-1] # [:-1] because the last element of the list is ""
        field_names = cmd_out[0].split('|')

        # exclude the first row since it's name fields
        for row in cmd_out[1:]:
            job = {}
            row = row.split('|')
            job['JobID'] = row[0][1:] # delete a space at a head ,e.g. ' 908033' -> '908033'
            for i in range(1,len(field_names)):
                job[field_names[i]] = row[i]
            output.append(job)

        return output

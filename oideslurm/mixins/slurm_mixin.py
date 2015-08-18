import tornado.web
import subprocess



class SlurmCmdMixin(tornado.web.RequestHandler):
    # This class will contain any methods necessary
    # for running slurm commands and parsing output.
    def run_sacct(self,**kwargs):
        # Handle keyword arguments, translate them into
        # corresponding options for sacct via subprocess

        # if job id is specified
        if kwargs.get('jobid'):
            return self.run_sacct_jobid(jobid=kwargs['jobid'])
        else:
            pass

    def run_sacct_jobid(self,**kwargs):
        '''
        This method runs sacct command with a specified job id.
        Returned is a list of the infomration of the job and job
        steps (corresponding to jobid.batch and jobid.0) if the job
        is completed.
        Example:
        [{'Start': '2015-08-17T09:05:43', 'End': '2015-08-17T09:06:04', 'JobID': '908033'},
         {'Start': '2015-08-17T09:05:43', 'End': '2015-08-17T09:06:04', 'JobID': '908033.batch'}]
        '''
        output = []
        options = ['-P','--format=JobId,Start,End','-j '+str(kwargs['jobid'])]
        cmd = ['sacct'] + options
        cmd_out = subprocess.check_output(cmd).split('\n')[:-1]
        field_names = cmd_out[0].split('|')
        # exclude the first row since it's name fields
        for row in cmd_out[1:]:
            job_step = {}
            row = row.split('|')
            job_step['JobID'] = row[0][1:] # delete a space at a head ,e.g. ' 908033' -> '908033'
            for i in range(1,len(field_names)):
                job_step[field_names[i]] = row[i]
            output.append(job_step)

        return output

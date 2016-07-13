import tornado.web
import subprocess



class SlurmCmdMixin:
    # This class will contain any methods necessary
    # for running slurm commands and parsing output.

    def run_sacct(self,**kwargs):
        # Handle keyword arguments, translate them into
        # corresponding options for sacct via subprocess

        output = []
        options = ['-X','-P','--format=ALL']

        cmd = ['sacct'] + options

        cmd_out = subprocess.check_output(cmd).splitlines()
        field_names = cmd_out[0].split('|')

        # exclude the first row since it's name fields
        for row in cmd_out[1:]:
            job = {}
            row = row.strip().split('|')
            for i in range(0,len(field_names)):
                job[field_names[i]] = row[i]
            output.append(job)

        return output

    def job_submit(self,**kwargs):

        filepath = kwargs.get('filepath')

        cmd = ['sbatch',filepath]
        try:
            cmd_out = subprocess.check_output(cmd,stderr=subprocess.STDOUT)
            return (0, cmd_out)
        except OSError:
            return (1, "Slurm is temporarily down")
        except subprocess.CalledProcessError as e:
            return (e.returncode, e.output)

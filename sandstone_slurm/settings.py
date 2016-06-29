import os
import subprocess

APP_DIRECTORY = os.path.dirname(os.path.abspath(__file__))

APP_SPECIFICATION = {
    'APP_DESCRIPTION': {
        'name': 'Slurm Assist',
        'link': '/#/slurm',
        'description': 'An assistive interface for scheduling jobs with Slurm.',
    },
    'NG_MODULE_NAME': 'slurm',
    'NG_MODULE_STYLESHEETS': (
        'slurm.css',
    ),
    'NG_MODULE_SCRIPTS': (
        'slurm.js',
        'schedule.controller.js',
        'status.controller.js',
        'sa-assistform.directive.js',
        'sa-sbatchscript.directive.js',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'bower_components/angular-smart-table/dist/smart-table.min.js',
	    'bower_components/angular-mocks/angular-mocks.js',
    ),
}

account_cmd = 'sacctmgr list ass user=$(whoami) -P -n format=account'

try:
	user_accounts = subprocess.check_output(
        	                account_cmd,
        	                shell=True,
        	                ).split()
except:
	user_accounts = ["dummy account"]

BASE_CONFIG = {
        "type": "object",
        "title": "SlurmConfig",
        "properties": {
            "array": {
                "title": "array",
                "type": "string",
                "pattern": "^\\d+$|^(\\d+-\\d+)(:\\d+)?$",
                'description': 'Submit a job array, multiple jobs to be executed with identical parameters. The indexes specification identifies what array index values should be used. Multiple values may be specified using a comma separated list and/or a range of values with a "-" separator. For example, "--array=0-15" or "--array=0,6,16-32". A step function can also be specified with a suffix containing a colon and number. For example, "--array=0-15:4" is equivalent to "--array=0,4,8,12". A maximum number of simultaneously running tasks from the job array may be specified using a "%" separator. For example "--array=0-15%4" will limit the number of simultaneously running tasks from this job array to 4. The minimum index value is 0. the maximum value is one less than the configuration parameter MaxArraySize.',
            },
            "account": {
                'title': "account",
                "type":"string",
                "enum": user_accounts,
                'description': 'Charge resources used by this job to specified account. The account is an arbitrary string. The account name may be changed after job submission using the scontrol command.',
            },
            "begin": {
                "title": "begin",
                "type": "string",
                "pattern": "^(2[0-3]|[01][0-9]):[0-5][0-9]$",
                'description': 'Submit the batch script to the SLURM controller immediately, like normal, but tell the controller to defer the allocation of the job until the specified time. Time may be of the form HH:MM:SS to run a job at a specific time of day (seconds are optional). (If that time is already past, the next day is assumed.) You may also specify midnight, noon, fika (3 PM) or teatime (4 PM) and you can have a time-of-day suffixed with AM or PM for running in the morning or the evening. You can also say what day the job will be run, by specifying a date of the form MMDDYY or MM/DD/YY YYYY-MM-DD. Combine date and time using the following format YYYY-MM-DD[THH:MM[:SS]]. You can also give times like now + count time-units, where the time-units can be seconds (default), minutes, hours, days, or weeks and you can tell SLURM to run the job today with the keyword today and to run the job tomorrow with the keyword tomorrow. The value may be changed after job submission using the scontrol command. For example: --begin=16:00 , --begin=now+1hour, --begin=now+60 (seconds by default), --begin=2016-01-20T12:34:00, Notes on date/time specifications: - Although the \'seconds\' field of the HH:MM:SS time specification is allowed by the code, note that the poll time of the SLURM scheduler is not precise enough to guarantee dispatch of the job on the exact second. The job will be eligible to start on the next poll following the specified time. The exact poll interval depends on the SLURM scheduler (e.g., 60 seconds with the default sched/builtin).- If no time (HH:MM:SS) is specified, the default is (00:00:00). - If a date is specified without a year (e.g., MM/DD) then the current year is assumed, unless the combination of MM/DD and HH:MM:SS has already passed for that year, in which case the next year is used.',
            },
            "checkpoint": {
                "title": "checkpoint",
                "type": "string",
                "pattern": "^(2[0-3]|[01][0-9]):[0-5][0-9]$",
                'description': 'Specifies the interval between creating checkpoints of the job step. By default, the job step will have no checkpoints created. Acceptable time formats include "minutes", "minutes:seconds", "hours:minutes:seconds", "days-hours", "days-hours:minutes" and "days-hours:minutes:seconds".',
            },
            "checkpoint-dir": {
                "title": "checkpoint-dir",
                "type": "string",
                "pattern": "^([.a-zA-Z0-9_-]*)\\/(([a-zA-Z0-9_-]+\\//?)*)$",
                'description': 'Specifies the directory into which the job or job step\'s checkpoint should be written (used by the checkpoint/blcrm and checkpoint/xlch plugins only). The default value is the current working directory. Checkpoint files will be of the form "<job_id>.ckpt" for jobs and "<job_id>.<step_id>.ckpt" for job steps.',
            },
            "cpu-per-task": {
                "title": "cpu-per-task",
                "type": "integer",
                "minimum":1,
                "maximum":100,
                'description': 'Advise the SLURM controller that ensuing job steps will require ncpus number of processors per task. Without this option, the controller will just try to allocate one processor per task. For instance, consider an application that has 4 tasks, each requiring 3 processors. If our cluster is comprised of quad-processors nodes and we simply ask for 12 processors, the controller might give us only 3 nodes. However, by using the --cpus-per-task=3 options, the controller knows that each task requires 3 processors on the same node, and the controller will grant an allocation of 4 nodes, one for each of the 4 tasks.',
            },
            "workdir": {
                "title": "workdir",
                "type": "string",
                "pattern": "^([.a-zA-Z0-9_-]*)\\/(([a-zA-Z0-9_-]+\\//?)*)$",
                'description': 'Set the working directory of the batch script to directory before it is executed. The path can be specified as full path or relative path to the directory where the command is executed.',
            },
            "error": {
                "title": "error",
                "type": "string",
                "pattern": "^([a-zA-Z0-9_-]|%[AajNu])+\\.[a-zA-Z]+$",
                'description': 'Instruct SLURM to connect the batch script\'s standard error directly to the file name specified in the "filename pattern". By default both standard output and standard error are directed to the same file. For job arrays, the default file name is "slurm-%A_%a.out", "%A" is replaced by the job ID and "%a" with the array index. For other jobs, the default file name is "slurm-%j.out", where the "%j" is replaced by the job ID. See the --input option for filename specification options.',
            },
            "export": {
                "title": "export",
                "type": "string",
                "pattern": "^(ALL|NONE)$",
                'description': 'Identify which environment variables are propagated to the batch job. Multiple environment variable names should be comma separated. Environment variable names may be specified to propagate the current value of those variables (e.g. "--export=EDITOR") or specific values for the variables may be exported (e.g.. "--export=EDITOR=/bin/vi") in addition to the environment variables that would otherwise be set. This option particularly important for jobs that are submitted on one cluster and execute on a different cluster (e.g. with different paths). By default all environment variables are propagated. If the argument is NONE or specific environment variable names, then the --get-user-env option will implicitly be set to load other environment variables based upon the user\'s configuration on the cluster which executes the job.',
            },
            "export-file": {
                "title": "export-file",
                "type": "string",
                "pattern": "^[.a-zA-Z0-9_-]+$",
                'description': 'If a number between 3 and OPEN_MAX is specified as the argument to this option, a readable file descriptor will be assumed (STDIN and STDOUT are not supported as valid arguments). Otherwise a filename is assumed. Export environment variables defined in <filename> or read from <fd> to the job\'s execution environment. The content is one or more environment variable definitions of the form NAME=value, each separated by a null character. This allows the use of special characters in environment definitions.',
            },
            "nodefile": {
                "title": "nodefile",
                "type": "string",
                "pattern": "^([.a-zA-Z0-9_-]*)\\/(([a-zA-Z0-9_-]+\\/?)*)[.a-zA-Z0-9_-]+$",
                'description': 'Much like --nodelist, but the list is contained in a file of name node file. The node names of the list may also span multiple lines in the file. Duplicate node names in the file will be ignored. The order of the node names in the list is not important; the node names will be sorted by SLURM.',
            },
            "get-user-env": {
                "title": "get-user-env",
                "type": "string",
                "pattern": "^(\\d*[SL]?)$|^([nN]o[\\s\\-][oO]ptions?)$",
                'description': 'This option will tell sbatch to retrieve the login environment variables for the user specified in the --uid option. The environment variables are retrieved by running something of this sort "su - <username> -c /usr/bin/env" and parsing the output. Be aware that any environment variables already set in sbatch\'s environment will take precedence over any environment variables in the user\'s login environment. Clear any environment variables before calling sbatch that you do not want propagated to the spawned program. The optional timeout value is in seconds. Default value is 8 seconds. The optional mode value control the "su" options. With a mode value of "S", "su" is executed without the "-" option. With a mode value of "L", "su" is executed with the "-" option, replicating the login environment. If mode not specified, the mode established at SLURM build time is used. Example of use include "--get-user-env"(in this case, write "no option" to the input field), "--get-user-env=10" "--get-user-env=10L", and "--get-user-env=S". This option was originally created for use by Moab.',
            },
            "immediate": {
                "title": "immediate",
                "type": "boolean",
                'description': 'Specifies the directory into which the job or job step\'s checkpoint should be written (used by the checkpoint/blcrm and checkpoint/xlch plugins only). The default value is the current working directory. Checkpoint files will be of the form "<job_id>.ckpt" for jobs and "<job_id>.<step_id>.ckpt" for job steps.',
            },
            "input": {
                "title": "input",
                "type": "string",
                "pattern": "^([a-zA-Z0-9_-]|%[AajNu])+\\.[a-zA-Z]+$",
                'description': 'Instruct SLURM to connect the batch script\'s standard input directly to the file name specified in the "filename pattern". By default, "/dev/null" is open on the batch script\'s standard input and both standard output and standard error are directed to a file of the name "slurm-%j.out", where the "%j" is replaced with the job allocation number, as described below. The filename pattern may contain one or more replacement symbols, which are a percent sign "%" followed by a letter (e.g. %j). Supported replacement symbols are: %A:Job array\'s master job allocation number. %a:Job array ID (index) number. %j:Job allocation number.%N:Node name. Only one file is created, so %N will be replaced by the name of the first node in the job, which is the one that runs the script.%u:User name.',
            },
            "job-name": {
                "title": "job-name",
                "type": "string",
                "pattern": "^[.a-zA-Z0-9_-]+$",
                'description': 'Specify a name for the job allocation. The specified name will appear along with the job id number when querying running jobs on the system. The default is the name of the batch script, or just "sbatch" if the script is read on sbatch\'s standard input.',
            },
            "jobid": {
                "title": "jobid",
                "type": "number",
                "minimum": 0,
                'description': '',
            },
            "no-kill": {
                "title": "no-kill",
                "type": "boolean",
                'description': '',
            },
            "licenses": {
                "title": "licenses",
                "type": "string",
                "pattern": "^[0-9a-zA-Z]+(@[.a-zA-Z0-9]+)?(:[0-9]+)?(,[0-9a-zA-Z]+(@[.a-zA-Z0-9]+)?(:[0-9]+)?)*$",
                'description': '',
            },
            "mail-type": {
                "title": "mail-type",
                "type": "string",
                "pattern": "^(BEGIN|END|FAIL|REQUEUE|TIME_LIMIT(_[589]0)*)$",
                'description': '',
            },
            "mail-user": {
                "title": "mail-user",
                "type": "string",
                'description': '',
            },
            "mem": {
                "title": "mem",
                "type": "number",
                "minimum":1,
                "maximum":1000,
                'description': '',
            },
            "mem-per-cpu": {
                "title": "mem-per-cpu",
                "type": "number",
                "minimum":1,
                "maximum":1000,
                'description': '',
            },
            "nodes": {
                "title": "nodes",
                "type": "number",
                "minimum":1,
                "maximum":1000,
                'description': '',
            },
            "no-requeue": {
                "title": "no-requeue",
                "type": "boolean",
                'description': '',
            },
            "output": {
                "title": "output",
                "type": "string",
                "pattern": "^(\/(.+)+\/)*(\w+)(\.(\w+))*",
                'description': '',
            },
            "qos": {
                "title": "qos",
                "type": "string",
                "pattern": "^(janus(-long|-debug)?|himem|crestone|gpu)$",
                "readonly": True,
                'description': '',
            },
            "requeue": {
                "title": "requeue",
                "type": "boolean",
                'description': '',
            },
            "time": {
                "title": "time",
                "type": "string",
                "pattern": "^([0-9]{2}-)?(([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]$",
                'description': '',
            },
        }
    }

FORM_CONFIG = {
    # [<str: feature1>, <str: feature2>]
    'features': [],
    # [(<str: gname>, <str: type>, <int (optional): count>), ...]
    'gres': [],
    # Site-specific queue config
    'queues': {
        # Key off of (<str: qos>, <str: partition>)
        ('janus-debug',None): {
            # Form is prepopulated with these fields/values (can be None)
            'defaults': {
                'nodes': 1,
                'time': '00:01:00',
            },
            # Schema specified here will be used to patch base schema (can be None)
            'schema': {
                "properties": {
                    "time": {
                        "pattern": "^(00\\-)?(((00):[0-5][0-9]:[0-5][0-9])|(01:00:00))$",
                    },
                },
                'required': [
                    'nodes',
                ]
            }
        }
    },
}

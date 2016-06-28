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
                'description': 'Submit a job array, multiple jobs to be executed \
                    with identical parameters. The indexes specification identifies \
                    what array index values should be used. Multiple values may be \
                    specified using a comma separated list and/or a range of values \
                    with a "-" separator. For example, "--array=0-15" or "--array=0,6,16-32". \
                    A step function can also be specified with a suffix containing \
                    a colon and number. For example, "--array=0-15:4" is equivalent \
                    to "--array=0,4,8,12". A maximum number of simultaneously running \
                    tasks from the job array may be specified using a "%" separator. \
                    For example "--array=0-15%4" will limit the number of simultaneously \
                    running tasks from this job array to 4. The minimum index value \
                    is 0. the maximum value is one less than the configuration \
                    parameter MaxArraySize.',
            },
            "account": {
                'title': "account",
                "type":"string",
                "enum": user_accounts,
                'description': 'Charge resources used by this job to specified account. \
                    The account is an arbitrary string. The account name may be \
                    changed after job submission using the scontrol command.',
            },
            "begin": {
                "title": "begin",
                "type": "string",
                "pattern": "^(2[0-3]|[01][0-9]):[0-5][0-9]$",
                'description': 'Submit the batch script to the SLURM controller \
                    immediately, like normal, but tell the controller to defer \
                    the allocation of the job until the specified time. Time may \
                    be of the form HH:MM:SS to run a job at a specific time of \
                    day (seconds are optional). (If that time is already past, \
                    the next day is assumed.) You may also specify midnight, noon, \
                    fika (3 PM) or teatime (4 PM) and you can have a time-of-day \
                    suffixed with AM or PM for running in the morning or the \
                    evening. You can also say what day the job will be run, by \
                    specifying a date of the form MMDDYY or MM/DD/YY YYYY-MM-DD. \
                    Combine date and time using the following format YYYY-MM-DD[THH:MM[:SS]]. \
                    You can also give times like now + count time-units, where the \
                    time-units can be seconds (default), minutes, hours, days, or \
                    weeks and you can tell SLURM to run the job today with the \
                    keyword today and to run the job tomorrow with the keyword \
                    tomorrow. The value may be changed after job submission using \
                    the scontrol command. For example: --begin=16:00 , --begin=now+1hour, \
                    --begin=now+60 (seconds by default), --begin=2016-01-20T12:34:00, \
                    Notes on date/time specifications: - Although the \'seconds\' \
                    field of the HH:MM:SS time specification is allowed by the code, \
                    note that the poll time of the SLURM scheduler is not precise \
                    enough to guarantee dispatch of the job on the exact second. \
                    The job will be eligible to start on the next poll following \
                    the specified time. The exact poll interval depends on the \
                    SLURM scheduler (e.g., 60 seconds with the default sched/builtin).- \
                    If no time (HH:MM:SS) is specified, the default is (00:00:00). - \
                    If a date is specified without a year (e.g., MM/DD) then the \
                    current year is assumed, unless the combination of MM/DD and \
                    HH:MM:SS has already passed for that year, in which case the \
                    next year is used.',
            },
            "checkpoint": {
                "title": "checkpoint",
                "type": "string",
                "pattern": "^(2[0-3]|[01][0-9]):[0-5][0-9]$",
            },
            "checkpoint-dir": {
                "title": "checkpoint-dir",
                "type": "string",
                "pattern": "^([.a-zA-Z0-9_-]*)\\/(([a-zA-Z0-9_-]+\\//?)*)$",
            },
            "cpu-per-task": {
                "title": "cpu-per-task",
                "type": "integer",
                "minimum":1,
                "maximum":100
            },
            "workdir": {
                "title": "workdir",
                "type": "string",
                "pattern": "^([.a-zA-Z0-9_-]*)\\/(([a-zA-Z0-9_-]+\\//?)*)$",
            },
            "error": {
                "title": "error",
                "type": "string",
                "pattern": "^([a-zA-Z0-9_-]|%[AajNu])+\\.[a-zA-Z]+$",
            },
            "export": {
                "title": "export",
                "type": "string",
                "pattern": "^(ALL|NONE)$",
            },
            "export-file": {
                "title": "export-file",
                "type": "string",
                "pattern": "^[.a-zA-Z0-9_-]+$",
            },
            "nodefile": {
                "title": "nodefile",
                "type": "string",
                "pattern": "^([.a-zA-Z0-9_-]*)\\/(([a-zA-Z0-9_-]+\\/?)*)[.a-zA-Z0-9_-]+$",
            },
            "get-user-env": {
                "title": "get-user-env",
                "type": "string",
                "pattern": "^(\\d*[SL]?)$|^([nN]o[\\s\\-][oO]ptions?)$",
            },
            "immediate": {
                "title": "immediate",
                "type": "boolean",
            },
            "input": {
                "title": "input",
                "type": "string",
                "pattern": "^([a-zA-Z0-9_-]|%[AajNu])+\\.[a-zA-Z]+$",
            },
            "job-name": {
                "title": "job-name",
                "type": "string",
                "pattern": "^[.a-zA-Z0-9_-]+$",
            },
            "jobid": {
                "title": "jobid",
                "type": "number",
                "minimum": 0,
            },
            "no-kill": {
                "title": "no-kill",
                "type": "boolean",
            },
            "licenses": {
                "title": "licenses",
                "type": "string",
                "pattern": "^[0-9a-zA-Z]+(@[.a-zA-Z0-9]+)?(:[0-9]+)?(,[0-9a-zA-Z]+(@[.a-zA-Z0-9]+)?(:[0-9]+)?)*$",
            },
            "mail-type": {
                "title": "mail-type",
                "type": "string",
                "pattern": "^(BEGIN|END|FAIL|REQUEUE|TIME_LIMIT(_[589]0)*)$",
            },
            "mail-user": {
                "title": "mail-user",
                "type": "string",
            },
            "mem": {
                "title": "mem",
                "type": "number",
                "minimum":1,
                "maximum":1000
            },
            "mem-per-cpu": {
                "title": "mem-per-cpu",
                "type": "number",
                "minimum":1,
                "maximum":1000
            },
            "nodes": {
                "title": "nodes",
                "type": "number",
                "minimum":1,
                "maximum":1000
            },
            "no-requeue": {
                "title": "no-requeue",
                "type": "boolean",
            },
            "output": {
                "title": "output",
                "type": "string",
                "pattern": "^(\/(.+)+\/)*(\w+)(\.(\w+))*",
            },
            "qos": {
                "title": "qos",
                "type": "string",
                "pattern": "^(janus(-long|-debug)?|himem|crestone|gpu)$",
                "readonly": True,
            },
            "requeue": {
                "title": "requeue",
                "type": "boolean",
            },
            "time": {
                "title": "time",
                "type": "string",
                "pattern": "^([0-9]{2}-)?(([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]$",
            },
        }
    }

FORM_CONFIG = {
    # [<str: feature1>, <str: feature2>]
    'features': [],
    # [(<str: gname>, <str: type>, <int (optional): count>), ...]
    'gres': [],
    # Site-specific config to patch base schema with (can be None)
    'overrides': {
        # Key off of (<str: qos>, <str: partition>)
        ('janus-debug',None): {
            # Form is prepopulated with these fields/values (can be None)
            defaults: {
                'nodes': 1,
                'time': '00:01:00',
            },
            # Schema overrides (can be None)
            'schema': {
                "properties": {
                    "time": {
                        "pattern": "^(00\\-)?(((00):[0-5][0-9]:[0-5][0-9])|(01:00:00))$",
                    },
                },
            }
        }
    },
}

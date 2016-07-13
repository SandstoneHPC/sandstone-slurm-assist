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
        'schedule.service.js',
        'schedule.controller.js',
        'status.service.js',
        'status.controller.js',
        'sa-duration.directive.js',
        'sa-assistform.directive.js',
        'sa-sbatchscript.directive.js',
        'typeaheadfocus.directive.js',
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
	user_accounts = ["example account"]

BASE_CONFIG = {
        "type": "object",
        "title": "SlurmConfig",
        "properties": {
            "account": {
                'title': "account",
                "type":"string",
                "enum": user_accounts,
                'description': 'Charge resources used by this job to specified account. The account is an arbitrary string. The account name may be changed after job submission using the scontrol command.',
            },
            # "acct-freq": {
            #     "title": "acct-freq",
            #     "type": "string",
            #     'description': '',
            # },
            "array": {
                "title": "array",
                "type": "string",
                "pattern": "^((\d+-)?(\d+:)?(\d+%)?\d+,)*((\d+-)?(\d+:)?(\d+%)?\d+)$",
                'description': 'Submit a job array, multiple jobs to be executed with identical parameters. The indexes specification identifies what array index values should be used. Multiple values may be specified using a comma separated list and/or a range of values with a "-" separator. For example, "--array=0-15" or "--array=0,6,16-32". A step function can also be specified with a suffix containing a colon and number. For example, "--array=0-15:4" is equivalent to "--array=0,4,8,12". A maximum number of simultaneously running tasks from the job array may be specified using a "%" separator. For example "--array=0-15%4" will limit the number of simultaneously running tasks from this job array to 4. The minimum index value is 0. the maximum value is one less than the configuration parameter MaxArraySize.',
            },
            "begin": {
                "title": "begin",
                "type": "string",
                'description': 'Submit the batch script to the SLURM controller immediately, like normal, but tell the controller to defer the allocation of the job until the specified time. Time may be of the form HH:MM:SS to run a job at a specific time of day (seconds are optional). (If that time is already past, the next day is assumed.) You may also specify midnight, noon, fika (3 PM) or teatime (4 PM) and you can have a time-of-day suffixed with AM or PM for running in the morning or the evening. You can also say what day the job will be run, by specifying a date of the form MMDDYY or MM/DD/YY YYYY-MM-DD. Combine date and time using the following format YYYY-MM-DD[THH:MM[:SS]]. You can also give times like now + count time-units, where the time-units can be seconds (default), minutes, hours, days, or weeks and you can tell SLURM to run the job today with the keyword today and to run the job tomorrow with the keyword tomorrow. The value may be changed after job submission using the scontrol command. For example: --begin=16:00 , --begin=now+1hour, --begin=now+60 (seconds by default), --begin=2016-01-20T12:34:00, Notes on date/time specifications: - Although the \'seconds\' field of the HH:MM:SS time specification is allowed by the code, note that the poll time of the SLURM scheduler is not precise enough to guarantee dispatch of the job on the exact second. The job will be eligible to start on the next poll following the specified time. The exact poll interval depends on the SLURM scheduler (e.g., 60 seconds with the default sched/builtin).- If no time (HH:MM:SS) is specified, the default is (00:00:00). - If a date is specified without a year (e.g., MM/DD) then the current year is assumed, unless the combination of MM/DD and HH:MM:SS has already passed for that year, in which case the next year is used.',
            },
            "checkpoint": {
                "title": "checkpoint",
                "type": "string",
                "subtype": "duration",
                "pattern": "^(\d+-)?(\d+:)?(\d+:)?(\d+)$",
                'description': 'Specifies the interval between creating checkpoints of the job step. By default, the job step will have no checkpoints created. Acceptable time formats include "minutes", "minutes:seconds", "hours:minutes:seconds", and "days-hours:minutes:seconds".',
            },
            "checkpoint-dir": {
                "title": "checkpoint-dir",
                "type": "string",
                "pattern": "^(\/.*\/)*(.*)(\/)?$",
                'description': 'Specifies the directory into which the job or job step\'s checkpoint should be written (used by the checkpoint/blcrm and checkpoint/xlch plugins only). The default value is the current working directory. Checkpoint files will be of the form "<job_id>.ckpt" for jobs and "<job_id>.<step_id>.ckpt" for job steps.',
            },
            "cluster": {
                "title": "cluster",
                "type": "string",
                "description": 'Cluster to issue commands to.',
            },
            "cpu-per-task": {
                "title": "cpu-per-task",
                "type": "integer",
                "minimum":1,
                'description': 'Advise the SLURM controller that ensuing job steps will require ncpus number of processors per task. Without this option, the controller will just try to allocate one processor per task. For instance, consider an application that has 4 tasks, each requiring 3 processors. If our cluster is comprised of quad-processors nodes and we simply ask for 12 processors, the controller might give us only 3 nodes. However, by using the --cpus-per-task=3 options, the controller knows that each task requires 3 processors on the same node, and the controller will grant an allocation of 4 nodes, one for each of the 4 tasks.',
            },
            "error": {
                "title": "error",
                "type": "string",
                'description': 'Instruct SLURM to connect the batch script\'s standard error directly to the file name specified in the "filename pattern". By default both standard output and standard error are directed to the same file. For job arrays, the default file name is "slurm-%A_%a.out", "%A" is replaced by the job ID and "%a" with the array index. For other jobs, the default file name is "slurm-%j.out", where the "%j" is replaced by the job ID. See the --input option for filename specification options.',
            },
            "export": {
                "title": "export",
                "type": "string",
                "pattern": "^((.+)=(.+),)*((.+)=(.+))$",
                'description': 'Identify which environment variables are propagated to the batch job. Multiple environment variable names should be comma separated. Environment variable names may be specified to propagate the current value of those variables (e.g. "--export=EDITOR") or specific values for the variables may be exported (e.g.. "--export=EDITOR=/bin/vi") in addition to the environment variables that would otherwise be set. This option particularly important for jobs that are submitted on one cluster and execute on a different cluster (e.g. with different paths). By default all environment variables are propagated. If the argument is NONE or specific environment variable names, then the --get-user-env option will implicitly be set to load other environment variables based upon the user\'s configuration on the cluster which executes the job.',
            },
            "export-file": {
                "title": "export-file",
                "type": "string",
                'description': 'If a number between 3 and OPEN_MAX is specified as the argument to this option, a readable file descriptor will be assumed (STDIN and STDOUT are not supported as valid arguments). Otherwise a filename is assumed. Export environment variables defined in <filename> or read from <fd> to the job\'s execution environment. The content is one or more environment variable definitions of the form NAME=value, each separated by a null character. This allows the use of special characters in environment definitions.',
            },
            "get-user-env": {
                "title": "get-user-env",
                "type": "string",
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
                'description': 'Instruct SLURM to connect the batch script\'s standard input directly to the file name specified in the "filename pattern". By default, "/dev/null" is open on the batch script\'s standard input and both standard output and standard error are directed to a file of the name "slurm-%j.out", where the "%j" is replaced with the job allocation number, as described below. The filename pattern may contain one or more replacement symbols, which are a percent sign "%" followed by a letter (e.g. %j). Supported replacement symbols are: %A:Job array\'s master job allocation number. %a:Job array ID (index) number. %j:Job allocation number.%N:Node name. Only one file is created, so %N will be replaced by the name of the first node in the job, which is the one that runs the script.%u:User name.',
            },
            "job-name": {
                "title": "job-name",
                "type": "string",
                "pattern": "^\S*$",
                'description': 'Specify a name for the job allocation. The specified name will appear along with the job id number when querying running jobs on the system. The default is the name of the batch script, or just "sbatch" if the script is read on sbatch\'s standard input.',
            },
            "licenses": {
                "title": "licenses",
                "type": "string",
                'description': 'Specification of licenses (or other resources available on all nodes of the cluster) which must be allocated to this job. License names can be followed by a colon and count (the default count is one). Multiple license names should be comma separated (e.g. "--licenses=foo:4,bar"). To submit jobs using remote licenses, those served by the slurmdbd, specify the name of the server providing the licenses. For example "--license=nastran@slurmdb:12".',
            },
            "mail-type": {
                "title": "mail-type",
                "type": "string",
                "pattern": "^((BEGIN|END|FAIL|REQUEUE|ALL|TIME_LIMIT(_[589]0)?),)*(BEGIN|END|FAIL|REQUEUE|ALL|TIME_LIMIT(_[589]0)?)$",
                'description': 'Notify user by email when certain event types occur. Valid type values are BEGIN, END, FAIL, REQUEUE, ALL (equivalent to BEGIN, END, FAIL and REQUEUE), TIME_LIMIT, TIME_LIMIT_90 (reached 90 percent of time limit), TIME_LIMIT_80 (reached 80 percent of time limit), and TIME_LIMIT_50 (reached 50 percent of time limit). Multiple type values may be specified in a comma separated list. The user to be notified is indicated with --mail-user.',
            },
            "mail-user": {
                "title": "mail-user",
                "type": "string",
                'description': 'User to receive email notification of state changes as defined by --mail-type. The default value is the submitting user.',
            },
            "mem": {
                "title": "mem",
                "type": "number",
                "minimum":1,
                'description': 'Specify the real memory required per node in MegaBytes. Default value is DefMemPerNode and the maximum value is MaxMemPerNode. If configured, both parameters can be seen using the scontrol show config command. This parameter would generally be used if whole nodes are allocated to jobs (SelectType=select/linear). Also see --mem-per-cpu. --mem and --mem-per-cpu are mutually exclusive. NOTE: A memory size specification is treated as a special case and grants the job access to all of the memory on each node. NOTE: Enforcement of memory limits currently relies upon the task/cgroup plugin or enabling of accounting, which samples memory use on a periodic basis (data need not be stored, just collected). In both cases memory use is based upon the job\'s Resident Set Size (RSS). A task may exceed the memory limit until the next periodic accounting sample.',
            },
            "mem-per-cpu": {
                "title": "mem-per-cpu",
                "type": "number",
                "minimum":1,
                'description': 'Mimimum memory required per allocated CPU in MegaBytes. Default value is DefMemPerCPU and the maximum value is MaxMemPerCPU (see exception below). If configured, both parameters can be seen using the scontrol show config command. Note that if the job\'s --mem-per-cpu value exceeds the configured MaxMemPerCPU, then the user\'s limit will be treated as a memory limit per task; --mem-per-cpu will be reduced to a value no larger than MaxMemPerCPU; --cpus-per-task will be set and the value of --cpus-per-task multiplied by the new --mem-per-cpu value will equal the original --mem-per-cpu value specified by the user. This parameter would generally be used if individual processors are allocated to jobs (SelectType=select/cons_res). If resources are allocated by the core, socket or whole nodes; the number of CPUs allocated to a job may be higher than the task count and the value of --mem-per-cpu should be adjusted accordingly. Also see --mem. --mem and --mem-per-cpu are mutually exclusive.',
            },
            "no-kill": {
                "title": "no-kill",
                "type": "boolean",
                'description': 'Do not automatically terminate a job if one of the nodes it has been allocated fails. The user will assume the responsibilities for fault-tolerance should a node fail. When there is a node failure, any active job steps (usually MPI jobs) on that node will almost certainly suffer a fatal error, but with --no-kill, the job allocation will not be revoked so the user may launch new job steps on the remaining nodes in their allocation. By default SLURM terminates the entire job allocation if any node fails in its range of allocated nodes.',
            },
            "nodes": {
                "title": "nodes",
                "type": "number",
                "minimum":1,
                'description': 'Request that a minimum of minnodes nodes be allocated to this job. A maximum node count may also be specified with maxnodes. If only one number is specified, this is used as both the minimum and maximum node count. The partition\'s node limits supersede those of the job. If a job\'s node limits are outside of the range permitted for its associated partition, the job will be left in a PENDING state. This permits possible execution at a later time, when the partition limit is changed. If a job node limit exceeds the number of nodes configured in the partition, the job will be rejected. Note that the environment variable SLURM_NNODES will be set to the count of nodes actually allocated to the job. See the ENVIRONMENT VARIABLES section for more information. If -N is not specified, the default behavior is to allocate enough nodes to satisfy the requirements of the -n and -c options. The job will be allocated as many nodes as possible within the range specified and without delaying the initiation of the job. The node count specification may include a numeric value followed by a suffix of "k" (multiplies numeric value by 1,024) or "m" (multiplies numeric value by 1,048,576).',
            },
            "no-requeue": {
                "title": "no-requeue",
                "type": "boolean",
                'description': 'Specifies that the batch job should not be requeued after node failure. Setting this option will prevent system administrators from being able to restart the job (for example, after a scheduled downtime). When a job is requeued, the batch script is initiated from its beginning. Also see the --requeue option. The JobRequeue configuration parameter controls the default behavior on the cluster.',
            },
            "nodefile": {
                "title": "nodefile",
                "type": "string",
                "pattern": "^(\/.*\/)*(.*)(\/)?$",
                'description': 'Much like --nodelist, but the list is contained in a file of name node file. The node names of the list may also span multiple lines in the file. Duplicate node names in the file will be ignored. The order of the node names in the list is not important; the node names will be sorted by SLURM.',
            },
            "output": {
                "title": "output",
                "type": "string",
                "pattern": "^(\/.*\/)*(.*)(\/)?$",
                'description': 'Instruct SLURM to connect the batch script\'s standard output directly to the file name specified in the "filename pattern". By default both standard output and standard error are directed to the same file. For job arrays, the default file name is "slurm-%A_%a.out", "%A" is replaced by the job ID and "%a" with the array index. For other jobs, the default file name is "slurm-%j.out", where the "%j" is replaced by the job ID. See the --input option for filename specification options.',
            },
            "partition": {
                "title": "partition",
                "type": "string",
                'description': 'Request a specific partition for the resource allocation. If not specified, the default behavior is to allow the slurm controller to select the default partition as designated by the system administrator. If the job can use more than one partition, specify their names in a comma separate list and the one offering earliest initiation will be used with no regard given to the partition name ordering (although higher priority partitions will be considered first). When the job is initiated, the name of the partition used will be placed first in the job record partition string.',
            },
            "qos": {
                "title": "qos",
                "type": "string",
                'description': "Request a quality of service for the job. QOS values can be defined for each user/cluster/account association in the Slurm database. Users will be limited to their association's defined set of qos's when the Slurm configuration parameter, AccountingStorageEnforce, includes 'qos' in it's definition.",
            },
            "requeue": {
                "title": "requeue",
                "type": "boolean",
                'description': 'Specifies that the batch job should eligible to being requeue. The job may be requeued explicitly by a system administrator, after node failure, or upon preemption by a higher priority job. When a job is requeued, the batch script is initiated from its beginning. Also see the --no-requeue option. The JobRequeue configuration parameter controls the default behavior on the cluster.',
            },
            "time": {
                "title": "time",
                "type": "string",
                "subtype": "duration",
                "pattern": '^(\d+-)?(\d+):(\d+):(\d+)$',
                "minDuration": 0,
                'description': 'Set a limit on the total run time of the job allocation. If the requested time limit exceeds the partition\'s time limit, the job will be left in a PENDING state (possibly indefinitely). The default time limit is the partition\'s default time limit. When the time limit is reached, each task in each job step is sent SIGTERM followed by SIGKILL. The interval between signals is specified by the SLURM configuration parameter KillWait. A time limit of zero requests that no time limit be imposed. Acceptable time formats are "DD-HH:MM:SS" or "HH:MM:SS".',
            },
            "workdir": {
                "title": "workdir",
                "type": "string",
                "pattern": "^(\/)?(.*\/)*(.*)(\/)?$",
                'description': 'Set the working directory of the batch script to directory before it is executed. The path can be specified as full path or relative path to the directory where the command is executed.',
            },
        }
    }

FORM_CONFIG = {
    # [<str: feature1>, <str: feature2>]
    'features': [],
    # [(<str: gname>, <str: type>, <int (optional): count>), ...]
    'gres': [],
    # Site-specific queue config
    'profiles': {
        # Key off of <str: profile_name>
    },
}

import os

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
        'bower_components/tv4/tv4.js',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'bower_components/objectpath/lib/ObjectPath.js',
        'bower_components/angular-schema-form/dist/schema-form.js',
        'bower_components/angular-schema-form-bootstrap/bootstrap-decorator.min.js',
        'bower_components/angular-smart-table/dist/smart-table.min.js',
    ),
}

BASE_CONFIG = {
        "type": "object",
        "title": "SlurmConfig",
        "properties": {
            "array": {
                "title": "array",
                "type": "string",
                "pattern": "^\\d+$|^(\\d+-\\d+)(:\\d+)?$",
            },
            "account": {
                'title': "account",
                "type":"string",
                "pattern": "^\\S+@\\S+$",
            },
            "begin": {
                "title": "begin",
                "type": "string",
                "pattern": "^(2[0-3]|[01][0-9]):[0-5][0-9]$",
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
                "type": "string",
                "pattern": "^[0-9]+$",
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
                "pattern": "^([a-zA-Z0-9_-]|%[AajNu])+\\.[a-zA-Z]+$",
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

FORM_CONFIGS = {
    'janus': {
        "properties": {
            "nodes": {
                "maximum":480
            },
            "time": {
                "pattern": "^(((00\\-)?(([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9])|(01\\-00:00:00))$"
            }
        },
        "required": [
            "nodes",
        ]
    },
    'janus-long': {
        "properties": {
            "nodes": {
                "maximum":40
            },
            "time": {
                "pattern": "^(((0[0-6]\\-)?(([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9])|(07\\-00:00:00))$"
            }
        },
        "required": [
            "nodes",
        ]
    },
    'janus-debug': {
        "properties": {
            "time": {
                "pattern": "^(00\\-)?(((00):[0-5][0-9]:[0-5][0-9])|(01:00:00))$",
            },
        },
    },
    'himem': {
        "properties": {
            "time": {
                "pattern": "^(((((0[0-9])|(1[0-3]))\\-)?(([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9])|(14\\-00:00:00))$"
            }
        }
    },
    'crestone': {
        "properties": {
            "nodes": {
                "maximum": 10
            },
            "time": {
                "pattern": "^(((((0[0-9])|(1[0-3]))\\-)?(([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9])|(14\\-00:00:00))$"
            }
        }
    },
    'gpu': {
        "properties": {
            "time": {
                "pattern": "^(00\\-)?((0[1-3]:[0-5][0-9]:[0-5][0-9])|(04:00:00))$",
            }
        }
    }
}

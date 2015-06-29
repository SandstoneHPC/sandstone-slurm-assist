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
        'bower_components/api-check/dist/api-check.min.js',
        'bower_components/angular-formly/dist/formly.min.js',
    ),
}

FORM_CONFIG = {
    'configs': {
        'janus': {
            'nodes': (1,480),
            'time': (1,3600*24),
        },
        'janus-long': {
            'nodes': (1,40),
            'time': (1,3600*24*7),
        },
        'janus-debug': {
            'nodes': (1,1),
            'time': (1,3600),
        },
        'himem': {
            'nodes': (1,1),
            'time': (1,3600*24*14),
        },
        'crestone': {
            'nodes': (1,10),
            'time': (1,3600*24*14),
        },
        'gpu': {
            'nodes': (1,1),
            'time': (1,3600*4),
        }
    }
}

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
    ),
}

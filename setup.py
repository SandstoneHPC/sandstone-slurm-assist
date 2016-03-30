# -*- coding: utf-8 -*-
from distutils.core import setup
from setuptools import find_packages

setup(
    name='oide-slurm-assist',
    version='0.7.3',
    author=u'Zebula Sampedro',
    author_email='sampedro@colorado.edu',
    packages=find_packages(),
    include_package_data=True,
    url='https://github.com/ResearchComputing/oide-slurm-assist',
    license='MIT, see LICENSE',
    description="Online Integrated Development Environment (OIDE) - Slurm Assist App",
    long_description=open('DESCRIPTION.rst').read(),
    zip_safe=False,
    install_requires=[
        'oide',
        'jsonschema>=2.5.1',
    ],
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'Natural Language :: English',
        'Operating System :: Unix',
        'Topic :: Software Development :: User Interfaces',
        'Topic :: Software Development :: Build Tools',
        'Topic :: Text Editors :: Integrated Development Environments (IDE)',
        'Topic :: Terminals :: Terminal Emulators/X Terminals',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: JavaScript',
    ],
)

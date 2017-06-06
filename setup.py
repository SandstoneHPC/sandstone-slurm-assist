# -*- coding: utf-8 -*-
from distutils.core import setup
from setuptools import find_packages

setup(
    name='sandstone-slurm-assist',
    version='0.11.0',
    author=u'Zebula Sampedro',
    author_email='sampedro@colorado.edu',
    packages=find_packages(),
    include_package_data=True,
    url='https://github.com/SandstoneHPC/sandstone-slurm-assist',
    license='MIT, see LICENSE',
    description="Sandstone HPC - Slurm Assist App",
    long_description=open('DESCRIPTION.rst').read(),
    zip_safe=False,
    install_requires=[
        'sandstone>=1.1.0',
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

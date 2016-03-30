# oide-slurm-assist
Slurm scheduler assist app for the OIDE. Currently, this app is set up to handle the particular Slurm configuration employed by Research Computing. Generalization is a work-in-progress.

## Installing OIDE Slurm Assist using PIP

To install OIDE Slurm Assist using PIP, run:
```
pip install oide-slurm-assist
```

Now, add `oideslurm` to the `INSTALLED_APPS` settings tuple in your `oide_settings.py` file.

The OIDE, which will now include the OIDE Slurm Assist app, can now be run with the following command:
```
oide
```
To use the OIDE with Slurm Assist, point your browser to `localhost:8888`.


## Installing OIDE Slurm Assist from source

The OIDE Slurm Assist requires that you first install [The OIDE](https://github.com/ResearchComputing/OIDE)

Once the OIDE is installed, clone the OIDE Slurm Assist repository and enter the project directory:
```
git clone https://github.com/ResearchComputing/oide-slurm-assist.git
cd oide-slurm-assist
```
Install the python package (a virtualenv is recommended):
```
python setup.py install
```

Now, add `oideslurm` to the `INSTALLED_APPS` settings tuple in your `oide_settings.py` file.

The OIDE, which will now include the OIDE Slurm Assist app, can now be run with the following command:
```
oide
```
To use the OIDE, point your browser to `localhost:8888`.

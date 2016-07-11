# sandstone-slurm-assist
Slurm scheduler assist app for Sandstone HPC.

## Installing Sandstone HPC Slurm Assist using PIP

To install Sandstone HPC Slurm Assist using PIP, run:
```
pip install sandstone-slurm-assist
```

Now, add `sandstone_slurm` to the `INSTALLED_APPS` settings tuple in your `sandstone_settings.py` file.

Sandstone HPC, which will now include the Slurm Assist app, can now be run with the following command:
```
sandstone
```
To use Sandstone HPC with Slurm Assist, point your browser to `localhost:8888`.


## Installing Slurm Assist from source

Slurm Assist requires that you first install [Sandstone IDE](https://github.com/SandstoneHPC/sandstone-ide)

Once the Sandstone IDE is installed, clone the Slurm Assist repository and enter the project directory:
```
git clone https://github.com/SandstoneHPC/sandstone-slurm-assist.git
cd sandstone-slurm-assist
```
Install the python package (a virtualenv is recommended):
```
python setup.py install
```

Now, add `sandstone_slurm` to the `INSTALLED_APPS` settings tuple in your `sandstone_settings.py` file.

Sandstone IDE, which will now include the Slurm Assist app, can now be run with the following command:
```
sandstone
```
To use Sandstone IDE, point your browser to `localhost:8888`.

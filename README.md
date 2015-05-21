# oide-slurm-assist
Slurm scheduler assist app for the OIDE.

**Installing OIDE Slurm Assist**

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
The OIDE, which will now include the OIDE Slurm Assist app, can now be run with the following command:
```
oide
```
To use the OIDE, point your browser to `localhost:8888`.

import sandstone_slurm.settings as app_settings
import copy
import json
from jsonschema import Draft4Validator



class ConfigLoader:

    @staticmethod
    def getFormConfig():
        base_schema = app_settings.BASE_CONFIG
        Draft4Validator.check_schema(base_schema)
        form_config = app_settings.FORM_CONFIG

        full_config = {}
        feat = form_config.get('features',[])
        gres = form_config.get('gres',[])
        # profiles must be defined
        profiles = form_config.get('profiles')

        full_config['features'] = feat
        full_config['gres'] = gres
        full_config['profiles'] = {}

        for k,v in profiles.iteritems():
            full_config['profiles'][k] = {}
            temp = copy.deepcopy(base_schema)
            if 'initial' in v:
                full_config['profiles'][k]['initial'] = v['initial']
            if 'schema' in v:
                try:
                    temp['required'] = v['schema']['required']
                except KeyError:
                    pass

                try:
                    for pk,pv in v['schema']['properties'].iteritems():
                        temp['properties'][pk].update(pv)
                except KeyError:
                    pass

            Draft4Validator.check_schema(temp)
            full_config['profiles'][k]['schema'] = temp

        return full_config

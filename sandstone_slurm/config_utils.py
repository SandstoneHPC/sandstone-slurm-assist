import sandstone_slurm.settings as app_settings
import copy
import json
from jsonschema import Draft4Validator



class ConfigLoader:

    @staticmethod
    def getFormConfigs():
        base_schema = app_settings.BASE_CONFIG
        Draft4Validator.check_schema(base_schema)
        form_configs = app_settings.FORM_CONFIGS

        applied = {}
        for k,v in form_configs.iteritems():
            temp = copy.deepcopy(base_schema)
            try:
                temp['required'] = v['required']
            except KeyError:
                pass

            for pk,pv in v['properties'].iteritems():
                temp['properties'][pk].update(pv)
            applied[k] = temp

        return applied

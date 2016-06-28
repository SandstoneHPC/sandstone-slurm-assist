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
        # Queues must be defined
        queues = form_config.get('queues')

        full_config['features'] = feat
        full_config['gres'] = gres
        full_config['queues'] = {}

        for k,v in queues.iteritems():
            temp = copy.deepcopy(base_schema)
            if 'defaults' in v:
                full_config['queues'][k]['defaults'] = v['defaults']
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
            full_config['queues'][k]['schema'] = temp

        return full_config

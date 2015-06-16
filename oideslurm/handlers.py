import tornado.web


import oide.lib.decorators
import oideslurm.settings as app_settings
from oide.lib.handlers.base import BaseHandler



class FormConfigHandler(BaseHandler):

    @oide.lib.decorators.authenticated
    def get(self):
            ctx = {
                'formConfig': app_settings.FORM_CONFIG['configs']
                }
            self.write(ctx)

#!/bin/bash

# Uses i18next-conv <http://i18next.com/pages/ext_i18next-conv.html>.
# Parameters:
#     * locale name

locale_name=$1

i18next-conv -l $locale_name -s i18n/po/app/$locale_name.po -t sources/static/locale/$locale_name/app.json

xbus_monitor_js
===============

Web application to manage Xbus.


REST communication
------------------

xbus_monitor_js communicates with xbus_monitor via the REST API the latter exposes.


Translations
------------

Translations are handled by i18next <http://i18next.com/>.

Localization files are served from static/locale/[locale]/[namespace].json.

To convert i18next translation files to / from gettext, use i18next-conv
<http://i18next.com/pages/ext_i18next-conv.html>::

    npm install i18next-conv -g

And the helpers scripts provided in the "i18n" directory::

    i18n/json-to-po.sh en-US
    i18n/po-to-json.sh en-US

Gettext translation files are available in the "i18n/po" directory; they are to be updated via
i18next-conv.

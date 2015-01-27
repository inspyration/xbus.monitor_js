/* Inspired by several sources; the best of which is
 * <https://github.com/ccoenraets/directory-backbone-bootstrap>. */

// Where the REST API is located.
var API_PREFIX = '/api/';

// Where login URLs are located.
var LOGIN_URL = '/login';
var LOGIN_INFO_URL = '/login_info'
var LOGOUT_URL = '/logout';

// Used to propagate binary data across callbacks at form validation.
var binary_form_data = null;

// ID of the consumer the user has opened the data clearing interface of.
var clearing_consumer = null;

// Used to get back to the previous page after logging in.
var login_referrer = null;

// Usual backbone elements.
var Models = {}; // model classes.
var Collections = {}; // collection classes.
var collections = {}; // collection instances (which contain model instances).
var router = null; // backbone.js router; can be used to navigate across pages.
var Templates = {}; // Template functions, ready to be called with the right
// parameters.
var Views = {}; // view classes.

function closeDataClearing() {
    /* Close the data clearing interface and get back to the consumer list. */

    clearing_consumer = null;

    $('#data_clearing_menu > ul > li').not('#data_clearing_menu_consumers')
        .hide();

    router.navigate('consumer?clearing', {
        trigger: true
    });
}

function colTemplate(collection, view_type) {
    /* Where collection templates are located. */

    return 'collection_' + view_type + 's/' + collection;
}

function createRelModel(collection, id, rel, rel_collection) {
    /* Helper for collections related to other collections. */

    var url = collection + '/' + id + '/' + rel;
    var rel_model = Backbone.Model.extend({
        urlRoot: API_PREFIX + url
    });
    var rel_collection_class = Backbone.Collection.extend({
        model: rel_model,
        name: collection,
        rel_name: rel_collection,
        url: API_PREFIX + url
    });
    return new rel_collection_class();
}

function disableView(view) {
    /*
     * Avoid calling the "remove" function (creates strange issues) but at least
     * ensure the view no longer catches any event.
     */

    view.stopListening();
    view.undelegateEvents();
    if (view.removeReferences) {
        view.removeReferences();
    }
}

function login() {
    /*
     * Call the login URL then either show the login form or redirect to the
     * provided URL.
     */

    $.ajax(LOGIN_URL + '?login_referrer=' + encodeURIComponent(location.href),
        {
            dataType: 'json',
            success: function(data) {
                login_url = data['login_url'];
                if (login_url) {
                    location = login_url;
                } else {
                    openLoginForm();
                }
            }
        });
}

function logout() {
    /* Call the logout URL then update the login bar. */

    $.ajax(LOGOUT_URL, {
        dataType: 'json',
        success: function(data) {

            if (data['auth_kind'] == 'http') {
                $.ajaxSetup({
                    beforeSend: function(xhr) {
                        // Empty on purpose. Don't add auth headers.
                    }
                });
            }

            updateLoginInfo();
        }
    });
}

function openDataClearing(consumer_id) {
    /* Initiate data clearing for the specified Xbus consumer. */

    clearing_consumer = consumer_id;

    $('#data_clearing_menu > ul > li').not('#data_clearing_menu_consumers')
        .show();

    router.navigate('cl_item', {
        trigger: true
    });
}

function openLoginForm() {
    /* Show a login form then redirect back to the current page. */

    login_referrer = location.hash;
    if (_.size(login_referrer) > 1) {
        login_referrer = login_referrer.substring(1);
    }
    router.navigate('login', {
        trigger: true
    });
}

function registerAjaxHandler() {
    /*
     * Override the default Backbone.ajax function to include the consumer ID
     * when data clearing is in effect.
     */

    Backbone.ajax = function() {
        var parameters = Array.prototype.slice.call(arguments, 0);

        if (clearing_consumer) {
            if (!parameters[0].data) {
                parameters[0].data = {};
            }
            parameters[0].data.cl_consumer = clearing_consumer;
        }

        return Backbone.$.ajax.apply(Backbone.$, parameters);
    }
}

function registerCollection(collection_options, model_options) {
    /*
     * Register new backbone collection and model types with pre-filled
     * parameters.
     */

    var name = collection_options.name;

    // Model options.
    if (!model_options) {
        model_options = {};
    }
    model_options['urlRoot'] = API_PREFIX + name;

    // Register the model type.
    Models[name] = Backbone.RelationalModel.extend(model_options);

    // Collection options.
    collection_options['model'] = Models[name];
    collection_options['state'] = {
        firstPage: 0
    }
    collection_options['url'] = function() {
        /* Apply custom URL parameters provided by the view, when needed. */
        var url = API_PREFIX + name;
        var collection = collections[name];
        var view = collection.view;
        var url_params = view ? view.url_params : null;
        if (url_params && _.size(url_params) > 0) {
            // Use URI.js to build the query string.
            // <http://medialize.github.io/URI.js/>
            url += '?' + URI.buildQuery(url_params);
        }
        return url;
    }

    // Register the collection type and an instance of it.
    Collections[name] = Backbone.PageableCollection.extend(collection_options);
    collections[name] = new Collections[name]();
}

function registerCustomSerializers() {
    /*
     * Register Backbone.Syphon input readers for types it can't handle.
     * <https://github.com/marionettejs/backbone.syphon/blob/master/apidoc.md>
     */

    // Files are pre-read before submitting forms; their result is stored in
    // "binary_form_data".
    Backbone.Syphon.InputReaders.register('file', function(node) {
        return binary_form_data[node.attr('name')];
    });
}

function registerErrorHandlers() {
    /*
     * Register error handling mechanisms for all requests initiated by
     * Backbone. These can be overridden per collection / model when needed.
     */

    function error_handler(backbone_obj, xhr) {
        switch (xhr.status) {

        case 401:
            // 401 errors are sent by the HTTP auth system. Show a login form
            // then redirect back to the current page.
            openLoginForm();
            break;

        case 403:
            // 403 errors are assumed to contain JSON data with "auth_kind" and
            // "logged_in" keys. They may concern authentication or
            // authorization.
            var response = xhr.responseJSON;
            if (response === null) {
                console.log('Invalid 403 response', xhr);
                break;
            }
            var auth_kind = response['auth_kind'];
            var logged_in = response['logged_in'];
            if (auth_kind === null || logged_in === null) {
                console.log('Invalid 403 response', xhr);
                break;
            }

            if (logged_in) {
                alert('Unauthorized.');
                break;
            }

            if (auth_kind === 'saml2') {
                // Redirect to the authentic login page.
                if (confirm('Authentication required. Open the login page?')) {
                    login();
                }

            } else {
                console.log('Unhandled 403 response', xhr);
            }
            break;
        }
    }

    Backbone.Collection.prototype.on('error', error_handler);
    Backbone.Model.prototype.on('error', error_handler);
}

function replay_envelope(envelope_id) {
    /* Attempt to send failed envelopes into Xbus again. */

    $.ajax(API_PREFIX + 'replay_envelope', {
        data: {
            'envelope_id': envelope_id
        },
        dataType: 'json',
        success: function() {
            collections.envelope.get(envelope_id).fetch();
        }
    });
}

/*
 * The main view; there can only be one. When a new one is created, the previous
 * one has to be removed.
 */
var main_view = null;
function setMainView(view_factory) {
    if (main_view) {
        disableView(main_view);
    }
    main_view = view_factory();
}

function setMenuLink(link) {
    /* Highlight the selected menu item. */

    $('.main-menu a[href="' + link + '"]').each(
        function() {
            var node = $(this);
            // Found a link; simulate clicks on its parents, from top to
            // bottom.
            $.each(node.parents('li').children('a').toArray().reverse(),
                function() {
                    var menu_node = $(this);
                    if (!menu_node.hasClass('active')
                        && !menu_node.hasClass('active-parent')) {
                        menu_node.trigger('click');
                    }
                });
        });
}

function updateLoginInfo() {
    /*
     * Call the server to retrieve information about the connected user; show /
     * hide login bars accordingly.
     */
    $.ajax(LOGIN_INFO_URL, {
        dataType: 'json',
        success: function(data) {
            var login = data.login;
            if (login) {
                $('#account_login_bar').hide();
                $('#account_login').text(data.display_name);
                $('#avatar').attr('src', data.avatar_url);
                $('#account_bar').show();
            } else {
                $('#account_bar').hide();
                $('#account_login_bar').show();
            }
        }
    });
}

// $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
// options.url = 'http://backbonejs-beginner.herokuapp.com' + options.url;
// options.url = 'http://localhost:6543' + options.url;
// });

var Router = Backbone.Router
    .extend({
        routes: {
            '': 'home',
            'login': 'login',
            'upload': 'upload',
            ':collection(?:params)': 'list',
            ':collection/create(?:params)': 'create',
            ':collection/:id': 'view',
            ':collection/:id/clear_data': 'clear_data',
            ':collection/:id/edit': 'edit',
            ':collection/:id/:rel(?:params)': 'rel_list',
            ':collection/:id/:rel/create': 'rel_create',
            ':collection/:id/graph': 'graph'
        },

        'home': function() {
            // TODO Redirect to the list view or some such?
            var collection = 'envelope';
            console.log('routing to list view', collection);
            setMainView(function() {
                return new Views.list({
                    collection: collections[collection],
                    template: Templates[colTemplate(collection, 'list')]
                });
            });
            setMenuLink('#/');
        },

        'login': function() {
            console.log('routing to the login view');
            setMainView(function() {
                return new Views.login({
                    template: Templates['login']
                });
            });
            setMenuLink('#/login');
        },

        'upload': function() {
            console.log('routing to the upload view');
            setMainView(function() {
                return new Views.upload({
                    template: Templates['upload']
                });
            });
            setMenuLink('#/upload');
        },

        'list': function(collection, params) {
            console.log('routing to list view', collection, params);
            setMainView(function() {
                return new Views.list({
                    collection: collections[collection],
                    template: Templates[colTemplate(collection, 'list')],
                    params: params
                });
            });
            setMenuLink('#/' + collection + (params ? '?' + params : ''));
        },

        'view': function(collection, id) {
            console.log('routing to record view', collection, id);
            setMainView(function() {
                return new Views.record({
                    collection: collections[collection],
                    editing: false,
                    id: id,
                    template: Templates[colTemplate(collection, 'form')]
                });
            });
            setMenuLink('#/' + collection);
        },

        'create': function(collection, params) {
            console.log('routing to record creation view', collection, params);
            setMainView(function() {
                return new Views.record({
                    collection: collections[collection],
                    editing: true,
                    params: params,
                    template: Templates[colTemplate(collection, 'form')]
                });
            });
            setMenuLink('#/' + collection + '/create');
        },

        'clear_data': function(collection, id) {
            console.log('routing to record clear_data view', collection, id);
            setMainView(function() {
                return new Views.clear_form({
                    collection: collections[collection],
                    id: id,
                    template: Templates[colTemplate(collection, 'form')]
                });
            });
            setMenuLink('#/' + collection);
        },

        'edit': function(collection, id) {
            console.log('routing to edit record view', collection, id);
            setMainView(function() {
                return new Views.record({
                    collection: collections[collection],
                    editing: true,
                    id: id,
                    template: Templates[colTemplate(collection, 'form')]
                });
            });
            setMenuLink('#/' + collection + (id ? '' : '/create'));
        },

        'rel_list': function(collection, id, rel, params) {

            if (params) {
                console.log('routing to relationship list view', collection,
                    id, rel, 'with params', params);
            } else {
                console.log('routing to relationship list view', collection,
                    id, rel);
            }

            var collection_obj = collections[collection];
            var rel_collection = collection_obj.relationships[rel];

            setMainView(function() {
                return new Views.list({
                    collection: createRelModel(collection, id, rel,
                        rel_collection),
                    id: id,
                    rel: rel,
                    template: Templates[colTemplate(collection, 'list')],
                    params: params
                });
            });
            setMenuLink('#/' + collection + (params ? '?' + params : ''));
        },

        'rel_create': function(collection, id, rel) {

            console.log('routing to relationship record view', collection, id,
                rel);

            var collection_obj = collections[collection];
            var rel_collection = collection_obj.relationships[rel];

            setMainView(function() {
                return new Views.record({
                    collection: createRelModel(collection, id, rel,
                        rel_collection),
                    id: id,
                    rel: rel,
                    template: Templates[colTemplate(collection, 'form')],
                    editing: true
                });
            });
            setMenuLink('#/' + collection);
        }
    });

$(function() {

    // Pre-load templates; start our router once that is done.

    var template_views = ['login', 'pagination', 'upload'];

    $.each(Collections, function(collection) {
        _.each(['form', 'list'], function(view_type) {
            template_views.push(colTemplate(collection, view_type));
        });
    });

    var deferreds = [];

    _.each(template_views, function(view_name) {
        deferreds.push($.get('static/templates/' + view_name + '.html',
            function(data) {
                Templates[view_name] = _.template(data);
            }, 'html'));
    });

    // In the meantime, do other setup work.
    registerAjaxHandler();
    registerCustomSerializers();
    registerErrorHandlers();
    updateLoginInfo();

    $.when.apply(null, deferreds).done(function() {
        console.log('fetched all templates; initializing i18n...');

        /* Use i18next <http://i18next.com/> to handle translations. */
        $.i18n.init({
            fallbackLng: 'en-US',
            lng: 'fr-FR', // TODO Better lang settings.
            load: 'current',
            ns: {
                defaultNs: 'app',
                namespaces: ['app']
            },
            resGetPath: 'static/locale/__lng__/__ns__.json',
            useCookie: false
        }, function() {
            console.log('i18n ready; initializing the app...');

            // Translate all strings.
            $('html').i18n();

            // Ready! Start the app.
            router = new Router();
            Backbone.history.start();
        });
    });
});

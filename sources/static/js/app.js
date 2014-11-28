/* Inspired by several sources; the best of which is
 * <https://github.com/ccoenraets/directory-backbone-bootstrap>. */

// Where the REST API is located.
var API_PREFIX = '/api/';

// Used to propagate binary data across callbacks at form validation.
var binary_form_data = null;

// Used to get back to the previous page after logging in.
var login_referrer = null;

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
            login_referrer = location.hash;
            if (_.size(login_referrer) > 1) {
                login_referrer = login_referrer.substring(1);
            }
            router.navigate('login', {
                trigger: true
            });
            break;
        case 403:
            console.log('403 denied - TODO');
            break;
        }
    }
    Backbone.Collection.prototype.on('error', error_handler);
    Backbone.Model.prototype.on('error', error_handler);
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

// $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
// options.url = 'http://backbonejs-beginner.herokuapp.com' + options.url;
// options.url = 'http://localhost:6543' + options.url;
// });

var Models = {}; // model classes.
var Collections = {}; // collection classes.
var collections = {}; // collection instances (which contain model instances).
var router = null; // backbone.js router; can be used to navigate across pages.
var Templates = {}; // Template functions, ready to be called with the right
// parameters.
var Views = {}; // view classes.

var Router = Backbone.Router
    .extend({
        routes: {
            '': 'home',
            'login': 'login',
            'upload': 'upload',
            ':collection(?:params)': 'list',
            ':collection/create': 'edit',
            ':collection/:id': 'view',
            ':collection/:id/edit': 'edit',
            ':collection/:id/:rel(?:params)': 'rel_list',
            ':collection/:id/:rel/create': 'rel_create',
            ':collection/:id/graph': 'graph'
        },

        'home': function() {
            // TODO Redirect to the list view or some such?
            var collection = 'event_type';
            console.log('routing to list view', collection);
            setMainView(function() {
                return new Views.list({
                    collection: collections[collection],
                    template: Templates[collection + '_list']
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
            if (params) {
                console.log('routing to list view', collection, 'with params',
                    params);
            } else {
                console.log('routing to list view', collection);
            }
            setMainView(function() {
                return new Views.list({
                    collection: collections[collection],
                    template: Templates[collection + '_list'],
                    params: params
                });
            });
            setMenuLink('#/' + collection);
        },

        'view': function(collection, id) {
            console.log('routing to record view', collection, id);
            setMainView(function() {
                return new Views.record({
                    collection: collections[collection],
                    editing: false,
                    id: id,
                    template: Templates[collection + '_form']
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
                    template: Templates[collection + '_form']
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
                    template: Templates[rel_collection + '_list'],
                    params: params
                });
            });
            setMenuLink('#/' + collection);
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
                    template: Templates[rel_collection + '_form'],
                    editing: true
                });
            });
            setMenuLink('#/' + collection);
        }
    });

$(function() {

    // Pre-load templates; start our router once that is done.

    var template_views = ['login', 'upload'];

    $.each(Collections, function(collection) {
        _.each(['form', 'list'], function(view_type) {
            template_views.push(collection + '_' + view_type);
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
    registerCustomSerializers();
    registerErrorHandlers();

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

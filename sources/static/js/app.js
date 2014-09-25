function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function disableView(view) {
    /*
     * Avoid calling the "remove" function (creates strange issues) but at least
     * ensure the view no longer catches any event.
     */
    view.stopListening();
    view.undelegateEvents();
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

// $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
// options.url = 'http://backbonejs-beginner.herokuapp.com' + options.url;
// options.url = 'http://localhost:6543' + options.url;
// });

var Models = {}; // model classes.
var Collections = {}; // collection classes.
var collections = {}; // collection instances (which contain model instances).
var Views = {}; // view classes.

Models.event_type = Backbone.Model.extend({
    urlRoot: '/api/event_type'
});

Collections.event_type = Backbone.Collection.extend({
    model: Models.event_type,
    name: 'event_type',

    parse: function(response) {
        console.log('collection response parse', response);
        return response.event_types;
    },

    url: '/api/event_type'
});

collections.event_type = new Collections.event_type();

Views.list = Backbone.View.extend({
    el: '.page',

    initialize: function(options) {
        console.log('listview initialize');
        this.template = options.template;
        this.render(); // Pre-render before refreshing anything.
        this.listenTo(this.collection, 'sync', this.render);
        this.collection.fetch();
    },

    render: function() {
        console.log('collection view render');
        this.$el.html(this.template({
            models: this.collection.models,
            name: this.collection.name
        }));
        return this;
    },
});

Views.record = Backbone.View.extend({
    el: '.page',
    events: {
        'submit .record-form': 'saveRecord',
        'click .delete': 'deleteRecord'
    },

    initialize: function(options) {
        console.log('record view initialize', this.id);
        this.editing = options.editing;
        this.template = options.template;
        this.render(); // Pre-render before refreshing anything.

        if (this.id) {
            this.model = this.collection.get(this.id);
            if (!this.model) {
                this.model = new this.collection.model({
                    id: this.id
                });
            }
            this.listenTo(this.model, 'sync', this.render);
            this.model.fetch();
        } else {
            this.model = null;
        }
    },

    render: function() {
        console.log('record view render', this.id);
        this.$el.html(this.template({
            editing: this.editing,
            model: this.model,
            name: this.collection.name
        }));
        return this;
    },

    saveRecord: function(ev) {
        var that = this;
        var data = $(ev.currentTarget).serializeObject();
        if (!this.model) {
            this.model = new this.collection.model();
        }
        this.model.save(data, {
            success: function() {
                console.log('record edited', that.id);
                router.navigate(that.collection.name, {
                    trigger: true
                });
            }
        });
        return false;
    },

    deleteRecord: function(ev) {
        var that = this;
        this.model.destroy({
            success: function() {
                console.log('record destroyed', that.id);
                disableView(that);
                router.navigate(that.collection.name, {
                    trigger: true
                });
            }
        });
        return false;
    }
});

var Router = Backbone.Router.extend({
    routes: {
        '': 'home',
        ':collection': 'list',
        ':collection/create': 'edit',
        ':collection/:id': 'view',
        ':collection/:id/edit': 'edit',
    },
});

var router = new Router;

router.on('route:home', function() {
    var collection = 'event_type'; // TODO Redirect to the list view or some such?
    console.log('routing to list view', collection);
    setMainView(function() {
        return new Views.list({
            collection: collections[collection],
            template: _.template($('#' + collection + '_list_template').html())
        });
    });
});
router.on('route:list', function(collection) {
    console.log('routing to list view', collection);
    setMainView(function() {
        return new Views.list({
            collection: collections[collection],
            template: _.template($('#' + collection + '_list_template').html())
        });
    });
});
router.on('route:view', function(collection, id) {
    console.log('routing to record view', collection, id);
    setMainView(function() {
        return new Views.record({
            collection: collections[collection],
            editing: false,
            id: id,
            template: _.template($('#' + collection + '_form_template').html())
        });
    });
});
router.on('route:edit', function(collection, id) {
    console.log('routing to edit record view', collection, id);
    setMainView(function() {
        return new Views.record({
            collection: collections[collection],
            editing: true,
            id: id,
            template: _.template($('#' + collection + '_form_template').html())
        });
    });
});

Backbone.history.start();

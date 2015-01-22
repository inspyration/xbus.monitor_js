Views.list = Backbone.View.extend({
    el: '#ajax-content',
    events: {
        'submit .add-select': 'addRecord',
        'click .delete': 'deleteRecord'
    },

    initialize: function(options) {
        console.log('listview initialize', this.collection);

        var that = this;

        this.url_params = options.params;
        this.filters = this.collection.default_filters;
        this.updateCollectionUrl();

        this.id = options.id;
        this.rel = options.rel;
        this.template = options.template;
        this.render(); // Pre-render before refreshing anything.
        this.collection.fetch({
            success: function() {
                that.initSync(that);
            }
        });
    },

    initSync: function(that) {
        /*
         * Called when the collection has been initially fetched. Before
         * updating the view, also fetch related models we might need.
         */

        function initDone() {
            /*
             * Ready to render! Before exiting this function, also register an
             * event listener for changes.
             */

            that.listenTo(that.collection, 'sync', that.render);
            that.render();
        }

        // First gather relational fields.
        var rel_keys = [];
        _.each(this.collection.model.prototype.relations, function(relation) {
            rel_keys.push(relation.key);
        });

        // Render immediately when there are no relational elements.
        if (_.size(rel_keys) == 0) {
            initDone();
            return;
        }

        // A counter to know when rel models have been fetched.
        // TODO Improve (with deferreds / promises)...
        // TODO Less requests using "collectionType" and different URLs (see
        // <http://backbonerelational.org/>).
        var rel_sync_count = 1;

        // Use the "getAsync" method of backbone-relational to ensure the data
        // is available.
        _.each(this.collection.models, function(model) {
            _.each(rel_keys, function(rel_key) {
                ++rel_sync_count;
                model.getAsync(rel_key).done(function() {
                    if (--rel_sync_count <= 0) {
                        initDone();
                    }
                });
            });
        });

        // Wait for 1 run to avoid rendering too often if the data was already
        // fetched.
        if (--rel_sync_count <= 0) {
            initDone();
        }
    },

    render: function() {
        console.log('collection view render');
        this.$el.html(this.template({
            filters: this.filters,
            models: this.collection.models,
            name: this.collection.name,
            pagination: this.render_pagination(),
            rel_name: this.rel ? this.collection.rel_name
                : this.collection.name,
            id: this.id,
            rel: this.rel
        }));
        return this;
    },

    render_pagination: function() {
        /*
         * Fill the "pagination" template to add pagination controls below the
         * list.
         */

        return Templates['pagination']({
            collection: this.collection
        });
    },

    updateCollectionUrl: function() {
        /* Make the collection's URL aware of custom settings. */

        var url_params = this.url_params || [];
        if (this.filters) {
            _.each(this.filters, function(filter) {
                var field = filter[0], operator = filter[1], value = filter[2];
                url_params.push(field + ':' + operator + '='
                    + encodeURIComponent(JSON.stringify(value)));
            })
        }

        var url = this.collection.url;
        if (url_params) {
            url += '?' + url_params.join('&');
        }
        this.collection.url = url;
    },

    addRecord: function(ev) {
        var that = this;
        var data = Backbone.Syphon.serialize(this);
        var model = new this.collection.model();
        model.set('id', data['new_rel_id']);
        model.save({}, {
            success: function() {
                console.log('record edited', that.id);
                Backbone.history.loadUrl(Backbone.history.fragment);
            }
        });
        return false;
    },

    deleteRecord: function(ev) {
        var that = this;
        var model = new this.collection.model();
        model.set('id', $(ev.target).attr('value'));
        model.destroy({
            success: function() {
                console.log('record removed/deleted', that.id);
                Backbone.history.loadUrl(Backbone.history.fragment);
            }
        });
    }
});

function applyFilter(el, field) {
    /* Update the filter the view is using and reload its contents. */

    var node = $(el);
    switch (el.tagName) {
    case 'SELECT':
        var operator = el.multiple ? 'in' : 'eq';
        main_view.filters[el.name] = [field, operator, node.val()];
        break;
    default:
        alert(el.tagName + ' controls are not supported yet.');
        break;
    }

    main_view.updateCollectionUrl();
    main_view.collection.fetch();
}

function switchPage(page_index) {
    /*
     * Load results in the specified page; render the view once they have been
     * retrieved.
     */

    main_view.collection.getPage(page_index, {
        success: function() {
            main_view.render();
        }
    });
}

function switchToNextPage() {
    /*
     * Load results in the next page; render the view once they have been
     * retrieved.
     */

    main_view.collection.getNextPage({
        success: function() {
            main_view.render();
        }
    });
}

function switchToPrevPage() {
    /*
     * Load results in the previous page; render the view once they have been
     * retrieved.
     */

    main_view.collection.getPreviousPage({
        success: function() {
            main_view.render();
        }
    });
}

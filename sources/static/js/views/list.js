Views.list = Backbone.View.extend({
    el: '#ajax-content',
    events: {
        'submit .add-select': 'addRecord',
        'click .delete': 'deleteRecord'
    },

    initialize: function(options) {
        console.log('listview initialize');
        if (this.collection) {
            var url = this.collection.model.prototype.urlRoot;
            if (options.params) {
                url = url + "?" + options.params;
            }
            this.collection.url = url;
        }
        this.id = options.id;
        this.rel = options.rel;
        this.template = options.template;
        this.render(); // Pre-render before refreshing anything.
        this.listenTo(this.collection, 'sync', this.sync);
        this.collection.fetch();
    },

    render: function() {
        console.log('collection view render');
        this.$el.html(this.template({
            models: this.collection.models,
            name: this.collection.name,
            rel_name: this.rel ? this.collection.rel_name
                : this.collection.name,
            id: this.id,
            rel: this.rel
        }));
        return this;
    },

    sync: function() {
        /*
         * Called when the "sync" event is fired (when data has been fetched
         * from the server). Before updating the view, also fetch related models
         * we might need.
         */

        var that = this;

        // First gather relational fields.
        var rel_keys = [];
        _.each(this.collection.model.prototype.relations, function(relation) {
            rel_keys.push(relation.key);
        });

        // Render immediately when there are no relational elements.
        if (_.size(rel_keys) == 0) {
            this.render();
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
                        that.render();
                    }
                });
            });
        });

        // Wait for 1 run to avoid rendering too often if the data was already
        // fetched.
        --rel_sync_count;
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

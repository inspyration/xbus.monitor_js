Views.record = Backbone.View.extend({
    el: '#ajax-content',
    events: {
        'submit .record-form': 'saveRecord',
        'click .delete': 'deleteRecord'
    },

    initialize: function(options) {
        console.log('record view initialize', this.id);

        this.editing = options.editing;

        this.params = options.params;
        if (this.params) {
            // Use URI.js to parse default parameters.
            // <http://medialize.github.io/URI.js/>
            this.params = URI.parseQuery(this.params);
        }

        this.rel = options.rel;

        this.template = options.template;

        this.render(); // Pre-render before refreshing anything.

        if (this.id && options.rel === undefined) {
            this.model = this.collection.get(this.id);
            if (!this.model) {
                this.model = this.collection.add([{
                    id: this.id
                }])[0];
            }
            this.listenTo(this.model, 'sync', this.sync);
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
            name: this.collection.name,
            params: this.params,
            rel_name: this.rel ? this.collection.rel_name
                : this.collection.name
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
            if (relation.type === Backbone.HasMany) {
                rel_keys.push(relation.key);
            }
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
        _.each(rel_keys, function(rel_key) {
            ++rel_sync_count;
            that.model.getAsync(rel_key).done(function() {
                if (--rel_sync_count <= 0) {
                    that.render();
                }
            });
        });

        // Wait for 1 run to avoid rendering too often if the data was already
        // fetched.
        if (--rel_sync_count <= 0) {
            that.render();
        }
    },

    saveRecord: function(ev) {
        var that = this;
        var data = Backbone.Syphon.serialize(this);
        if (!this.model) {
            this.model = new this.collection.model();
        }
        this.model.save(data, {
            success: function() {
                console.log('record edited', that.id);
                var target = that.rel ? that.collection.name + '/' + that.id
                    + '/' + that.rel : that.collection.name;
                router.navigate(target, {
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
                console.log('record removed/destroyed', that.id);
                disableView(that);
                var target = that.rel ? that.collection.name + '/' + that.id
                    + '/' + that.rel : that.collection.name;
                router.navigate(target, {
                    trigger: true
                });
            }
        });
        return false;
    }
});

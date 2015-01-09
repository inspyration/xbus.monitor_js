Views.record = Backbone.View.extend({
    el: '#ajax-content',
    events: {
        'submit .record-form': 'saveRecord',
        'click .delete': 'deleteRecord'
    },

    initialize: function(options) {
        console.log('record view initialize', this.id);
        this.editing = options.editing;
        this.template = options.template;
        this.rel = options.rel;
        this.render(); // Pre-render before refreshing anything.

        if (this.id && options.rel === undefined) {
            this.model = this.collection.get(this.id);
            if (!this.model) {
                this.model = new this.collection.model({
                    id: this.id
                });
                this.collection.add([this.model]);
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
            name: this.collection.name,
            rel_name: this.rel ? this.collection.rel_name : this.collection.name
        }));
        return this;
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
                var target = that.rel ? that.collection.name + '/' + that.id + '/' + that.rel : that.collection.name;
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
                var target = that.rel ? that.collection.name + '/' + that.id + '/' + that.rel : that.collection.name;
                router.navigate(target, {
                    trigger: true
                });
            }
        });
        return false;
    }
});

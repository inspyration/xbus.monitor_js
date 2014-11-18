Views.graph = Backbone.View.extend({
    el: '#ajax-content',
    events: {
        'submit .add-select': 'addRecord',
        'click .delete': 'deleteRecord'
    },

    initialize: function(options) {
        console.log('listview initialize');
        if(this.collection) {
        	var url = this.collection.model.prototype.urlRoot;
	        if(options.params) {
	            url = url + "?" + options.params;
	        }
	        this.collection.url = url;
    	}
        this.id = options.id;
        this.rel = options.rel;
        this.template = options.template;
        this.render(); // Pre-render before refreshing anything.
        this.listenTo(this.collection, 'sync', this.render);
        this.collection.fetch();
    },

    render: function() {
        console.log('collection view render');
        this.$el.html(this.template({
            models: this.collection.models,
            name: this.collection.name,
            rel_name: this.rel ? this.collection.rel_name : this.collection.name,
            id: this.id,
            rel: this.rel
        }));
        return this;
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

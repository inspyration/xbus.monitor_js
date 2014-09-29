Views.list = Backbone.View.extend({
    el: '#ajax-content',

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

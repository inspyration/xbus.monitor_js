Views.upload = Backbone.View.extend({
    el: '#ajax-content',

    initialize: function(options) {
        console.log('upload view initialize');
        this.template = options.template;
        this.render();
    },

    render: function() {
        console.log('upload view render');
        this.$el.html(this.template({
            'api_prefix': API_PREFIX
        }));
        return this;
    },
});

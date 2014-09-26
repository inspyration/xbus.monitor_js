Models.service = Backbone.Model.extend({
    urlRoot: '/api/service'
});

Collections.service = Backbone.Collection.extend({
    model: Models.service,
    name: 'service',

    parse: function(response) {
        console.log('collection response parse', response);
        return response.services;
    },

    url: '/api/service'
});

collections.service = new Collections.service();

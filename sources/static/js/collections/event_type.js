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

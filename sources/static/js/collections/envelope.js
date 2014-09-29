Models.envelope = Backbone.Model.extend({
    urlRoot: '/api/envelope'
});

Collections.envelope = Backbone.Collection.extend({
    model: Models.envelope,
    name: 'envelope',
    url: '/api/envelope'
});

collections.envelope = new Collections.envelope();

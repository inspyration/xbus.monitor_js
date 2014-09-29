Models.service = Backbone.Model.extend({
    urlRoot: '/api/service'
});

Collections.service = Backbone.Collection.extend({
    model: Models.service,
    name: 'service',
    url: '/api/service'
});

collections.service = new Collections.service();

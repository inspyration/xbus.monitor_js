Models.service = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'service'
});

Collections.service = Backbone.Collection.extend({
    model: Models.service,
    name: 'service',
    url: API_PREFIX + 'service'
});

collections.service = new Collections.service();

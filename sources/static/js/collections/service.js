Models.service = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'service'
});

Collections.service = Backbone.PageableCollection.extend({
    model: Models.service,
    name: 'service',
    state: {
        firstPage: 0
    },
    url: API_PREFIX + 'service'
});

collections.service = new Collections.service();

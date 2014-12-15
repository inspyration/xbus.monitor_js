Models.envelope = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'envelope'
});

Collections.envelope = Backbone.Collection.extend({
    model: Models.envelope,
    name: 'envelope',
    url: API_PREFIX + 'envelope'
});

collections.envelope = new Collections.envelope();

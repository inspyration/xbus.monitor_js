Models.user = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'user'
});

Collections.user = Backbone.Collection.extend({
    model: Models.user,
    name: 'user',
    url: API_PREFIX + 'user'
});

collections.user = new Collections.user();

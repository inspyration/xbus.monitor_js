Models.user = Backbone.RelationalModel.extend({
    idAttribute: 'user_id',
    urlRoot: API_PREFIX + 'user'
});

Collections.user = Backbone.Collection.extend({
    model: Models.user,
    name: 'user',
    url: API_PREFIX + 'user'
});

collections.user = new Collections.user();

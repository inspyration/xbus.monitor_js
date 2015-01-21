Models.user = Backbone.RelationalModel.extend({
    idAttribute: 'user_id',
    urlRoot: API_PREFIX + 'user'
});

Collections.user = Backbone.PageableCollection.extend({
    model: Models.user,
    name: 'user',
    state: {
        firstPage: 0
    },
    url: API_PREFIX + 'user'
});

collections.user = new Collections.user();

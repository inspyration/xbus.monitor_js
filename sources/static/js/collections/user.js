Models.user = Backbone.RelationalModel.extend({
    idAttribute: 'user_id',
    urlRoot: API_PREFIX + 'user'
});

registerCollection({
    name: 'user'
});

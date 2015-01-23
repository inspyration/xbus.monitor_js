Models.consumer = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'consumer'
});

registerCollection({
    name: 'consumer'
});

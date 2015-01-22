Models.service = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'service'
});

registerCollection({
    name: 'service'
});

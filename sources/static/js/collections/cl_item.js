Models.cl_item = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'cl_item'
});

registerCollection({
    name: 'cl_item'
});

Models.cl_item_column = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'cl_item_column'
});

registerCollection({
    name: 'cl_item_column'
});

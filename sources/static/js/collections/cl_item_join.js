Models.cl_item_join = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'cl_item_join'
});

registerCollection({
    name: 'cl_item_join'
});

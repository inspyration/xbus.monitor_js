Models.cl_item_type = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'cl_item_type'
});

registerCollection({
    name: 'cl_item_type',
    relationships: {
        'columns': 'cl_item_column',
        'joins': 'cl_item_join',
        'items': 'cl_item'
    }
});

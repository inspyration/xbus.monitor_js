Models.input_descriptor = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'input_descriptor'
});

Collections.input_descriptor = Backbone.PageableCollection.extend({
    model: Models.input_descriptor,
    name: 'input_descriptor',
    state: {
        firstPage: 0
    },
    url: API_PREFIX + 'input_descriptor'
});

collections.input_descriptor = new Collections.input_descriptor();

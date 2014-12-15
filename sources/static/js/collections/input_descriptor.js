Models.input_descriptor = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'input_descriptor'
});

Collections.input_descriptor = Backbone.Collection.extend({
    model: Models.input_descriptor,
    name: 'input_descriptor',
    url: API_PREFIX + 'input_descriptor'
});

collections.input_descriptor = new Collections.input_descriptor();

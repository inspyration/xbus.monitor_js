Models.input_descriptor = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'input_descriptor'
});

registerCollection({
    name: 'input_descriptor'
});

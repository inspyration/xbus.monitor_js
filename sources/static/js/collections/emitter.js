Models.emitter = Backbone.Model.extend({
    urlRoot: API_PREFIX + 'emitter'
});

Collections.emitter = Backbone.Collection.extend({
    model: Models.emitter,
    name: 'emitter',
    url: API_PREFIX + 'emitter'
});

collections.emitter = new Collections.emitter();

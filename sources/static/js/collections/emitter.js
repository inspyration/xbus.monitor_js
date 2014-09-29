Models.emitter = Backbone.Model.extend({
    urlRoot: '/api/emitter'
});

Collections.emitter = Backbone.Collection.extend({
    model: Models.emitter,
    name: 'emitter',
    url: '/api/emitter'
});

collections.emitter = new Collections.emitter();

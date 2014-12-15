Models.emitter_profile = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'emitter_profile'
});

Collections.emitter_profile = Backbone.Collection.extend({
    model: Models.emitter_profile,
    name: 'emitter_profile',
    url: API_PREFIX + 'emitter_profile',
    relationships: {
    	"event_types": "event_type"
    }
});

collections.emitter_profile = new Collections.emitter_profile();

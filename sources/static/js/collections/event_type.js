Models.event_type = Backbone.RelationalModel.extend({
    urlRoot: API_PREFIX + 'event_type'
});

Collections.event_type = Backbone.PageableCollection.extend({
    model: Models.event_type,
    name: 'event_type',
    state: {
        firstPage: 0
    },
    url: API_PREFIX + 'event_type',
    relationships: {
    	"nodes": "event_node",
    	"emitter_profiles": "emitter_profile"
    }
});

collections.event_type = new Collections.event_type();

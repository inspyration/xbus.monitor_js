Models.event = Backbone.RelationalModel.extend({
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'emitter_id',
        relatedModel: 'Models.emitter',
        type: Backbone.HasOne
    }, {
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'envelope_id',
        relatedModel: 'Models.envelope',
        type: Backbone.HasOne
    }, {
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'type_id',
        relatedModel: 'Models.event_type',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'event'
});

Collections.event = Backbone.PageableCollection.extend({
    model: Models.event,
    name: 'event',
    state: {
        firstPage: 0
    },
    url: API_PREFIX + 'event'
});

collections.event = new Collections.event();

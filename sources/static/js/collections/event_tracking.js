Models.event_tracking = Backbone.RelationalModel.extend({
    relations: [{
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'event_id',
        relatedModel: 'Models.event',
        type: Backbone.HasOne
    }, {
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'responsible_id',
        relatedModel: 'Models.user',
        type: Backbone.HasOne
    }, {
        includeInJSON: Backbone.Model.prototype.idAttribute,
        key: 'user_id',
        relatedModel: 'Models.user',
        type: Backbone.HasOne
    }],
    urlRoot: API_PREFIX + 'event_tracking'
});

registerCollection({
    name: 'event_tracking'
});

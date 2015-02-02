Views.clear_form = Backbone.View
    .extend({
        el: '#ajax-content',
        events: {
            'submit .record-form': 'saveRecord'
        },

        initialize: function(options) {
            console.log('clear_form initialize', this.id);
            this.template = options.template;
            this.render(); // Pre-render before refreshing anything.

            if (this.id) {
                this.model = this.collection.get(this.id);
                if (!this.model) {
                    this.model = new this.collection.model({
                        id: this.id
                    });
                }
                this.listenTo(this.model, 'sync', this.render);
                this.model.fetch();
            } else {
                this.model = null;
            }
        },

        render: function() {
            if (!this.id) {
                return this;
            }
            console.log('clear_form render', this.id);
            var clear_data = {};
            if (this.model !== undefined) {
                if (!this.model.get('sent_date')) {
                    var dest_data = this.model.get('dest_data');
                    var dest_data_names = this.model.get('dest_data_names');
                    var current_data = this.model.get('current_data');
                    var current_data_names = this.model
                        .get('current_data_names');
                    var source_data = this.model.get('source_data');
                    var source_data_names = this.model.get('source_data_names');
                    var display = this.model.get('display');
                    var dest_default_fields = this.model
                        .get('dest_default_fields');
                    var key_fields = this.model.get('key_fields');
                    _.each(display, function(k) {
                        function getKData(array) {
                            var ret = array[k];
                            return (ret !== undefined) ? _.escape(ret) : null;
                        }
                        clear_data[_.escape(k)] = [false, false,
                            _.escape(display[k]), getKData(current_data),
                            getKData(current_data_names),
                            getKData(source_data), getKData(source_data_names),
                            getKData(dest_data), getKData(dest_data_names)];
                    });
                    _.each(key_fields, function(i) {
                        var k = key_fields[i];
                        clear_data[_.escape(k)][0] = true;
                    });
                    _.each(dest_default_fields, function(i) {
                        var k = dest_default_fields[i];
                        clear_data[_.escape(k)][1] = true;
                    });
                }
            }
            this.$el.html(this.template({
                clear_data: clear_data,
                editing: false,
                model: this.model,
                name: this.collection.name
            }));
            return this;
        },

        saveRecord: function(ev) {
            var that = this;
            var out_data = Backbone.Syphon.serialize(this);
            var current_data_names = this.model.get('current_data_names')
            for ( var n in current_data_names) {
                out_data[n] = [parseInt(out_data[n])]
            }
            var data = {
                out_data: out_data
            }
            this.model.save(data, {
                patch: true,
                success: function() {
                    console.log('record edited', that.id);
                    router.navigate(that.collection.name, {
                        trigger: true
                    });
                }
            });
            return false;
        },
    });

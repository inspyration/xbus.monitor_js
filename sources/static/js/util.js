/*
 * Useful scripts that may use backbone.js, devoops or even both. To be loaded
 * last.
 */

function fillRelNames(field, collection_name, text_field) {
    /*
     * Fetch names of relational fields and fill them into tags with the "field"
     * parameter as their data.
     */

    var collection = collections[collection_name];
    collection.fetch({
        success: function() {
            $('[data-' + field + ']').each(function() {
                var el = $(this);
                var id = el.data(field);
                el.text(collection.get(id).get(text_field));
            });
        }
    });
}

function formatDataForSelect2(data, text_field) {
    return {
        id: data.id,
        text: data[text_field]
    }
}

function prepareForm(form_selector, editing) {
    if (!editing) {
        // Set the form as readonly.
        $(form_selector + ' input').attr('readonly', 'readonly');
    }
}

function select2ify(input_name, url, text_field) {
    /*
     * Apply Select2 to an input; link it with a collection by the provided URL.
     * @param text_field The field to use to display the name of the record.
     */

    LoadSelect2Script(function() {

        $('input[name="' + input_name + '"]').select2({
            ajax: {
                dataType: 'json',
                results: function(data, page) {
                    return {
                        results: _.map(data, function(row) {
                            return formatDataForSelect2(row, text_field);
                        })
                    };
                },
                url: url
            },
            containerCssClass: 'form-control',
            initSelection: function(element, callback) {
                var id = $(element).val();
                if (id !== '') {
                    // Request information about the default selection.
                    $.ajax(url + '/' + id, {
                        dataType: 'json'
                    }).done(function(data) {
                        callback(formatDataForSelect2(data, text_field));
                    });
                }
            },
        });
    });
}
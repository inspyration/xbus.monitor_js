/*
 * Useful scripts that may use backbone.js, devoops or even both. To be loaded
 * last.
 */

function formatDataForSelect2(data, text_field) {
    return {
        id: data.id,
        text: data[text_field]
    }
}

function select2ify(input_name, url, text_field) {
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

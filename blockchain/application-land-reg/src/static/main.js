$(function() {
    $.getJSON('/static/states.json', function(data) {
        $.each(data, function(i, state) {
            $('#state').append(
                $('<option></option>')
                    .attr('value', state.toLowerCase())
                    .text(state),
            );
        });
    });
});

$(function() {
    var stateData, districtData;
    function resetSelect(selector, title) {
        $(selector)
            .children()
            .remove();
        $(selector).append(
            $('<option></option>')
                .attr('value', '')
                .attr('hidden', true)
                .attr('selected', true)
                .text(title),
        );
    }
    $('#state').on('change', function() {
        var stateName = $('#state')
            .children('option')
            .filter(':selected')
            .text();
        $.getJSON(`/static/${stateName}.json`, function(data) {
            stateData = data;
            resetSelect('#district', 'Select District');
            resetSelect('#subDistrict', 'Select Sub-District');
            resetSelect('#village', 'Select Village');
            $.each(data.districts, function(i, district) {
                console.log(district);
                $('#district').append(
                    $('<option></option>')
                        .attr('value', district.district.toLowerCase())
                        .text(district.district),
                );
            });
        });
    });

    $('#district').on('change', function() {
        var districtName = $('#district')
            .children('option')
            .filter(':selected')
            .text();
        resetSelect('#subDistrict', 'Select Sub-District');
        resetSelect('#village', 'Select Village');
        $.each(stateData.districts, function(i, district) {
            if (districtName === district.district) {
                districtData = district;
                $.each(district.subDistricts, function(i, subDistrict) {
                    $('#subDistrict').append(
                        $('<option></option>')
                            .attr(
                                'value',
                                subDistrict.subDistrict.toLowerCase(),
                            )
                            .text(subDistrict.subDistrict),
                    );
                });
            }
        });
    });

    $('#subDistrict').on('change', function() {
        var subDistrictName = $('#subDistrict')
            .children('option')
            .filter(':selected')
            .text();
        resetSelect('#village', 'Select Village');
        $.each(districtData.subDistricts, function(i, subDistrict) {
            if (subDistrictName === subDistrict.subDistrict) {
                $.each(subDistrict.villages, function(i, village) {
                    $('#village').append(
                        $('<option></option>')
                            .attr('value', village.toLowerCase())
                            .text(village),
                    );
                });
            }
        });
    });
});

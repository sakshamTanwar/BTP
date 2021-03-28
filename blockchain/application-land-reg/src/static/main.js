$(function () {
    $.getJSON('/static/states.json', function (data) {
        $.each(data, function (i, state) {
            $("#state").append(
                $("<option></option>")
                    .attr("value", state)
                    .text(state)
            )
        })
    })
})

$(function () {
    var stateData, districtData
    function resetSelect(selector, title) {
        $(selector).children().remove()
        $(selector).append(
            $("<option></option>")
                .attr("value", '')
                .attr('hidden', true)
                .attr('selected', true)
                .text(title)
        )
    }
    $('#state').on('change', function () {
        var stateName = this.value
        $.getJSON(`/static/${stateName}.json`, function (data) {
            stateData = data
            resetSelect('#district', 'Select District')
            resetSelect('#subDistrict', 'Select Sub-District')
            resetSelect('#village', 'Select Village')
            $.each(data.districts, function (i, district) {
                $("#district").append(
                    $("<option></option>")
                        .attr("value", district.district)
                        .text(district.district)
                )
            })
        })
    })

    $('#district').on('change', function () {
        var districtName = this.value
        resetSelect('#subDistrict', 'Select Sub-District')
        resetSelect('#village', 'Select Village')
        $.each(stateData.districts, function (i, district) {
            if (districtName === district.district) {
                districtData = district
                $.each(district.subDistricts, function (i, subDistrict) {
                    $("#subDistrict").append(
                        $("<option></option>")
                            .attr("value", subDistrict.subDistrict)
                            .text(subDistrict.subDistrict)
                    )
                })
            }
        })
    })

    $('#subDistrict').on('change', function () {
        var subDistrictName = this.value
        resetSelect('#village', 'Select Village')
        $.each(districtData.subDistricts, function (i, subDistrict) {
            if (subDistrictName === subDistrict.subDistrict) {
                $.each(subDistrict.villages, function (i, village) {
                    $("#village").append(
                        $("<option></option>")
                            .attr("value", village)
                            .text(village)
                    )
                })
            }
        })
    })
})

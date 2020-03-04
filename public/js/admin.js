 
function checkPaidStatusAndSet(element, uid) {
    fetch(`/getpaidstatus/${uid}`)
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw Error(res.status)
            }
        })
        .then((data) => {
            if (!data.err) {
                $(element).attr('disabled', false).parent().css({
                    "opacity": 1
                });
                if (data.paid) {
                    $(element).prop("checked", true)
                }
                if (!data.paid) {
                    $(element).prop("checked", false)
                }
            } else {
                throw Error(data.err);
            }
        })
        .catch(err => {
            console.log('Error:',err)
        });
}

function togglePaidStatus(chpi, uid) {
    $(chpi).attr('disabled', true).parent().css({
        "opacity": 0.2
    });
    fetch(`/togglepaidstatus/${uid}`)
        .then(res => {
            if (!res.ok) {
                $(chpi).prop("checked", !$(chpi).prop("checked"));
            }
        }).finally(() => {
            $(chpi).attr('disabled', false).parent().css({
                "opacity": 1
            });
        })
}

$(document).ready(() => {
    document.querySelectorAll("#ch").forEach(checkbox => {
        checkPaidStatusAndSet(checkbox, $(checkbox).attr("data-id"))
    });
});
$(document).ready(function () {

    //on page load keep the user list populated------------START
    $.ajax({
        url: "articles/article",
        dataType: "json",
    })
        .done((data) => {
            if (data) {
                var dataPull = JSON.stringify(data.docs);
                dataPull.forEach(item => {
                    $('#myTable > tbody:last-child').append(getRowHtml(item));
                });
            }
        })
        .fail((err) => {
            console.log("Error");
        });
    //-------------------------------------------------------END

    //on add user submit the form----------------------------START
    $("#btnSubmit").click(() => {
        $("#addNoteForm").submit();
    });

    $(document).on("submit", '#addNoteForm', function (event) {
        event.preventDefault();
        var $form = $(this);

        $.ajax({
            url: 'notes/add',
            data: $form.serializeArray(),
            type: 'POST'
        })
            .done((data) => {
                if (data) {
                    var dataPull = $.parseJSON(JSON.stringify(data.docs));
                    dataPull.forEach(item => {
                        $('#myTable > tbody:last-child').append(getRowHtml(item));
                    });
                    $('#addNoteForm').trigger("reset");
                }
            })
            .fail((err) => {
                console.log("Error");
            });
    });
    //-------------------------------------------------------END

    //on click of delete record----------------------------START
    $(document).on("click", ".btn-del-record", function (event) {

        //identify the row which we will remove from our table.
        var row = $(this).parent().parent();

        $.ajax({
            url: 'notes/delete',
            data: { id: this.id },
            type: 'POST'
        })
            .done((data) => {
                if (data) {
                    console.log(data);
                    row.remove();
                }
            })
            .fail((err) => {
                console.log("Error");
            });
    });
    //-------------------------------------------------------END

});

function getRowHtml(item) {
    var thtml = getTD(item._id)
        + getTD(item.title)
        + getTD(item.link)
        + getTD(item.note)
        + getDelBtn(item._id);
    thtml = getTR(thtml);
    return thtml;
}
function getTD(val) {
    return '<td>' + val + '</td>';
}

function getTR(val) {
    return '<tr>' + val + '</tr>';
}

function getDelBtn(val) {
    return '<td><button type="button" id=' + val + ' class="btn btn-default btn-sm btn-del-record"><span class="fa fa-trash-alt"></span> Delete </button></td>';
}
$(function(){
    $(".tr_clone_add").on('click', function () {
        let $tr = $(this).closest('.clone_div');
        let c = $tr.clone().append("<td class='text-center position-relative'><span class='fa fa-minus rmv cursor-pointer'></span></td>");
        c.find(".ip-id-val").val('');
        c.find(".plus-action").remove();
        $tr.after(c);
    });

    $('#ipAccessTable').on('click', '.rmv', function () {
        $(this).closest('tr').remove();
    });
});
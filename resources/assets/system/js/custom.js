$(document).ready(function () {
    $('input:visible:enabled:first').focus();
    $("button").click(function () {
        $("#successMessage").hide();
        $("#errorMessage").hide();
    });
});

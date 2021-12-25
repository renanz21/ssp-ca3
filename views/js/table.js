function dr_table(){
    $("#results").empty();
    $.getHTMLLuncached = function(url){
        return $.ajax({
            url:url,
            typoe: 'GET',
            cache: false,
            success: function(html){
                $("#results").append(html);
            }
        });
    };
    $.getHTMLLuncached("/get/html");
};

$(document).ready(function(){
    dr_table();
})
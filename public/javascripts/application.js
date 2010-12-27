// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
function remove_fields(link) {  
    $(link).prev("input[type=hidden]").val(true);  
    $(link).parent(".fields").hide();  
}

function add_fields(link, association, content) {  
    var new_id = new Date().getTime();  
    var regexp = new RegExp("new_" + association, "g");  
    $(link).parent().before(  
        content.replace(regexp, new_id)  
    );  
}

function duration_calc()
{
    
    var hourBox = $('#duration_hours');
    var minuteBox = $('#duration_minutes');
    var totalMinutes = Number(hourBox.val() * 60) + Number(minuteBox.val());
    var minutes = totalMinutes % 60;
    var hours = (totalMinutes - minutes) / 60;
    
    hourBox.val(hours);
    minuteBox.val(minutes);
    
    $('#meeting_duration').val(totalMinutes)
    
}
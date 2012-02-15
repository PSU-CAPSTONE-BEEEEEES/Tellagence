$(document).ready(function() {
    // toolbar animation and help overlay functions
    $("#step2").hide();
    $("#step3").hide();
    $("#toolbar").hide();

    $("#tab").click(function(){$("#toolbar").slideToggle("fast");});
    
    var exitInterval = setInterval(function() {
        if ($("#progress_pbImage").attr("title") == " 100%") {
            $("#step3").hide();
            disablePopup();
            clearInterval(exitInterval);
        }
    },10);

    // functions for controlling the help overlay visibility and position
    function loadPopup(){
        //loads popup only if it is disabled
        if($("#bgPopup").data("state") === 0){
            $("#bgPopup").css({"opacity": "0.7"});
            $("#bgPopup").fadeIn("medium");
            $("#Popup").fadeIn("medium");
            $("#bgPopup").data("state",1);
        }
        if ($("#bar").is(":visible")) {
            $("#spingress").progressBar(0, {showText:false,
                                            barImage: {0:'static/bar_spin.gif'}});
        }
    }
    
    function disablePopup(){
        if ($("#bgPopup").data("state")==1){
            $("#bgPopup").fadeOut("medium");
            $("#Popup").fadeOut("medium");
            $("#bgPopup").data("state",0);
        }
        if ($("#bar").is(":visible")) {
            $("#bar").hide();
        }
    }
    
    function centerPopup(){
        var winw = $(window).width();
        var winh = $(window).height();
        var popw = $('#Popup').width();
        var poph = $('#Popup').height();
        $("#Popup").css({
            "position" : "absolute",
            "top" : winh/2 - poph/2,
            "left" : winw/2 - popw/2
        });
    }
    
    // selectors on the help button to trigger the functions
    $("#bgPopup").data("state", 0);
    $("#help_button").click(function(){
        centerPopup();
        loadPopup();
    });

    $("#bgPopup").click(function(){
        if (!$("#bar").is(":visible") || $("#progress_pbImage").attr("title") == " 100%") {
            disablePopup();
            $("#bar").hide();
        }
    });

    centerPopup();
    loadPopup();
    var currentSpin = 0;
    var spinInterval = setInterval(function() {
        $("#spingress").progressBar(currentSpin++,
                                    {showText:false,
                                     barImage: {0:'static/bar_spin.gif'}});
        if (!$("#step1").is(":visible")) {
            clearInterval(spinInterval);
        }
    },100);
    
    $(window).resize(function() {
        centerPopup();
    });	
});

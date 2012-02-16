$(document).ready(function() {
    // toolbar animation and help overlay functions
    $("#step2").hide();
    $("#step3").hide();
    $("#toolbar").hide();

    $("#tab").click(function(){$("#toolbar").slideToggle("fast");});

    // this interval checks for when the graph is 100% settled to close the
    // help overlay and reveal the graph
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

        // only load the progress bar if the steps are visible
        if ($("#bar").is(":visible")) {
            $("#spingress").progressBar(0, {showText:false,
                                            barImage: {0:'static/images/bar_spin.gif'}});
        }
    }
    
    function disablePopup(){
        if ($("#bgPopup").data("state")==1){
            $("#bgPopup").fadeOut("medium");
            $("#Popup").fadeOut("medium");
            $("#bgPopup").data("state",0);
        }

        // hide the progress bar and associated steps when closing the overlay
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
        // let the user click out of the overlay if the graph is settled
        // or they called the overlay with '?'
        if (!$("#bar").is(":visible") || $("#progress_pbImage").attr("title") == " 100%") {
            disablePopup();
            $("#bar").hide();
        }
    });

    centerPopup();
    loadPopup();

    // simulate the animated spinning of the progress bar while the JSON is
    // being fetched from the database
    var currentSpin = 0;
    var spinInterval = setInterval(function() {
        $("#spingress").progressBar(currentSpin++,
                                    {showText:false,
                                     barImage: {0:'static/images/bar_spin.gif'}});
        if (!$("#step1").is(":visible")) {
            clearInterval(spinInterval);
        }
    },100);
    
    $(window).resize(function() {
        centerPopup();
    });	
});

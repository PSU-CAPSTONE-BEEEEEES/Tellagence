// centers the popup window based on the window width/height
function centerPopup() {
    var winw = $(window).width();
    var winh = $(window).height();
    var popw = $('#Popup').width();
    var poph = $('#Popup').height();

    // set positional css
    $("#Popup").css({
        "position" : "absolute",
        "top" : winh/2 - poph/2,
        "left" : winw/2 - popw/2
    });
}

// brings up the popup overlay on screen
function loadPopup() {
    //loads popup only if it is disabled
    if($("#bgPopup").data("state") === 0){
        $("#bgPopup").css({"opacity": "0.7"});
        $("#bgPopup").fadeIn("medium");
        $("#Popup").fadeIn("medium");
        $("#bgPopup").data("state",1);
    }

    // only load the progress bar if the steps are visible
    if ($("#bar").is(":visible")) {
        centerPopup();
        $("#spingress").progressBar(0, {showText:false,
                                        barImage: {0:'static/images/bar_spin.gif'}});
    }
}

// hides the popup off screen
function disablePopup() {
    if ($("#bgPopup").data("state")==1){
        $("#bgPopup").fadeOut("medium");
        $("#Popup").fadeOut("medium");
        $("#bgPopup").data("state",0);
    }
    if ($("#thumb").length > 0 && $("#thumbcover").length < 1) {
        $("<div id='thumbcover'></div>").insertBefore($("#thumb"));
    }
}

// utility function to change the spinning bar to the loading bar
function switchBars() {
    $("#step1").hide();
    $("#step2").show();
    $("#spingress").hide();
    $("#progress").show();
    centerPopup();
}

// this function initializes all the pieces of the popup and loads it on screen,
// and it's called when a node is clicked, a search is entered, and on page load
var currentSpin, spinInterval;
function resetPopup() {
    // setup which divs should be visible
    $("#step1").show();
    $("#step2").hide();
    $("#spingress").show();
    $("#progress").hide();
    // this skips the condition in progressCallback that closes the popup as
    // soon as the update happens
    $("#progress").replaceWith('<div id="progress"></div>');
    $("#bar").show();

    $("#toolbar").hide();

    // simulate the animated spinning of the progress bar while the JSON is
    // being fetched from the database
    currentSpin = 0;
    spinInterval = setInterval(function() {
        $("#spingress").progressBar(currentSpin++,
                                    {showText:false,
                                     barImage: {0:'static/images/bar_spin.gif'}});
        // make sure we don't continue pushing right
        if (currentSpin == 100) {
            currentSpin = 0;
        }

        // stop spinning if it isn't a visible step
        if (!$("#step1").is(":visible")) {
            clearInterval(spinInterval);
            return;
        }
        centerPopup();
    }, 100);

    centerPopup();
    loadPopup();
}

// callback called from the progress bar on each change, disables the popup and
// hides itself once it's done loading
function progressCallback(data) {
    if (data.running_value == 100) {
        disablePopup();
        $("#step2").hide();
        $("#progress").hide();
    }
}

function init() {
    // setup the menu tab action
    $("#toolbar").hide();
    $("#count").hide();
    $("#tab").click(function(){$("#toolbar").slideToggle("fast");});
    
    // selectors on the help button to trigger the functions
    $("#bgPopup").data("state", 0);
    $("#help_button").click(function(){
        centerPopup();
        loadPopup();
    });

    $("#bgPopup").click(function(){
        // let the user click out of the overlay if the graph is settled
        // or they called the overlay with '?'
        if (!$("#bar").is(":visible") ||
            parseInt($("#progress_pbImage").attr("title"), 10) >= 100) {
            disablePopup();
            // hide the progress bar and associated steps when closing the overlay
            if ($("#bar").is(":visible")) {
                $("#bar").hide();
            }
        }
    });

    $("#g_help").hide();

    $(".swap").click(function() {
        $(".swap").parent().toggle();
        centerPopup();
    });

    // actually setup the popup
    centerPopup();
    resetPopup();

    $(window).resize(function() {
        centerPopup();
    });	

    $("#dots").click(function() {
        // reload the help overlay
        resetPopup();

        // get rid of the existing graph
        window.gr.empty();

        // reset a few graph variables
        window.gr.canTick = true;
        window.sgr.canTick = true;
        window.gr.ready = false;
        window.sgr.ready = false;

        // hide subgraph button
        $("#dots").hide();
        $("#count").hide();

        d3.json("data/subgraph.php", function(data) {
	    switchBars();
	    // retrieve data for subgraph render
	    window.sgr.data(data.graphs);
	    // draw subgraph (w/ graph events ready)
	    window.sgr.draw();
        });
    });
}

$(document).ready(init);

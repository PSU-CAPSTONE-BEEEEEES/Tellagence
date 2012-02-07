function GuiEvent(graphRender) {
    // graph render for this gui event
    this.graphRender = graphRender;
    graphRender.draw();

    // extract input capture on enter
    $("#search").keypress(function(e) {
        // 13 is the ascii code for the enter key
        if (e.which == 13) {
	    alert("enter pressed with " + $("#searchbar").val());
        }
    });

    var initial
    $("#slider").mousedown(function () {
        initial = this.value;
    }).bind("mouseup mouseleave", function () {
        //alert(this.value - initial);
        var diff = this.value - initial;
        if (diff < 0) {
            ChromeWheel( 1 , Math.abs(diff) / 5);
        }
        else {
            ChromeWheel( 0 , diff / 5);
        }
    });

    function ChromeWheel ( shift_key , clicks) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent('dblclick', true, true, window, clicks, 10, 10,
        $(window).width() / 2, $(window).height() / 2, 0, 0, shift_key, 0, 1, null);
        document.getElementById('inner').dispatchEvent(evt);
    }

    // toolbar animation and help overlay functions
    $("#toolbar").hide();
    $("#tab").click(
        function(){
            $("#toolbar").slideToggle("fast");
        }
    );
    
    // functions for controlling the help overlay visibility and position
    function loadPopup(){
        //loads popup only if it is disabled
        if($("#bgPopup").data("state")==0){
            $("#bgPopup").css({
                "opacity": "0.7"
            });
            $("#bgPopup").fadeIn("medium");
            $("#Popup").fadeIn("medium");
            $("#bgPopup").data("state",1);
        }
    }
    
    function disablePopup(){
        if ($("#bgPopup").data("state")==1){
            $("#bgPopup").fadeOut("medium");
            $("#Popup").fadeOut("medium");
            $("#bgPopup").data("state",0);
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
    $("#bgPopup").data("state",0);
    $("#help_button").click(function(){
        centerPopup();
        loadPopup();
    });
    $("#bgPopup").click(function(){
        disablePopup();
    });
    
    $(window).resize(function() {
        centerPopup();
    });
}

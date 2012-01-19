$(document).ready(function() {
    // used to save the interval handle
    var i;

    // Keeps track of times the functions in setInterval are called. This is
    // offset to 1 for the .join() operation in search_bar.
    var num_called = 1;

    /*
      These two functions select the up and down buttons on mousedown events and
      repeat a function at the given interval (100 ms). The repetition will
      continue until mouseup or mouseleave events occur.
     */
    $("#pan_up").mousedown(function() {
	i = setInterval(function() {search_bar("up");}, 100);
    }).bind("mouseup mouseleave", function() {
	clearInterval(i);
    });

    $("#pan_down").mousedown(function() {
	i = setInterval(function() {search_bar("down");}, 100);
    }).bind("mouseup mouseleave", function() {
	clearInterval(i);
    });

    /*
      Author: Aren Edlund-Jermain
      The redraw button function is linked to the redraw button in the control
      panel. It will eventually redraw the image. I think.
    */
    function redrawButton()
    {
	alert("Hello World!");
    }

    /*
      Author: Aren Edlund-Jermain
      The zoomSlider function is linked to the zoom slider in the control panel. It
      will redraw the render with different sizing. Making the object smaller or
      larger depending upon the value retrieved from the actual slider.
    */
    function zoomSlider()
    {
	
    }

    /*
      search_bar is a demo function that increases/decreases the number of '|'
      in the text input field on up/down button presses. It is purely to show
      how holding the buttons can trigger functions continuously until the
      button is released.
     */
    function search_bar(type)
    {
	if (type == "up") {
	    num_called += 1;
	}
	else if (type == "down"){
	    num_called -= 1;
	}

	// creates an Array of '|' at length num_called - 1 and sets it in the
	// input text field
	var text = Array(num_called).join("|")
	$("#search").attr("value", text);
    };

});
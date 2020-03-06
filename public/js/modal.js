$(document).ready(function() {
  window.mod = $(".mod");

  $(".evbtn").click(function(event) {
    window.currentItem = $(event.target);
    if (!$(currentItem).hasClass("card-wrap")) {
      currentItem = $(currentItem).parents("div.card-wrap.evbtn");
    }
    console.log("clicked", currentItem);
    if (!$(mod).hasClass("mod--show")) {
      let eventID = $(currentItem).attr("id")
      mod.eventID = eventID;
      let coverURL = $(currentItem).attr("data-cover")
      let title = $(currentItem).attr("data-title");
      let desc = $(currentItem).attr('data-desc');
      let date_time = $(currentItem).attr('data-date_time');
      let venue = $(currentItem).attr('data-venue');
      let form_link = $(currentItem).attr('data-form_link');
      $("#mod__cover").attr("src", coverURL);
      
      $("#mod__form_desc").hide();
      // Add a cover image, title and description to the modal
      $("#mod__cover").attr("src", coverURL);
      $("#mod__title").text(title);
      $("#mod__desc").text(desc);
      $("#mod__date_time_venue").html("<strong>Slot :</strong> "+date_time+"  <strong>Venue :</strong>" + venue);
      
      if(form_link.trim() === "#"){
        $("#mod__form_desc").hide();
      }else{
        $("#mod__form_desc").show();
        $("#mod__form_link").attr("href",form_link);
        $("#mod__form_link").attr("target","_blank");
      }
      
    } else {
      // When the modal closes, remove both classes and hide the button
      $("#regbtn").removeClass("btn-success").removeClass("btn-danger").addClass("hide");

      // Empty the title and description
      $("#mod__title").text("Loading...");
      $("#mod__desc").text("");
      $("#mod__date_time_venue").html("<strong>Slot :</strong> Loading...  <strong>Venue :</strong> Loading..." );
    }

    // Show the modal
    $(mod).toggleClass("mod--show");
    $("body").toggleClass("hide-overflow");
  });

  $(".overlay").click(function() {
    $(mod).toggleClass("mod--show");
    $("body").toggleClass("hide-overflow");
    $("#regbtn").addClass("hide");


    $("#regbtn").removeClass("btn-success").removeClass("btn-danger");
    $("#mod__title").text("Loading...");
    $("#mod__desc").text("");
    $("#mod__date_time_venue").html("<strong>Slot :</strong> Loading...  <strong>Venue :</strong> Loading..." );
  });

  $(".mod__close").click(function() {
    $(mod).toggleClass("mod--show");
    $("body").toggleClass("hide-overflow");
    $("#regbtn").addClass("hide");


    $("#regbtn").removeClass("btn-success").removeClass("btn-danger").addClass("hide");

      $("#mod__title").text("Loading...");
      $("#mod__desc").text("");
      $("#mod__date_time_venue").text("<strong>Slot :</strong> Loading...  <strong>Venue :</strong> Loading..." );
  });

  $("#regbtn").click(function() {

    // Disable the button after it is clicked
    // $("#regbtn").attr("disabled", true);
    $("#regbtn")
      .addClass("hide")
      .removeClass("btn-success")
      .removeClass("btn-danger");
    if ($("#regbtn").text() == "Register") {

      // If the button says Register
      // make a GET request to the register route
      fetch(`/register/${mod.eventID}`).then(function(res) {
        if (res.ok) {
          return res.text();
          } else {
            return "E";
          }
      })
      .then(function(data) {

        if (data == "T") { // If Registered successfully

          let form_link = $(currentItem).attr('data-form_link');
          // Change text to Unregister
          $("#regbtn").text("Unregister");
          $("#regbtn").addClass("btn-danger");
        
          
        } else {
          // Change text back to Register
          $("#regbtn").text("Register");
          $("#regbtn").addClass("btn-success");
          
        }

        if (data == "E") {
          // Close the modal
          $(mod).toggleClass("mod--show");
          $("body").toggleClass("hide-overflow");
          // Notify errors
          Toast.fire({
            icon: "info",
            title: "Sorry, we couldn't do that. Please reload the page."
          });

        }

        // Enable the button
        $("#regbtn").attr("disabled", false);
        $("#regbtn").removeClass("hide");

      })
    } else if ($("#regbtn").text() == "Unregister") {

      // If the button says Unregister
      // make a GET request to the unregister route
      fetch(`/unregister/${mod.eventID}`).then(function(res) {

        if (res.ok) {
          return res.text();
          } else {
            return "E";
          }
      }).then(function(data) {

        if (data == "T") { // If Unregistered successfully

          // Change text to Register
          $("#regbtn").text("Register");
          $("#regbtn").addClass("btn-success");
          
        } else {
          // Change text back to Unregister
          $("#regbtn").text("Unregister");
          $("#regbtn").addClass("btn-danger");
          
        }

        if (data == "E") {
          // Close the modal
          $(mod).toggleClass("mod--show");
          $("body").toggleClass("hide-overflow");
          // Notify errors
          Toast.fire({
            icon: "info",
            title: "Sorry, we couldn't do that. Please reload the page."
          });
        }

        // Enable the button
        $("#regbtn").attr("disabled", false);
        $("#regbtn").removeClass("hide");
      })
    }
  });
});
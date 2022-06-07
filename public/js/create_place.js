

var currentTab = 0; // Current tab is set to be the first tab (0)
var lastTab = -1;
let lat, lng;
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form ...
  var x = document.getElementsByClassName("tab");
  let progress = document.getElementById("progressBarCreatePlace");

  var progressValue = ((n - 1) / (x.length - 1)) * 100
  progress.classList.remove(`w-[${progressValue}%]`);
  /* If Previous  */
  if (currentTab < lastTab) {
    progressValue = ((n + 1) / (x.length - 1)) * 100
    progress.classList.remove(`w-[${progressValue}%]`);
  }
  /* Next */
  progressValue = (n / (x.length - 1)) * 100
  progress.classList.add(`w-[${progressValue}%]`)

  /* Change color progressbar when completed */
  if (progressValue == 100) {
    progress.classList.add(`bg-green-600`);
    progress.classList.remove(`bg-blue-600`);
  }
  else if (progress.classList.contains(`bg-green-600`)) {
    progress.classList.remove(`bg-green-600`);
    progress.classList.add(`bg-blue-600`);
  }

  x[n].style.display = "block";
  // ... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("submit").classList.remove("hidden")
    document.getElementById("nextBtn").classList.add("hidden")


  } else {
    document.getElementById("submit").classList.add("hidden")
    document.getElementById("nextBtn").classList.remove("hidden")
  }
  // ... and run a function that displays the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  lastTab = currentTab;
  currentTab = currentTab + n;
  // if you have reached the end of the form... :
  if (currentTab >= x.length) {
    //...the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:

  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false:
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}



function initMaps() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    minZoom: 12,
    maxZoom: 20,
    center: { lat: 41.7923, lng: 1.99657 },
    disableDefaultUI: true, //elimina default google maps gui
    gestureHandling: "greedy",
    zoomControl: true,
  });




  const input = document.getElementById("search-box-index");
  const options = {
    componentRestrictions: { country: "es" }
  };

  let autocomplete = new google.maps.places.Autocomplete(input, options);
  var new_place;

  autocomplete.addListener('place_changed', () => {
    new_place = autocomplete.getPlace();

    if (!new_place.geometry) {
      window.alert("Cap resultat per: '" + new_place.name + "'");
      document.getElementById("search-box-index").placeholder = "";
      return;
    }
    if (new_place.length == 0) {
      return;
    }
    map.setCenter(new google.maps.LatLng(new_place.geometry.location.lat(), new_place.geometry.location.lng()))
    // const panorama = new google.maps.StreetViewPanorama(
    //   document.getElementById("panorama"),
    //   {
    //     position: new google.maps.LatLng(new_place.geometry.location.lat(), new_place.geometry.location.lng()),
    //     pov: {
    //       heading: 34,
    //       pitch: 10,
    //     },
    //   }
    // );
    // map.setStreetView(panorama);
  });


  //Centrar steet view

}




function clearForms() {
  var i;
  for (i = 0; (i < document.forms.length); i++) {
    document.forms[i].reset();
  }
}




//Images form

window.onload = function () {

  //Check File API support
  if (window.File && window.FileList && window.FileReader) {
    var filesInput = document.getElementById("files");

    filesInput.addEventListener("change", function (event) {

      var files = event.target.files; //FileList object
      var output = document.getElementById("result");
      //Clear output
      output.innerHTML = ""

      for (var i = 0; i < files.length; i++) {
        var file = files[i];

        //Only pics
        if (!file.type.match('image'))
          continue;

        var picReader = new FileReader();

        picReader.addEventListener("load", function (event) {
          var picFile = event.target;
          var div = document.createElement("div");
          div.innerHTML = "<img class='flex h-80 w-80 p-5 overflow-auto' src='" + picFile.result + "'" +
            "title='" + picFile.name + "'/>";
          output.insertBefore(div, null);
        });
        //Read the image
        picReader.readAsDataURL(file);
      }

    });
  }
  else {
    console.log("Your browser does not support File API");
  }
}

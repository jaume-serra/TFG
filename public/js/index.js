function initAutocomplete() {
  const input = document.getElementById("search-box-index");
  input.value = "";
  const options = {
    componentRestrictions: { country: "es" }
  };

  let autocomplete = new google.maps.places.Autocomplete(input, options);
  let new_place;

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
  });



  document.getElementById("storage_button").addEventListener("click", function () {
    if (!new_place) {
      return;
    }
    let url = new URL("mapa", document.baseURI);
    url.searchParams.set("type", "storage");
    url.searchParams.set("lat", new_place.geometry.location.lat());
    url.searchParams.set("lng", new_place.geometry.location.lng());
    window.location.href = url.href;

  });



  document.getElementById("parking_button").addEventListener("click", function () {
    if (!new_place) {
      return;
    }
    let url = new URL("mapa", document.baseURI);
    url.searchParams.set("type", "parking");
    url.searchParams.set("lat", new_place.geometry.location.lat());
    url.searchParams.set("lng", new_place.geometry.location.lng());
    window.location.href = url.href;

  });

}

function changeTypeSpace(id_button) { //Pot ser
  var buttons = document.getElementById("buttons").getElementsByClassName("btn");

  for (let j = 0; j < buttons.length; j++) {
    if (buttons[j].classList.contains("active")) {
      if (buttons[j].id !== id_button) {
        buttons[j].classList.remove("active", "bg-[#2b6777]", "font-black", "text-white"); //button actiu pero un altre clicat
      }

    }
    if (buttons[j].id === id_button) {
      buttons[j].classList.add("active", "bg-[#2b6777]", "font-black", "text-white");

    }
  }
  var type_text = document.getElementsByClassName("type-text");
  for (let i = 0; i < type_text.length; i++) {
    if (type_text[i].classList.contains("active")) {
      if (type_text[i].id !== id_button) {
        type_text[i].classList.remove("active");
        type_text[i].classList.add("hidden");
      }
    }
    if (type_text[i].id === id_button) {
      type_text[i].classList.add("active");
      type_text[i].classList.remove("hidden");
    }


  }

}


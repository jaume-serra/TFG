
/*places esta declarat a places.js 
type:
[{ id: str, title:str, descripcio: str,mides: str, preu: int, img:list[str],lat: int,long: int },...] */

let map;

/*
Coses a revisar:
-Actualitzo el llistat de lesquerra des del mapa :(
*/

function initMap() {
  let lastInfowindow;
  let markers = [];

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: CustomMapStyles,
    minZoom: 12,
    maxZoom: 20,
    center: { lat: 41.390205, lng: 2.154007 },
    disableDefaultUI: true, //elimina default google maps gui
    gestureHandling: "greedy",
    zoomControl: true,
  });



  let url_init = new URL(document.baseURI);
  if (url_init.searchParams.get("lat") && url_init.searchParams.get("lng")) {
    map.setCenter(new google.maps.LatLng(url_init.searchParams.get("lat"), url_init.searchParams.get("lng")));
  }
  let infowindow = new google.maps.InfoWindow({ maxWidth: 400 }); //objecte infowindow per afegir als markers

  // Autocomplete
  const input = document.getElementById("search-box");
  const options = {
    componentRestrictions: { country: "es" }
  };

  var autocomplete = new google.maps.places.Autocomplete(input, options);


  // Enable marker clustering for this map and these markers
  let marker_clusterer = new MarkerClusterer(map, markers, {
    maxZoom: 18,
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
  });

  // var new_bound; /* Variable per guardar les bounds actualitzades */
  autocomplete.addListener('place_changed', () => {
    var new_place = autocomplete.getPlace();
    if (!new_place.geometry) {
      window.alert("Cap resultat per: '" + new_place.name + "'");
      document.getElementById("search-box").placeholder = "";
      return;
    }
    if (new_place.length == 0) {
      return;
    }
    map.setCenter(new_place.geometry.location);
    map.setZoom(13);
    check_bounds();
    url_init.searchParams.set("lat", new_place.geometry.location.lat());
    url_init.searchParams.set("lng", new_place.geometry.location.lng());
    window.history.pushState("string", "Title", url_init);

  });


  map.addListener("zoom_changed", () => { /* Envia coordenades quan es canvia el zoom del mapa */
    var map_bounds = map.getBounds()
    setTimeout(function () {
      if (map_bounds != map.getBounds()) {

        check_bounds()
      }
    }, 200) //TODO: 200 ms canviar a 0
  });
  google.maps.event.addListenerOnce(map, 'idle', () => {
    var map_bounds = map.getBounds()
    setTimeout(function () {
      if (map_bounds != map.getBounds()) {
        getType()
        check_bounds()
      }
    }, 200) //TODO: 200 ms canviar a 0
  });

  map.addListener('dragend', () => { /* Envia info quan el mapa es mou amb el ratoli */
    var map_bounds = map.getBounds()
    setTimeout(function () {
      if (map_bounds != map.getBounds()) {
        check_bounds()
      }
    }, 200) //TODO: 200 ms canviar a 0
  });




  function check_bounds() {
    //checkeja si hi ha elements a dins del bound actual i afegeix els markers corresponents.
    var bound = map.getBounds();
    var places = get_places();   //cridar api per agafar llocs
    var no_result = true; //variable per controlar si no hi ha resultats de busqueda
    var llistat_esquerra = []; //llista per guardar els html i passaro despres
    markers = [];
    marker_clusterer.clearMarkers();

    for (let i = 0; i < places.length; i++) {
      var pos = new google.maps.LatLng(places[i].lat, places[i].lng);
      if (bound.contains(pos)) {
        no_result = false;
        var html = getHtml(places[i]); // retorna el html personalitzat pel place
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          visible: true,
          // animation: google.maps.Animation.BOUNCE
        });

        markers[places[i]._id] = marker;
        marker_clusterer.addMarker(marker);
        afegir_infowindow_marker(map, marker, html, lastInfowindow, infowindow);
        llistat_esquerra += actualitzar_llistat(places[i]);
        markers[places[i]._id].place = places[i]; //guardem el lloc per poder obtenir el html de la infowindow
        markers[places[i]._id].id = places[i]._id;



      } else {
        if (markers.hasOwnProperty(places[i]._id)) {
          // si existeix el marker el fa invisible
          //TODO: eliminar marker?
          marker_clusterer.removeMarker(places[i]._id);
          markers[places[i]._id].setVisible(false);
        }
      }
    }
    if (no_result == true) {
      actualitzar_llistat_notfound(); //si no_result esta a true, no hi ha cap marker localitzat al mapa actual 
    }
    else {
      document.getElementById('taula_disponible').innerHTML = llistat_esquerra;
      markers.forEach(elements => {
        document.getElementById("id_mouse" + elements.id).addEventListener("mouseenter", function () {
          closeLastInfowindow(lastInfowindow);
          infowindow.setContent(getHtml(elements.place));
          infowindow.open(map, elements);
          lastInfowindow = infowindow;
        });

        document.getElementById("id_mouse" + elements.id).addEventListener("mouseleave", function () {
          closeLastInfowindow(lastInfowindow);
        });
      });
    }
  }




} //end map part




function closeLastInfowindow(lastInfowindow) {
  if (lastInfowindow) {
    lastInfowindow.close();
  }
}

function afegir_infowindow_marker(map, marker, html, lastInfowindow, infowindow) {
  google.maps.event.addListener(marker, "click", () => { //afegeix infowindow al marker
    closeLastInfowindow(lastInfowindow)
    infowindow.setContent(html)
    infowindow.open(map, marker)
    lastInfowindow = infowindow
  });
}

function actualitzar_llistat_notfound() {
  var html_llistat_notfound =
    `<div class=" border-b-2 m-2 p-3 overflow-y-visible">
    <h1 class="font-black text-2xl">Cap resultat a la cerca</h1>
    <p class="text-gray-900">Intenta-ho de nou</p>
    </div>`
  document.getElementById('taula_disponible').innerHTML = html_llistat_notfound;

}

function getHtml(place) {
  var html_generate;
  if (place.images.length == 1) {
    html_generate = `
  <div id = "mydiv" class="rounded overflow-y-hidden overflow-x-hidden">
    <h1 class="title font-black text-3xl center-text p-1 m-1">${place.title}</h1>
      <div class="containter-md m-1 p-1 text-center">
        <img src="${place.images[0]}" class="img-fluid rounded-xl" heigth = "200px" width="300px" > 
      </div>
      <div>
        <p>Espai:${place.measures}</p>  
      </div>
      <div>
        <p> PREU:
          <div class="text-xl text-[#2b6777] font-bold font-sans shadow-s w-16">
          ${place.price}€
          </div>
        </p>
      </div>
     
  </div>`
  } else {
    html_generate = `
  <div id = "mydiv" class="rounded overflow-y-hidden overflow-x-hidden">
    <h1 class="title font-black text-3xl center-text p-1 m-1">${place.title}</h1>
      <div class="containter-md m-1 p-1 text-center">
        <input id="infowindow_input_`+ place.id + `" type="hidden" value="0">
        <div class = "text-left-infowindow arrow arrow-left" onclick="previous_infowindow(`+ place.id + `)"></div>
        <img class = "image  rounded-lg" id="infowindow_slider_`+ place.id + `" src= "${place.images[0]}" value = "` + place.images + `" width="300px" height="200px">
        <div class = "text-right-infowindow arrow arrow-right" onclick="next_infowindow(`+ place.id + `)"></div>
      </div>
      <div>
        <p>Espai:${place.measures}</p>  
      </div>
      <div>
        <p> PREU:
          <div class="text-xl text-[#2b6777] font-bold font-sans shadow-s w-16">
          ${place.price}€
          </div>
        </p>
      </div>
     
  </div>`

  }
  return html_generate;
}


function get_places() {
  var next_url = new URL(document.baseURI);
  console.log("/api/get_places" + next_url.search);
  var url = "/api/get_places" + next_url.search;
  var msg = [];

  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      msg = JSON.parse(request.responseText)["msg"];
    }
  }
  request.open("GET", url, false); //TODO: mirar fer async
  request.send();
  if (msg != []) {
    return msg;
  }
}



function changeButtonMap() {
  //TODO: canviar per toggle
  document.getElementById('div_taula').classList.add('invisible');
  document.getElementById('div_taula').style.display = 'none';
  document.getElementById('div_mapa').classList.remove('invisible', 'h-0');
  document.getElementById('div_mapa').classList.add('h-screen');
}
function changeButtonList() {
  //TODO: canviar per toggle
  document.getElementById('div_taula').classList.remove('invisible');
  document.getElementById('div_taula').style.display = 'inline';
  document.getElementById('div_mapa').classList.add('invisible', 'h-0');
  document.getElementById('div_mapa').classList.remove('h-screen');
}

function getType() {
  let url = new URL(document.baseURI);
  if (!url.searchParams.has("type")) {
    changeStorage();
  } else {
    if (url.searchParams.get("type") == "parking") {
      changeParking();
    }
  }

}

function changeParking() {
  let url = new URL(document.baseURI);
  if (!url.searchParams.has("type")) {
    url.searchParams.set("type", "parking");
    window.history.pushState("string", "Title", url);

  } else {
    if (url.searchParams.get("type") == "storage") {
      console.log("type", url.searchParams.get("type"));
      url.searchParams.set("type", "parking");
      window.history.pushState("string", "Title", url);
    } else if (url.searchParams.get("type") != "parking") {
      url.searchParams.set("type", "parking");
      window.history.pushState("string", "Title", url);

    }
  }
  var storage_button = document.getElementById("storage_button");
  storage_button.classList.remove('text-[#52ab98]', 'font-black', 'border-[#52ab98]');
  storage_button.classList.add('text-white', 'border-white');

  var parking_button = document.getElementById('parking_button');
  parking_button.classList.remove('text-white', 'border-white');
  parking_button.classList.add('text-[#52ab98]', 'font-black', 'border-[#52ab98]');
  //TODO:falta crida funcio per filtrar
  //check_bounds(map.getBounds(),"changeParking");
  map.setZoom(map.getZoom());

}

function changeStorage() {
  let url = new URL(document.baseURI);
  if (!url.searchParams.has("type")) {
    url.searchParams.set("type", "storage");
    window.history.pushState("string", "Title", url);

  } else {
    if (url.searchParams.get("type") == "parking") {
      console.log("type", url.searchParams.get("type"));
      url.searchParams.set("type", "storage");
      window.history.pushState("string", "Title", url);
    } else if (url.searchParams.get("type") != "storage") {
      url.searchParams.set("type", "storage");
      window.history.pushState("string", "Title", url);

    }
  }

  var storage_button = document.getElementById("storage_button");
  storage_button.classList.remove('text-white', 'border-white');
  storage_button.classList.add('text-[#52ab98]', 'font-black', 'border-[#52ab98]');

  var parking_button = document.getElementById('parking_button');
  parking_button.classList.remove('text-[#52ab98]', 'font-black', 'border-[#52ab98]');
  parking_button.classList.add('text-white', 'border-white');
  //TODO: check_bounds(map.getBounds(),"changeStorage");
  //falta crida funcio per filtrar
  map.setZoom(map.getZoom());
}




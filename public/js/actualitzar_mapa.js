function next_infowindow(id_place) {
  next(id_place, "infowindow");
}
function previous_infowindow(id_place) {
  previous(id_place, "infowindow");
}
function next(id_place, type) {
  if (type == "infowindow") {
    var slider = document.getElementById('infowindow_slider_' + id_place);
    var images = slider.attributes.value.value.split(',');
    var value = document.getElementById('infowindow_input_' + id_place).value;

  }
  else {
    var slider = document.getElementById('slider_' + id_place);
    var images = slider.attributes.value.value.split(',');
    var value = document.getElementById('input_' + id_place).value;
  }

  try {
    value = parseInt(value);

  } catch (error) {
    slider.src = images[0];
  }
  value++;

  if (value > images.length - 1)//images is the defined arary
  {
    value = 0;
    //if the condition is true num is defined to hold to last image of the slider
  }

  slider.src = images[value];
  if (type == "infowindow") {
    document.getElementById('infowindow_input_' + id_place).value = value;

  } else {
    document.getElementById('input_' + id_place).value = value;
  }

}

function previous(id_place, type) {
  if (type == "infowindow") {
    var slider_previous = document.getElementById('infowindow_slider_' + id_place);
    var images_previous = slider_previous.attributes.value.value.split(',');
    var value_img = document.getElementById('infowindow_input_' + id_place).value;
  } else {
    var slider_previous = document.getElementById('slider_' + id_place);
    var images_previous = slider_previous.attributes.value.value.split(',');
    var value_img = document.getElementById('input_' + id_place).value;

  }

  try {
    value_img = parseInt(value_img);

  } catch (error) {
    slider_previous.src = images[0];
  }
  value_img--;

  if (value_img < 0)//images is the defined arary
  {
    value_img = images_previous.length - 1;
    //if the condition is true num is defined to hold to last image of the slider
  }

  slider_previous.src = images_previous[value_img];
  if (type == "infowindow") {
    document.getElementById('infowindow_input_' + id_place).value = value_img;

  } else {
    document.getElementById('input_' + id_place).value = value_img;
  }
}

function actualitzar_llistat(place) {
  var html_llistat;
  try {
    id = place._id;
  } catch (err) {
    console.log('err :>> ', err);
  }
  if (place.images.length == 1) {
    html_llistat =
      `<div class="grid max-w-max md:grid-cols-2  sm:grid-cols-1 border-b-2 m-2 p-2  items-center  hover:shadow-md md:hover:shadow-none md:transform hover:scale-105 motion-reduce:transform-none" id="id_mouse` + id + `" >
           <div class="col-span-1 px-2 max-w-screen-md"> <!--imatges-->
             <img class = " image h-max  w-full rounded-lg object-cover" src= "${place.images[0]}">
           </div>
           <div class="col-span-1 px-4  py-2 w-full text-left "> <!--informacio local-->
             <div>
             <h1 class="font-black text-2xl text-[#2b6777]">${place.title} </h1>
             <hr class="border-b-2 w-3/5 border-[#2b6777] my-2">
             <p class = "text-lg">${place.description}Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, ipsam.</p>
             <div>
               <p class = "text-lg">Espai: ${place.measures}</p>  
             </div>
             <p class="text-left text-[#2b6777] text-3xl font-black ">${place.price} €/m2</p>
             <a href="place/${place.id}">
              <button class="mt-8 rounded-full p-2 bg-white text-center border-2 text-[#2b6777] hover:bg-[#e9fffa] font-black text-lg focus:outline-none transition duration-300">
              Veure més info
              </button>
             </a> 
             </div>
           </div>
         </div>
         </div>`;


  } else {
    html_llistat =
      `
      <div class="grid max-w-max h-max md:grid-cols-2  sm:grid-cols-1 border-b-2 m-2 p-2   md:hover:shadow-none md:transform hover:scale-105 motion-reduce:transform-none"  id="id_mouse` + id + `">
         <div class="col-span-1 container px-2 max-w-screen-md"> <!--imatges-->
             <input id="input_`+ id + `" type="hidden" value="0">
             <div class = "text-left arrow arrow-left" onclick="previous('`+ id + `')"></div>
             <img class = "image   w-full rounded-lg object-cover" id="slider_`+ id + `" src= "${place.images[0]}" value = "` + place.images + `">
             <div class = "text-right arrow arrow-right" onclick="next('`+ id + `')"></div>
         </div>
         <div class="col-span-1 px-4 py-2  w-full text-left "> <!--informacio local-->
           <div>
             <h1 class="font-black text-2xl text-[#2b6777]">${place.title} </h1>
             <hr class="border-b-2 w-3/5 border-[#2b6777] my-2">
             <p class = "text-lg">${place.description}Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, ipsam.</p>
             <div>
               <p class = "text-lg">Espai: ${place.measures}</p>  
             </div>
             <p class="text-left text-[#2b6777] text-3xl font-black ">${place.price} €/m2</p>
             <a href="place/${place.id}">
               <button class="mt-8 rounded-full p-2 bg-white text-center border-2 text-[#2b6777] hover:bg-[#e9fffa] font-black text-lg focus:outline-none transition duration-300">
               Veure més info
               </button>
             </a> 
            </div>
            </a>
         </div>
       </div>`;
  }

  return html_llistat;
}
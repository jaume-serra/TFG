function next_infowindow(id_place){
  next(id_place,"infowindow");
}
function previous_infowindow(id_place){
  previous(id_place,"infowindow");
}
function next(id_place,type)
{
  if(type == "infowindow"){
    var slider =document.getElementById('infowindow_slider_'+id_place);
    var images = slider.attributes.value.value.split(',');
    var value =document.getElementById('infowindow_input_'+id_place).value;

  }
  else{
    var slider =document.getElementById('slider_'+id_place);
    var images = slider.attributes.value.value.split(',');
    var value =document.getElementById('input_'+id_place).value;
  }
 
  try { 
    value = parseInt(value);

  }catch(error){
    slider.src=images[0];
  }
  value ++;

  if(value> images.length-1)//images is the defined arary
  {
    value = 0;
    //if the condition is true num is defined to hold to last image of the slider
  }

  slider.src=images[value];
  console.log("img:",images[value],value);
  if(type == "infowindow"){
    document.getElementById('infowindow_input_'+id_place).value = value;

  }else{
    document.getElementById('input_'+id_place).value = value;
  }

}

function previous(id_place,type)
{
  if(type == "infowindow"){
    var slider_previous =document.getElementById('infowindow_slider_'+id_place);
    var images_previous = slider_previous.attributes.value.value.split(',');
    var value_img =document.getElementById('infowindow_input_'+id_place).value;
  }else{
    var slider_previous =document.getElementById('slider_'+id_place);
    var images_previous = slider_previous.attributes.value.value.split(',');
    var value_img =document.getElementById('input_'+id_place).value;
  
  }

  try { 
    value_img = parseInt(value_img);

  }catch(error){
    slider_previous.src=images[0];
  }
  value_img --;

  if(value_img<0)//images is the defined arary
  {
    value_img = images_previous.length-1;
    //if the condition is true num is defined to hold to last image of the slider
  }

  slider_previous.src=images_previous[value_img];
  if(type == "infowindow"){
    document.getElementById('infowindow_input_'+id_place).value = value_img;

  }else{
    document.getElementById('input_'+id_place).value = value_img;
  }  
}

function actualitzar_llistat(place){
    var html_llistat;
    if(place.img.length == 1){
      html_llistat = 
      `<div class="grid max-w-max md:grid-cols-2  sm:grid-cols-1 border-b-2 m-2 p-2 z-0 items-center  hover:shadow-md md:hover:shadow-none md:transform hover:scale-105 motion-reduce:transform-none" id="id_mouse`+place.id+`" >
           <div class="col-span-1 px-2 max-w-screen-md"> <!--imatges-->
             <img class = " image h-max  w-full rounded-lg object-cover" src= "${place.img[0]}">
           </div>
           <div class="col-span-1 px-4  py-2 w-full text-left "> <!--informacio local-->
             <div>
               <h1 class="font-black">${place.title} </h1>
               <p>${place.description}Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, ipsam.</p>
               <div>
                 <p>Espai: ${place.mides}</p>  
               </div>
               <p class="text-left text-purple-600 text-3xl font-black ">${place.preu} €/m2</p>
             </div>
           </div>
         </div>
         </div>`;
  

 }else{
     html_llistat = 
     `<div class="grid max-w-max h-max md:grid-cols-2  sm:grid-cols-1 border-b-2 m-2 p-2 z-0  md:hover:shadow-none md:transform hover:scale-105 motion-reduce:transform-none"  id="id_mouse`+place.id+`">
         <div class="col-span-1 container px-2 max-w-screen-md"> <!--imatges-->
             <input id="input_`+place.id+`" type="hidden" value="0">
             <div class = "text-left arrow arrow-left" onclick="previous(`+place.id+`)"></div>
             <img class = "image   w-full rounded-lg object-cover" id="slider_`+place.id+`" src= "${place.img[0]}" value = "`+place.img+`">
             <div class = "text-right arrow arrow-right" onclick="next(`+place.id+`)"></div>
         </div>
         <div class="col-span-1 px-4   w-full text-left "> <!--informacio local-->
           <div>
             <h1 class="font-black">${place.title} </h1>
             <p>${place.description}Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, ipsam.</p>
             <div>
               <p>Espai: ${place.mides}</p>  
             </div>
             <p class="text-left text-purple-600 text-3xl font-black ">${place.preu} €/m2</p>
     
           </div>
         </div>
       </div>`;
 }

return html_llistat;
}
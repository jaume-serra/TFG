

  /* Codi repetit */

function changeVisibility(){
    let visibility = document.getElementById("off_site-object");
    let doc = document.getElementsByClassName("offsite-container")[0];
    let background = document.getElementsByClassName("change-bg")
    
    doc.classList.toggle('offsite-is-open');
    visibility.classList.toggle("hidden");
    background[0].classList.toggle("opacity-25");
    background[1].classList.toggle("opacity-25");
    
}
  
  
function showDropDown(){
  
    const menuDrop = document.querySelector('#user-menu-dropdown');
    menuDrop.classList.toggle('hidden');
    menuDrop.classList.toggle('flex');
  
}
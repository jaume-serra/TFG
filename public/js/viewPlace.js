const showMobile = document.getElementById('showMobile');


showMobile.addEventListener('click', () => {
    //Ensenyar anunci
    //Ensenyar mobil
    const mobileNum = document.getElementById('mobileNum')
    const showMobile = document.getElementById('showMobile');

    showMobile.classList.add('hidden')
    mobileNum.classList.remove('hidden')

})


function initMaps() {
    let map = new google.maps.Map(document.getElementById("mapa"), {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: CustomMapStyles,
        minZoom: 14,
        maxZoom: 18,
        center: { lat: 41.390205, lng: 2.154007 },
        disableDefaultUI: true, //elimina default google maps gui
        gestureHandling: "greedy",
        zoomControl: true,
    });
    let url_init = new URL(document.baseURI);
    if (url_init.searchParams.get("lat") && url_init.searchParams.get("lng")) {
        const position = new google.maps.LatLng(url_init.searchParams.get("lat"), url_init.searchParams.get("lng"))
        map.setCenter(position);
        let marker = new google.maps.Marker({
            position,
            map,
            visible: true,
        })
    }

}
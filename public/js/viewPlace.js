const showInfo = document.getElementById('showNumber');




showInfo.addEventListener('click', () => {
    //Ensenyar anunci
    //Ensenyar mobil
    
    setTimeout(() => {}, "2000")

    document.getElementById('mobileNum').classList.remove("hidden")
    document.getElementById('showNumber').classList.add("hidden")

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
        const marker = new google.maps.Marker({
            position,
            map,
            visible: true,
        })
    }

}



const loginToComment = () => {
    const url = new URL(document.baseURI);
    window.location.href = `/login?next=${url.pathname + url.search}`
}
const input1 = document.getElementById('input-1')
const input2 = document.getElementById('input-2')
const input3 = document.getElementById('input-3')
const input4 = document.getElementById('input-4')
const input5 = document.getElementById('input-5')

// const inputs = [input1,input2,input3,input4,input5]
const star1 = document.getElementById('star-1')
const star2 = document.getElementById('star-2')
const star3 = document.getElementById('star-3')
const star4 = document.getElementById('star-4')
const star5 = document.getElementById('star-5')

star1.addEventListener('click', () => {

    input1.getElementsByClassName("input")[0].value = 1
    input2.getElementsByClassName("input")[0].value = ""
    input3.getElementsByClassName("input")[0].value = ""
    input4.getElementsByClassName("input")[0].value = ""
    input5.getElementsByClassName("input")[0].value = ""

    star2.classList.remove('text-yellow-600')
    star2.classList.add('text-gray-400')
    star3.classList.remove('text-yellow-600')
    star3.classList.add('text-gray-400')
    star4.classList.remove('text-yellow-600')
    star4.classList.add('text-gray-400')
    star5.classList.remove('text-yellow-600')
    star5.classList.add('text-gray-400')
})
star2.addEventListener('click', () => {

    input1.getElementsByClassName("input")[0].value = ""
    input2.getElementsByClassName("input")[0].value = 2
    input3.getElementsByClassName("input")[0].value = ""
    input4.getElementsByClassName("input")[0].value = ""
    input5.getElementsByClassName("input")[0].value = ""
    star2.classList.add('text-yellow-600')
    star2.classList.remove('text-gray-400')

    star3.classList.remove('text-yellow-600')
    star3.classList.add('text-gray-400')
    star4.classList.remove('text-yellow-600')
    star4.classList.add('text-gray-400')
    star5.classList.remove('text-yellow-600')
    star5.classList.add('text-gray-400')
})

star3.addEventListener('click', () => {

    input1.getElementsByClassName("input")[0].value = ""
    input2.getElementsByClassName("input")[0].value = ""
    input3.getElementsByClassName("input")[0].value = 3
    input4.getElementsByClassName("input")[0].value = ""
    input5.getElementsByClassName("input")[0].value = ""
    star2.classList.add('text-yellow-600')
    star2.classList.remove('text-gray-400')

    star3.classList.add('text-yellow-600')
    star3.classList.remove('text-gray-400')

    star4.classList.remove('text-yellow-600')
    star4.classList.add('text-gray-400')
    star5.classList.remove('text-yellow-600')
    star5.classList.add('text-gray-400')
})

star4.addEventListener('click', () => {

    input1.getElementsByClassName("input")[0].value = ""
    input2.getElementsByClassName("input")[0].value = ""
    input3.getElementsByClassName("input")[0].value = ""
    input4.getElementsByClassName("input")[0].value = 4
    input5.getElementsByClassName("input")[0].value = ""
    star2.classList.add('text-yellow-600')
    star2.classList.remove('text-gray-400')

    star3.classList.add('text-yellow-600')
    star3.classList.remove('text-gray-400')

    star4.classList.add('text-yellow-600')
    star4.classList.remove('text-gray-400')

    star5.classList.remove('text-yellow-600')
    star5.classList.add('text-gray-400')
})

star5.addEventListener('click', () => {
    input1.getElementsByClassName("input")[0].value = ""
    input2.getElementsByClassName("input")[0].value = ""
    input3.getElementsByClassName("input")[0].value = ""
    input4.getElementsByClassName("input")[0].value = ""
    input5.getElementsByClassName("input")[0].value = 5
    star2.classList.add('text-yellow-600')
    star2.classList.remove('text-gray-400')

    star3.classList.add('text-yellow-600')
    star3.classList.remove('text-gray-400')

    star4.classList.add('text-yellow-600')
    star4.classList.remove('text-gray-400')

    star5.classList.add('text-yellow-600')
    star5.classList.remove('text-gray-400')
})
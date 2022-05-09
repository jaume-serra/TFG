const showMobile = document.getElementById('showMobile');


showMobile.addEventListener('click', () => {
    //Ensenyar anunci
    //Ensenyar mobil
    const mobileNum = document.getElementById('mobileNum')
    const showMobile = document.getElementById('showMobile');

    showMobile.classList.add('hidden')
    mobileNum.classList.remove('hidden')

})
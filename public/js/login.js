function onSignIn(googleUser) {
    // The ID token you need to pass to your backend:
    var id_token = googleUser.credential;
    var xhr = new XMLHttpRequest();
    //Realitzem una consulta al backend
    xhr.open('POST', 'https://www.getkeepers.net/login')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = function () {
        if (xhr.response === 'success') {
            //Si la resposta és correcte, redirigim al perfil
            let nextURL = new URLSearchParams(location.search).get("next")
            if (nextURL) {
                location.assign(nextURL)
            } else {
                location.assign("/user/profile")
            }
        }
    }
    xhr.send(JSON.stringify({ token: id_token }))
}
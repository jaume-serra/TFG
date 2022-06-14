function onSignIn(googleUser) {
    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.getkeepers.net/login')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = function () {
        console.log(xhr.response)
        if (xhr.response === 'success') {
            signOut();
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


function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out');
    });

}
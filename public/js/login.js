function onSignIn(googleUser) {
  /*// Useful data for your client-side scripts:
    console.log("holaaa");
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());*/
  // The ID token you need to pass to your backend:
  //var id_token = googleUser.getAuthResponse().id_token;
  //console.log("ID Token: " + id_token);
  /* 

    let data = {'idtoken':id_token,'profile': googleUser.getBasicProfile()};
  
    fetch("/api/tokensignin", {
        method: "POST",
        headers: {'Content-Type': 'application/json'} ,
        body: JSON.stringify(data)
      }).then(res => {
        console.log("Request complete! response:", res);
        window.location.href="/";

    });

    */
}

function Validate() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("passwordRepeat").value;
    if (password !== confirmPassword) {
        alert("Les contrasenyes no coincideixen.");
        return false;
    }
    return true;
}
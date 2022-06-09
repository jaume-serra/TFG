if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/public/js/sw.js', { scope: '/' })
        .then((reg) => console.log(""))
        .catch((error) => console.log("error", error))
}
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/public/js/sw.js', { scope: '/' })
        .then((reg) => console.log("SW registred", reg))
        .catch((error) => console.log("error", error))
}
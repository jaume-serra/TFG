
const CACHE_NAME = 'sw-cache'
const toCache = [
    '/'
]
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(toCache)
            })
            .then(self.skipWaiting())
    )

})

self.addEventListener('activate', (evt) => {
    console.log('')
})

self.addEventListener('fetch', (evt) => {

})
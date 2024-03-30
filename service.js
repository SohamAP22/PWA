// var staticCacheName = "pwa";

// self.addEventListener("install", function (e) {
// e.waitUntil(
// 	caches.open(staticCacheName).then(function (cache) {
// 	return cache.addAll(["/"]);
// 	})
// );
// });

// self.addEventListener("fetch", function (event) {
// console.log(event.request.url);

// event.respondWith(
// 	caches.match(event.request).then(function (response) {
// 	return response || fetch(event.request);
// 	})
// );
// });
var staticCacheName = "pwa-v1"; // Update cache name with versioning
self.addEventListener("install", function (e) {
e.waitUntil(
caches.open(staticCacheName).then(function (cache) {
return cache.addAll([
'/', // Add your homepage and other important routes here
'/index.html',
]);
})
);
});
self.addEventListener("activate", async (event) => {
// Subscribe to push notifications
const subscription = await self.registration.pushManager.subscribe({});
console.log(subscription);
// Clear old caches
event.waitUntil(
caches.keys().then(function (cacheNames) {
return Promise.all(
cacheNames.filter(function (cacheName) {
// Return true if you want to remove this cache, false otherwise
return cacheName.startsWith("pwa-") && cacheName !== staticCacheName;
}).map(function (cacheName) {
return caches.delete(cacheName);
})
);
})
);
});

self.addEventListener("fetch", function (event) {
event.respondWith(
caches.match(event.request).then(function (response) {
return response || fetch(event.request);
})
);
});
self.addEventListener('sync', event => {
if(event.tag == 'syncMessage'){
console.log("Sync successful");
}
});

self.addEventListener('push', function(event){
if(event.data){
var data = event.data.json();
if(data.method == "pushMessage"){
console.log("Push notification sent");
event.waitUntil(
self.registration.showNotification("new notification", {
body: data.message
})
);
}
}
});
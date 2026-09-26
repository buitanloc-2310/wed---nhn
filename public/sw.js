const CACHE='nhn-web-hoclieu-logo-20260926';
const CORE=['/','/manifest.webmanifest','/brand/nhn-logo-2026.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin||new URL(r.url).pathname.startsWith('/api/'))return;e.respondWith(fetch(r).then(res=>{if(res.ok&&['document','style','script','image','font'].includes(r.destination)){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(x=>x||caches.match('/'))))});

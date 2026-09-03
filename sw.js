/* Service worker do Checklist de Bancada.
   Guarda os arquivos no aparelho para o app abrir sem internet.
   Ao alterar o index.html, troque o numero da versao abaixo
   (ex.: v1 -> v2) para o celular buscar a versao nova. */

const VERSAO = "checklist-v12";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

// instala: baixa e guarda tudo
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSAO)
      .then((c) => c.addAll(ARQUIVOS))
      .then(() => self.skipWaiting())
  );
});

// ativa: apaga versoes antigas
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((chaves) => Promise.all(
        chaves.filter((k) => k !== VERSAO).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// responde: usa o que esta guardado; se nao tiver, busca na rede
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((achou) => {
      if (achou) return achou;
      return fetch(e.request).catch(() => caches.match("./index.html"));
    })
  );
});

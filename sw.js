const CACHE = "skylog-cache-v1";
function render() {
  const list = document.getElementById("list");
  let data = JSON.parse(localStorage.getItem("skylog") || "[]");

  if (currentTag) {
    data = data.filter(e => e.tags.includes(currentTag));
  }

  list.innerHTML = "";

  data.forEach(e => {
    const div = document.createElement("div");
    div.className = "card entry";

    const tagHTML = e.tags.map(tag =>
      `<span class="tag" onclick="filterTag('${tag}')">${tag}</span>`
    ).join(" ");

    div.innerHTML = `
      <div>${e.mood || ""}</div>
      <div>${e.text}</div>
      <div class="small">${tagHTML}</div>
      <div class="small">${e.date}</div>
    `;

    list.appendChild(div);
  });
}
function filterTag(tag) {
  currentTag = tag;
  render();
}
let currentTag = null;
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
document.getElementById("text").focus();

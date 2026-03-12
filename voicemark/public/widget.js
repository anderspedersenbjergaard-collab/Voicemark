(function () {
  "use strict";

  var SUPABASE_URL = "https://dcjfuwapheupwxnroizo.supabase.co";
  var SUPABASE_KEY = "sb_publishable_DPLOo-i8GB8bFyZ04abC4w_ffuUKYV1";

  function stars(n) {
    return "★".repeat(n) + "☆".repeat(5 - n);
  }

  function initials(name) {
    return (name || "?")[0].toUpperCase();
  }

  // Deterministic avatar color from name
  var COLORS = ["#0d9488","#7c3aed","#b45309","#0369a1","#be185d","#15803d","#c2410c"];
  function avatarColor(name) {
    var hash = 0;
    for (var i = 0; i < (name || "").length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return COLORS[Math.abs(hash) % COLORS.length];
  }

  var CSS = [
    ".vm-widget{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;line-height:1.5;color:#0f0e0c;box-sizing:border-box}",
    ".vm-widget *{box-sizing:border-box}",
    ".vm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}",
    ".vm-tile{background:#fff;border:1px solid #e8e4dd;border-radius:8px;padding:20px}",
    ".vm-stars{color:#d97706;font-size:15px;margin-bottom:8px;letter-spacing:1px}",
    ".vm-text{font-size:14px;line-height:1.65;color:#3a3630;margin-bottom:14px;overflow-wrap:break-word}",
    ".vm-author{display:flex;align-items:center;gap:10px}",
    ".vm-avatar{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0}",
    ".vm-name{font-size:13px;font-weight:600;color:#0f0e0c}",
    ".vm-role{font-size:12px;color:#8a857d}",
    ".vm-badge{margin-top:20px;text-align:center;font-size:11px;color:#8a857d}",
    ".vm-badge a{color:#0d9488;text-decoration:none;font-weight:500}",
    ".vm-badge a:hover{text-decoration:underline}",
    ".vm-empty{text-align:center;padding:32px;color:#8a857d;font-size:14px}",
    ".vm-error{text-align:center;padding:32px;color:#dc2626;font-size:13px}"
  ].join("");

  function injectCSS() {
    if (document.getElementById("vm-styles")) return;
    var style = document.createElement("style");
    style.id = "vm-styles";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function fetchReviews(userId, callback) {
    var url = SUPABASE_URL + "/rest/v1/reviews?user_id=eq." + encodeURIComponent(userId) +
      "&status=eq.approved&order=created_at.desc&limit=20";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("apikey", SUPABASE_KEY);
    xhr.setRequestHeader("Authorization", "Bearer " + SUPABASE_KEY);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (xhr.status === 200) {
        try { callback(null, JSON.parse(xhr.responseText)); }
        catch (e) { callback("Parse error"); }
      } else {
        callback("HTTP " + xhr.status);
      }
    };
    xhr.onerror = function () { callback("Network error"); };
    xhr.send();
  }

  function renderTile(review) {
    var tile = document.createElement("div");
    tile.className = "vm-tile";

    var starsEl = document.createElement("div");
    starsEl.className = "vm-stars";
    starsEl.textContent = stars(review.rating);

    var text = document.createElement("div");
    text.className = "vm-text";
    text.textContent = "\u201C" + review.text + "\u201D";

    var author = document.createElement("div");
    author.className = "vm-author";

    var avatar = document.createElement("div");
    avatar.className = "vm-avatar";
    avatar.style.background = avatarColor(review.name);
    avatar.textContent = initials(review.name);

    var meta = document.createElement("div");
    var name = document.createElement("div");
    name.className = "vm-name";
    name.textContent = review.name || "";
    meta.appendChild(name);

    if (review.role) {
      var role = document.createElement("div");
      role.className = "vm-role";
      role.textContent = review.role;
      meta.appendChild(role);
    }

    author.appendChild(avatar);
    author.appendChild(meta);

    tile.appendChild(starsEl);
    tile.appendChild(text);
    tile.appendChild(author);
    return tile;
  }

  function render(container, reviews) {
    container.innerHTML = "";
    container.className = "vm-widget";

    if (!reviews || reviews.length === 0) {
      var empty = document.createElement("div");
      empty.className = "vm-empty";
      empty.textContent = "No reviews yet.";
      container.appendChild(empty);
      return;
    }

    var grid = document.createElement("div");
    grid.className = "vm-grid";
    reviews.forEach(function (r) { grid.appendChild(renderTile(r)); });
    container.appendChild(grid);

    var badge = document.createElement("div");
    badge.className = "vm-badge";
    badge.innerHTML = "Powered by <a href=\"https://www.voicemark.co\" target=\"_blank\" rel=\"noopener noreferrer\">Voicemark</a>";
    container.appendChild(badge);
  }

  function init(scriptTag) {
    var userId = scriptTag.getAttribute("data-id");
    if (!userId) {
      console.warn("[Voicemark] Missing data-id attribute on widget script tag.");
      return;
    }

    // Find or create a container immediately after the script tag
    var containerId = "vm-widget-" + userId.slice(0, 8);
    var container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
    }

    container.className = "vm-widget";
    container.textContent = "Loading reviews\u2026";

    fetchReviews(userId, function (err, reviews) {
      if (err) {
        container.innerHTML = "";
        var errEl = document.createElement("div");
        errEl.className = "vm-error";
        errEl.textContent = "Could not load reviews.";
        container.appendChild(errEl);
        return;
      }
      render(container, reviews);
    });
  }

  function bootstrap() {
    injectCSS();
    // Find the script tag that loaded this file
    var scripts = document.querySelectorAll('script[src*="widget.js"][data-id]');
    for (var i = 0; i < scripts.length; i++) {
      init(scripts[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();

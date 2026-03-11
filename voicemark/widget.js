(function () {
  const SUPABASE_URL = "https://dcjfuwapheupwxnroizo.supabase.co";
  const SUPABASE_KEY = "sb_publishable_DPLOo-i8GB8bFyZ04abC4w_ffuUKYV1";

  const script = document.currentScript;
  const userId = script ? script.getAttribute("data-id") : null;

  if (!userId) {
    console.warn("[Voicemark] Missing data-id attribute on script tag.");
    return;
  }

  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  const css = `
    .vm-widget{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:900px;margin:0 auto}
    .vm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
    .vm-tile{background:#fff;border:1px solid #e8e4dd;border-radius:10px;padding:18px;transition:box-shadow .2s}
    .vm-tile:hover{box-shadow:0 4px 20px rgba(0,0,0,.08)}
    .vm-stars{color:#d97706;font-size:14px;margin-bottom:8px}
    .vm-text{font-size:14px;line-height:1.65;color:#3a3630;margin-bottom:14px}
    .vm-author{display:flex;align-items:center;gap:10px}
    .vm-avatar{width:32px;height:32px;border-radius:50%;background:#0d9488;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:white;flex-shrink:0}
    .vm-name{font-size:13px;font-weight:600;color:#0f0e0c}
    .vm-role{font-size:12px;color:#8a857d}
    .vm-badge{text-align:center;margin-top:14px;font-size:11px;color:#8a857d}
    .vm-badge a{color:#0d9488;text-decoration:none;font-weight:500}
    .vm-empty{text-align:center;padding:32px;color:#8a857d;font-size:14px}
    @media(max-width:600px){.vm-grid{grid-template-columns:1fr}}
  `;

  const colors = ["#0d9488","#7c3aed","#b45309","#0369a1","#be185d","#047857"];

  async function load() {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/reviews?user_id=eq.${userId}&status=eq.approved&order=created_at.desc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const reviews = await res.json();

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const container = document.createElement("div");
    container.className = "vm-widget";

    if (!reviews.length) {
      container.innerHTML = `<div class="vm-empty">No reviews yet.</div>`;
    } else {
      const grid = document.createElement("div");
      grid.className = "vm-grid";

      reviews.forEach((r, i) => {
        const color = colors[i % colors.length];
        const tile = document.createElement("div");
        tile.className = "vm-tile";
        tile.innerHTML = `
          <div class="vm-stars">${stars(r.rating)}</div>
          <div class="vm-text">"${r.text}"</div>
          <div class="vm-author">
            <div class="vm-avatar" style="background:${color}">${r.name[0]}</div>
            <div>
              <div class="vm-name">${r.name}</div>
              ${r.role ? `<div class="vm-role">${r.role}</div>` : ""}
            </div>
          </div>
        `;
        grid.appendChild(tile);
      });

      container.appendChild(grid);
    }

    const badge = document.createElement("div");
    badge.className = "vm-badge";
    badge.innerHTML = `Powered by <a href="https://voicemark.co" target="_blank">Voicemark</a>`;
    container.appendChild(badge);

    script.parentNode.insertBefore(container, script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();

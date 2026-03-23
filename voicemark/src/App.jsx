import { useState, useEffect, useRef, Component } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const FREE_QUOTA = 3;
const newSlug = (company) => (company || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "");
const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

const G = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;1,9..144,300&family=Epilogue:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#fafaf8;--surface:#fff;--surface2:#f4f2ee;--border:#e8e4dd;
  --ink:#0f0e0c;--muted:#8a857d;--teal:#0d9488;--teal-light:#ccfbf1;
  --teal-dim:#f0fdfa;--r:8px;--shadow:0 2px 12px rgba(0,0,0,.06);--shadow-lg:0 8px 40px rgba(0,0,0,.1);
}
body{background:var(--bg);color:var(--ink);font-family:'Epilogue',sans-serif;font-size:15px;line-height:1.6}
h1,h2,h3,h4{font-family:'Fraunces',serif;line-height:1.2}
a{text-decoration:none;color:inherit}
.btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:var(--r);font-family:'Epilogue',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .15s;border:1px solid transparent}
.btn-primary{background:var(--teal);color:white;border-color:var(--teal)}
.btn-primary:hover{background:#0b7c71}
.btn-ghost{background:transparent;border-color:var(--border);color:var(--ink)}
.btn-ghost:hover{background:var(--surface2)}
.btn-outline{background:transparent;border-color:var(--ink);color:var(--ink)}
.btn-outline:hover{background:var(--ink);color:white}
.btn-lg{padding:13px 28px;font-size:15px}
.btn-sm{padding:7px 14px;font-size:13px}
.btn-danger{background:#fef2f2;color:#991b1b;border-color:#fecaca}
.btn-danger:hover{background:#fecaca}
.btn-full{width:100%}
.nav{display:flex;align-items:center;justify-content:space-between;padding:18px 48px;border-bottom:1px solid var(--border);background:var(--surface);position:sticky;top:0;z-index:20}
.logo{font-family:'Fraunces',serif;font-size:20px;letter-spacing:-.3px;cursor:pointer}
.logo span{color:var(--teal)}
.nav-actions{display:flex;gap:10px;align-items:center}
.hero{max-width:860px;margin:0 auto;padding:52px 48px 36px;text-align:center}
.hero-badge{display:inline-block;background:var(--teal-light);color:var(--teal);font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:5px 14px;border-radius:100px;margin-bottom:28px}
.hero h1{font-size:clamp(40px,6vw,68px);letter-spacing:-1px;margin-bottom:20px;font-weight:300}
.hero h1 em{color:var(--teal);font-style:italic}
.hero p{font-size:17px;color:var(--muted);max-width:500px;margin:0 auto 40px;line-height:1.75}
.hero-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.hero-note{font-size:13px;color:var(--muted);margin-top:14px}
.how-section{background:var(--surface2);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:72px 48px}
.how-inner{max-width:800px;margin:0 auto}
.how-inner h2{font-size:36px;font-weight:300;text-align:center;margin-bottom:48px}
.how-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
.step-num{width:32px;height:32px;border-radius:50%;background:var(--teal);color:white;font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.how-step h3{font-size:17px;margin-bottom:8px}
.how-step p{font-size:14px;color:var(--muted);line-height:1.65}
.widget-preview-section{max-width:800px;margin:0 auto;padding:72px 48px}
.widget-preview-section h2{font-size:36px;font-weight:300;text-align:center;margin-bottom:8px}
.widget-preview-section>p{text-align:center;color:var(--muted);font-size:14px;margin-bottom:36px}
.widget-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.t-tile{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:18px;transition:box-shadow .2s}
.t-tile:hover{box-shadow:var(--shadow)}
.t-stars{color:#d97706;font-size:14px;margin-bottom:8px}
.t-text{font-size:14px;line-height:1.65;color:#3a3630;margin-bottom:14px}
.t-author{display:flex;align-items:center;gap:10px}
.t-avatar{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:white;flex-shrink:0}
.t-name{font-size:13px;font-weight:500}
.t-role{font-size:12px;color:var(--muted)}
.pricing-section{background:var(--ink);color:white;padding:72px 48px;text-align:center}
.pricing-section h2{font-size:38px;font-weight:300;margin-bottom:10px}
.pricing-section>p{color:#7a756e;margin-bottom:40px}
.pricing-card{display:inline-block;background:white;color:var(--ink);border-radius:14px;padding:40px 48px;min-width:320px}
.p-price{font-family:'Fraunces',serif;font-size:52px;line-height:1}
.p-price span{font-family:'Epilogue',sans-serif;font-size:17px;color:var(--muted)}
.p-note{font-size:13px;color:var(--muted);margin:8px 0 24px}
.p-features{text-align:left;margin-bottom:28px}
.p-features li{font-size:14px;padding:6px 0;list-style:none;display:flex;gap:8px;align-items:center}
.p-features li::before{content:"✓";color:var(--teal);font-weight:700}
.site-footer{border-top:1px solid var(--border);padding:24px 48px;display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--muted)}
.auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg)}
.auth-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:48px;max-width:420px;width:100%;box-shadow:var(--shadow-lg)}
.auth-logo{font-family:'Fraunces',serif;font-size:20px;margin-bottom:32px;cursor:pointer}
.auth-logo span{color:var(--teal)}
.auth-card h2{font-size:26px;font-weight:300;margin-bottom:6px}
.auth-sub{color:var(--muted);font-size:14px;margin-bottom:28px}
.field{margin-bottom:16px}
.field label{display:block;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
.field input,.field textarea,.field select{width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:var(--r);font-family:'Epilogue',sans-serif;font-size:14px;background:var(--bg);color:var(--ink);transition:border-color .15s}
.field input:focus,.field textarea:focus{outline:none;border-color:var(--teal);background:white}
.field textarea{resize:vertical;min-height:80px}
.auth-switch{margin-top:20px;text-align:center;font-size:13px;color:var(--muted)}
.auth-switch button{background:none;border:none;color:var(--teal);cursor:pointer;font-size:13px;font-weight:500}
.err{color:#dc2626;font-size:13px;margin-bottom:12px;padding:10px 14px;background:#fef2f2;border-radius:var(--r);border:1px solid #fecaca}
.app{display:flex;min-height:100vh}
.sidebar{width:220px;flex-shrink:0;background:var(--ink);color:white;display:flex;flex-direction:column;padding:24px 0;position:sticky;top:0;height:100vh}
.s-logo{font-family:'Fraunces',serif;font-size:20px;padding:0 20px 24px;border-bottom:1px solid #222;cursor:pointer}
.s-logo span{color:var(--teal)}
.s-nav{padding:16px 0;flex:1}
.s-item{display:flex;align-items:center;gap:10px;padding:10px 20px;font-size:14px;color:#7a756e;cursor:pointer;transition:all .15s;border-left:2px solid transparent}
.s-item:hover{color:white;background:#1a1a1a}
.s-item.active{color:white;border-left-color:var(--teal);background:#1a1a1a}
.s-bottom{padding:16px 20px;border-top:1px solid #222;font-size:12px;color:#4a4540}
.main{flex:1;min-width:0}
.topbar{padding:16px 32px;border-bottom:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:space-between}
.topbar h1{font-size:22px;font-weight:300}
.content{padding:32px}
.trial-banner{background:var(--teal-dim);border-bottom:1px solid #99f6e4;padding:10px 32px;display:flex;align-items:center;justify-content:space-between;font-size:13px}
.trial-banner strong{color:var(--teal)}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:flex;align-items:center;justify-content:center;padding:24px}
.modal{background:white;border-radius:14px;padding:40px;max-width:440px;width:100%;box-shadow:var(--shadow-lg)}
.modal h2{font-size:26px;font-weight:300;margin-bottom:8px}
.modal p{color:var(--muted);font-size:14px;margin-bottom:24px}
.m-price{font-family:'Fraunces',serif;font-size:44px;margin-bottom:4px}
.m-price span{font-family:'Epilogue',sans-serif;font-size:16px;color:var(--muted)}
.m-features{margin-bottom:28px}
.m-features li{font-size:14px;padding:5px 0;list-style:none;display:flex;gap:8px}
.m-features li::before{content:"✓";color:var(--teal);font-weight:700}
.collect-page{min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:32px 20px}
.collect-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:40px;max-width:480px;width:100%;box-shadow:var(--shadow-lg)}
.cc-header{display:flex;align-items:center;gap:14px;margin-bottom:28px}
.cc-logo{width:48px;height:48px;border-radius:12px;background:var(--teal);display:flex;align-items:center;justify-content:center;font-size:22px;color:white;font-family:'Fraunces',serif}
.cc-header h2{font-size:20px;font-weight:300;margin-bottom:2px}
.cc-header p{font-size:13px;color:var(--muted)}
.star-row{display:flex;gap:8px;margin-bottom:20px}
.star-btn{font-size:32px;cursor:pointer;transition:transform .15s;filter:grayscale(1) opacity(.35);background:none;border:none;padding:0}
.star-btn.on{filter:none;transform:scale(1.1)}
.collect-footer{margin-top:24px;text-align:center;font-size:12px;color:var(--muted)}
.collect-footer span{color:var(--teal)}
.success-card{text-align:center;padding:20px 0}
.success-icon{font-size:48px;margin-bottom:16px}
.reviews-list{display:flex;flex-direction:column;gap:10px;margin-top:4px}
.review-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:18px 20px}
.rc-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.rc-stars{color:#d97706;font-size:14px;margin-bottom:6px}
.rc-text{font-size:14px;color:#3a3630;line-height:1.65;margin-bottom:10px}
.rc-author{font-size:13px;font-weight:500}
.rc-role{font-size:12px;color:var(--muted)}
.rc-date{font-size:12px;color:var(--muted);flex-shrink:0}
.rc-actions{display:flex;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)}
.status-pill{display:inline-block;font-size:11px;font-weight:600;padding:3px 9px;border-radius:100px;text-transform:uppercase;letter-spacing:.05em}
.pill-pending{background:#fef3c7;color:#92400e}
.pill-approved{background:var(--teal-light);color:var(--teal)}
.pill-rejected{background:#fef2f2;color:#991b1b}
.link-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:20px;display:flex;align-items:center;gap:12px;margin-bottom:24px}
.link-url{flex:1;font-family:monospace;font-size:13px;color:var(--teal);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.embed-box{background:var(--ink);border-radius:var(--r);padding:20px;margin-top:16px}
.embed-box code{font-family:monospace;font-size:13px;color:#a8f0e8;display:block;margin-bottom:12px;word-break:break-all}
.empty{text-align:center;padding:72px 20px;color:var(--muted)}
.empty h3{font-size:20px;color:var(--ink);margin-bottom:8px}
.empty p{font-size:14px;margin-bottom:24px}
.settings-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:28px;max-width:560px;margin-bottom:20px}
.settings-card h3{font-size:16px;font-weight:600;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--border)}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:20px}
.stat-val{font-family:'Fraunces',serif;font-size:36px;font-weight:300;margin-bottom:4px}
.stat-label{font-size:13px;color:var(--muted)}
.loading{display:flex;align-items:center;justify-content:center;min-height:200px;color:var(--muted);font-size:14px}
.faq-section{max-width:860px;margin:0 auto;padding:72px 48px}
.faq-section h2{font-size:36px;font-weight:300;text-align:center;margin-bottom:40px}
.faq-item{border-bottom:1px solid var(--border);padding:20px 0}
.faq-q{font-size:15px;font-weight:500;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px}
.faq-q:hover{color:var(--teal)}
.faq-a{font-size:14px;color:var(--muted);line-height:1.75;margin-top:12px}

.blog-hero{max-width:860px;margin:0 auto;padding:52px 48px 36px;text-align:center}
.blog-hero h1{font-size:clamp(32px,5vw,52px);letter-spacing:-1px;margin-bottom:16px;font-weight:300}
.blog-hero p{font-size:17px;color:var(--muted);max-width:480px;margin:0 auto}
.blog-grid{max-width:860px;margin:0 auto;padding:0 48px 80px;display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:24px}
.blog-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:28px;cursor:pointer;transition:box-shadow .2s,transform .15s}
.blog-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-2px)}
.blog-card-tag{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--teal);margin-bottom:12px}
.blog-card h2{font-size:20px;font-weight:300;margin-bottom:10px;line-height:1.3}
.blog-card p{font-size:14px;color:var(--muted);line-height:1.65;margin-bottom:16px}
.blog-card-meta{font-size:12px;color:var(--muted);display:flex;gap:12px}
.blog-post-wrap{max-width:680px;margin:0 auto;padding:48px 48px 80px}
.blog-post-back{font-size:13px;color:var(--muted);cursor:pointer;margin-bottom:32px;display:inline-flex;align-items:center;gap:6px}
.blog-post-back:hover{color:var(--teal)}
.blog-post-tag{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--teal);margin-bottom:16px}
.blog-post-wrap h1{font-size:clamp(28px,4vw,42px);font-weight:300;letter-spacing:-.5px;margin-bottom:16px;line-height:1.2}
.blog-post-meta{font-size:13px;color:var(--muted);margin-bottom:36px;padding-bottom:28px;border-bottom:1px solid var(--border)}
.blog-post-body{font-size:16px;line-height:1.85;color:#2a2620}
.blog-post-body h2{font-family:'Fraunces',serif;font-size:24px;font-weight:300;margin:40px 0 16px;color:var(--ink)}
.blog-post-body h3{font-family:'Fraunces',serif;font-size:19px;font-weight:300;margin:32px 0 12px;color:var(--ink)}
.blog-post-body p{margin-bottom:20px}
.blog-post-body ul,.blog-post-body ol{margin:0 0 20px 24px}
.blog-post-body li{margin-bottom:8px}
.blog-post-body blockquote{border-left:3px solid var(--teal);margin:24px 0;padding:4px 0 4px 20px;color:var(--muted);font-style:italic}
.blog-post-cta{background:var(--teal-dim);border:1px solid #99f6e4;border-radius:12px;padding:28px 32px;margin-top:48px}
.blog-post-cta h3{font-size:20px;font-weight:300;margin-bottom:8px}
.blog-post-cta p{font-size:14px;color:var(--muted);margin-bottom:20px}
@media(max-width:640px){.blog-grid,.blog-post-wrap{padding:0 20px 60px}.blog-hero{padding:36px 20px 24px}}
@media(max-width:900px){
  .how-steps{grid-template-columns:1fr}
  .widget-grid{grid-template-columns:1fr}
  .stats-row{grid-template-columns:1fr}
  .nav,.site-footer{padding:16px 28px}
  .hero{padding:48px 28px}
  .how-section,.faq-section,.widget-preview-section{padding:56px 28px}
  .pricing-section{padding:56px 28px}
}
@media(max-width:640px){
  .nav,.site-footer{padding:16px 20px}
  .hero{padding:40px 20px}
  .how-steps,.widget-grid,.stats-row{grid-template-columns:1fr}
  .faq-section{padding:48px 20px;grid-template-columns:1fr}
  .app{flex-direction:column}
  .sidebar{width:100%;height:auto;position:relative}
  .content{padding:20px}
  .hero h1{font-size:36px}
  .pricing-card{min-width:auto;width:100%;padding:28px 24px}
  .nav-actions .btn{padding:8px 14px;font-size:13px}
}
`;

function StyleInject() {
  useEffect(() => {
    if (document.getElementById("vm-app-styles")) return;
    const el = document.createElement("style");
    el.id = "vm-app-styles";
    el.textContent = G;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
  return null;
}

function useJsonLd(data) {
  useEffect(() => {
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "vm-jsonld";
    el.textContent = JSON.stringify(data);
    const old = document.getElementById("vm-jsonld");
    if (old) old.remove();
    document.head.appendChild(el);
    return () => el.remove();
  }, [JSON.stringify(data)]);
}

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function NavLink({ href, className, style, onClick, children }) {
  const handleClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return; // allow open-in-new-tab
    e.preventDefault();
    if (onClick) onClick(e);
    else navigate(href);
  };
  return <a href={href} className={className} style={style} onClick={handleClick}>{children}</a>;
}

function Logo({ onClick }) {
  return <a href="/" className="logo" onClick={e => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); onClick ? onClick() : navigate("/"); } }}>Voice<span>mark</span></a>;
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <div className="faq-q" onClick={() => setOpen(o => !o)}>
        <span>{q}</span><span>{open ? "−" : "+"}</span>
      </div>
      {open && <div className="faq-a">{a}</div>}
    </div>
  );
}

// ── LANDING ────────────────────────────────────────────────────────────────
function Landing({ onSignup, onLogin }) {
  useEffect(() => {
    setMeta({
      title: "Voicemark – Collect Client Testimonials Automatically",
      description: "Send one link. Collect beautiful testimonials from clients. Embed them on your website automatically. Free to start — no credit card needed.",
      url: "https://www.voicemark.co"
    });
  }, []);
  useJsonLd({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Voicemark",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "url": "https://www.voicemark.co",
    "description": "Send one link. Collect beautiful testimonials from clients. Embed them on your website automatically.",
    "offers": { "@type": "Offer", "price": "19", "priceCurrency": "USD", "url": "https://www.voicemark.co" }
  });
  useJsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {"@type":"Question","name":"Does it work with any website?","acceptedAnswer":{"@type":"Answer","text":"Yes – Squarespace, Wix, Webflow, WordPress, or any custom site. Just paste one line of code."}},
      {"@type":"Question","name":"Do my clients need to create an account?","acceptedAnswer":{"@type":"Answer","text":"No. They just click your link, leave a review, and they're done. Takes 60 seconds."}},
      {"@type":"Question","name":"Can I choose which reviews to show?","acceptedAnswer":{"@type":"Answer","text":"Yes. Every review goes through your approval queue first – you decide what gets published."}},
      {"@type":"Question","name":"Can I cancel anytime?","acceptedAnswer":{"@type":"Answer","text":"Absolutely. No contracts, no questions asked. Cancel from your dashboard settings."}},
      {"@type":"Question","name":"What happens after 3 free reviews?","acceptedAnswer":{"@type":"Answer","text":"You'll be prompted to upgrade to Pro ($19/mo) to keep collecting. Your existing reviews are always safe."}},
      {"@type":"Question","name":"Do you offer refunds?","acceptedAnswer":{"@type":"Answer","text":"If you're not satisfied within the first 7 days, we'll refund you in full. No questions asked."}}
    ]
  });
  const tiles = [
    { name:"Sarah K.", role:"Freelance Designer", rating:5, text:"Landed 3 new clients after adding these reviews to my portfolio.", color:"#0d9488" },
    { name:"Marco T.", role:"Business Consultant", rating:5, text:"My proposal conversion rate doubled. Clients trust me before we meet.", color:"#7c3aed" },
    { name:"Priya M.", role:"UX Researcher", rating:4, text:"Sent the link to 10 clients, got 8 reviews back within a day.", color:"#b45309" },
    { name:"James W.", role:"Photographer", rating:5, text:"Finally a tool that looks as professional as my work.", color:"#0369a1" },
  ];
  return (
    <div>
      <header>
        <nav className="nav">
          <Logo />
          <div className="nav-actions">
            <NavLink href="/blog" className="btn btn-ghost" style={{fontSize:13}}>Blog</NavLink>
            <NavLink href="/?login=1" className="btn btn-ghost" onClick={onLogin}>Log in</NavLink>
            <NavLink href="/?signup=1" className="btn btn-primary" onClick={onSignup}>Start free →</NavLink>
          </div>
        </nav>
      </header>
      <section className="hero">
        <div className="hero-badge">✦ Built for freelancers & consultants</div>
        <h1>Turn happy clients into<br /><em>social proof</em></h1>
        <p>Send one link. Collect beautiful testimonials. Embed them on your website automatically.</p>
        <div className="hero-cta">
          <NavLink href="/?signup=1" className="btn btn-primary btn-lg" onClick={onSignup}>Collect your first review →</NavLink>
          <NavLink href="/?login=1" className="btn btn-outline btn-lg" onClick={onLogin}>Log in</NavLink>
        </div>
        <p className="hero-note">3 reviews free · No credit card · 2 minutes to set up</p>
      </section>
      <div className="how-section">
        <div className="how-inner">
          <h2>How it works</h2>
          <div className="how-steps">
            {[["Send a link","Copy your unique collection link and send it to any happy client — via email, WhatsApp, or text."],["Client leaves a review","They rate you, write a short text, and submit. No account needed. Takes 60 seconds."],["Embed on your site","One line of code adds a live widget to your website. New reviews appear automatically."]].map(([t,d],i) => (
              <div className="how-step" key={t}>
                <div className="step-num">{i+1}</div>
                <h3>{t}</h3><p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="widget-preview-section">
        <h2>What your website visitors see</h2>
        <p>A clean, embeddable widget that builds instant trust</p>
        <div className="widget-grid">
          {tiles.map(t => (
            <div className="t-tile" key={t.name}>
              <div className="t-stars">{stars(t.rating)}</div>
              <div className="t-text">"{t.text}"</div>
              <div className="t-author">
                <div className="t-avatar" style={{ background:t.color }}>{t.name?.[0] || "?"}</div>
                <div><div className="t-name">{t.name}</div><div className="t-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center",marginTop:24,padding:"20px 24px",background:"var(--teal-dim)",border:"1px solid #99f6e4",borderRadius:"var(--r)" }}>
          <div style={{ fontSize:15,fontWeight:500,marginBottom:6 }}>🔗 One line of code. Paste it anywhere.</div>
          <div style={{ fontSize:14,color:"var(--muted)" }}>Works with Squarespace, Wix, Webflow, WordPress, and any custom site.</div>
        </div>
      </div>
      <div className="pricing-section">
        <h2>Simple, honest pricing</h2>
        <p>One plan. Everything included. Cancel anytime.</p>
        <div className="pricing-card">
          <div className="p-price">$19 <span>/ month</span></div>
          <div className="p-note">Start with 3 free reviews · no card needed</div>
          <ul className="p-features">
            {["Unlimited testimonials","Custom collection page","Embeddable website widget","Approve before publishing","Email notifications"].map(f => <li key={f}>{f}</li>)}
          </ul>
          <NavLink href="/?signup=1" className="btn btn-primary btn-lg btn-full" onClick={onSignup}>Get started free →</NavLink>
        </div>
      </div>
      <div className="faq-section">
        <h2>Frequently asked questions</h2>
        {[
          ["Does it work with any website?","Yes – Squarespace, Wix, Webflow, WordPress, or any custom site. Just paste one line of code."],
          ["Do my clients need to create an account?","No. They just click your link, leave a review, and they're done. Takes 60 seconds."],
          ["Can I choose which reviews to show?","Yes. Every review goes through your approval queue first – you decide what gets published."],
          ["Can I cancel anytime?","Absolutely. No contracts, no questions asked. Cancel from your dashboard settings."],
          ["What happens after 3 free reviews?","You'll be prompted to upgrade to Pro ($19/mo) to keep collecting. Your existing reviews are always safe."],
          ["Do you offer refunds?","If you're not satisfied within the first 7 days, we'll refund you in full. No questions asked."],
        ].map(([q,a]) => <FaqItem key={q} q={q} a={a} />)}
      </div>
      <div style={{ background:"var(--teal)",padding:"56px 48px",textAlign:"center" }}>
        <h2 style={{ color:"white",fontSize:32,fontWeight:300,marginBottom:12 }}>Ready to collect your first review?</h2>
        <p style={{ color:"rgba(255,255,255,.8)",fontSize:15,marginBottom:28 }}>3 reviews free · No credit card · 2 minutes to set up</p>
        <NavLink href="/?signup=1" className="btn btn-lg" style={{ background:"white",color:"var(--teal)",border:"none",fontWeight:600 }} onClick={onSignup}>Get started free →</NavLink>
      </div>
      <footer className="site-footer"><Logo /><div style={{display:"flex",gap:20,alignItems:"center"}}><NavLink href="/blog" style={{color:"var(--muted)",fontSize:13}}>Blog</NavLink><span>© 2026 Voicemark · Built for freelancers & consultants</span></div></footer>
    </div>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────────────
function Auth({ mode, onAuth, onSwitch, onHome }) {
  const [f, setF] = useState({ email:"", password:"", company:"" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const sendReset = async () => {
    if (!f.email) { setErr("Please enter your email address"); return; }
    setLoading(true); setErr("");
    const { error } = await supabase.auth.resetPasswordForEmail(f.email, {
      redirectTo: "https://www.voicemark.co"
    });
    if (error) { setErr(error.message); } else { setResetSent(true); }
    setLoading(false);
  };

  const go = async () => {
    setErr(""); setLoading(true);
    try {
      if (mode === "signup") {
        if (!f.email || !f.password || !f.company) { setErr("Please fill in all fields"); setLoading(false); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) { setErr("Please enter a valid email address"); setLoading(false); return; }
        if (f.password.length < 8) { setErr("Password must be at least 8 characters"); setLoading(false); return; }
        const { data, error } = await supabase.auth.signUp({ email: f.email, password: f.password });
        if (error) {
          if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("already exists")) {
            setErr("An account with this email already exists. Try logging in instead.");
          } else {
            setErr(error.message);
          }
          setLoading(false); return;
        }
        let slug = newSlug(f.company);
        if (!slug || slug.length < 2) slug = data.user.id.slice(0, 8);
        const { data: existing } = await supabase.from("profiles").select("id").eq("slug", slug).neq("id", data.user.id).single();
        if (existing) slug = slug + "-" + data.user.id.slice(0, 6);
        await supabase.from("profiles").upsert({ id: data.user.id, company: f.company, slug, plan: "trial" }, { onConflict: "id" });
        // If email confirmation is required, session will be null — show message instead of dashboard
        if (!data.session) {
          setErr(""); setLoading(false);
          alert("Account created! Please check your inbox and confirm your email before logging in.");
          return;
        }
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        onAuth({ ...data.user, profile });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
        if (error) { setErr("Wrong email or password"); setLoading(false); return; }
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        onAuth({ ...data.user, profile });
      }
    } catch(e) { setErr("Something went wrong. Please try again."); }
    setLoading(false);
  };

  if (forgotMode) return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo" onClick={onHome}>Voice<span>mark</span></div>
        {resetSent ? <>
          <h2>Check your inbox</h2>
          <p className="auth-sub">We've sent a password reset link to <strong>{f.email}</strong></p>
          <button className="btn btn-ghost btn-full" style={{ marginTop:16 }} onClick={() => { setForgotMode(false); setResetSent(false); }}>Back to log in</button>
        </> : <>
          <h2>Reset password</h2>
          <p className="auth-sub">Enter your email and we'll send you a reset link</p>
          <div className="field"><label>Email</label><input type="email" placeholder="you@example.com" value={f.email} onChange={set("email")} onKeyDown={e => e.key==="Enter" && sendReset()} /></div>
          {err && <p className="err">{err}</p>}
          <button className="btn btn-primary btn-full" onClick={sendReset} disabled={loading}>{loading ? "Sending..." : "Send reset link →"}</button>
          <div className="auth-switch"><button onClick={() => setForgotMode(false)}>Back to log in</button></div>
        </>}
      </div>
    </div>
  );

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo" onClick={onHome}>Voice<span>mark</span></div>
        <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="auth-sub">{mode === "login" ? "Log in to your dashboard" : "3 reviews free · no credit card"}</p>
        {mode === "signup" && <div className="field"><label>Company / your name</label><input placeholder="Meridian Studio" value={f.company} onChange={set("company")} /></div>}
        <div className="field"><label>Email</label><input type="email" autoComplete="email" placeholder="you@example.com" value={f.email} onChange={set("email")} onKeyDown={e => e.key==="Enter" && go()} /></div>
        <div className="field">
          <label style={{ display:"flex", justifyContent:"space-between" }}>
            Password
            {mode === "login" && <button style={{ background:"none",border:"none",color:"var(--teal)",fontSize:12,cursor:"pointer",fontFamily:"inherit" }} onClick={() => setForgotMode(true)}>Forgot password?</button>}
          </label>
          <input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="••••••••" value={f.password} onChange={set("password")} onKeyDown={e => e.key==="Enter" && go()} />
        </div>
        {err && <p className="err">{err}</p>}
        <button className="btn btn-primary btn-full" onClick={go} disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Log in →" : "Create account →"}</button>
        <div className="auth-switch">
          {mode === "login" ? <>No account? <button onClick={onSwitch}>Sign up free</button></> : <>Have an account? <button onClick={onSwitch}>Log in</button></>}
        </div>
      </div>
    </div>
  );
}

// ── PAYWALL ────────────────────────────────────────────────────────────────
function Paywall({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [onClose]);
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Free reviews used up</h2>
        <p>You've collected your 3 free reviews. Upgrade to keep collecting unlimited testimonials.</p>
        <div className="m-price">$19 <span>/ month</span></div>
        <ul className="m-features">
          {["Unlimited testimonials","Embeddable widget","Custom branding","Email notifications"].map(f => <li key={f}>{f}</li>)}
        </ul>
        <button className="btn btn-primary btn-lg btn-full" style={{ marginBottom:10 }}
          onClick={() => window.open("https://buy.stripe.com/fZu5kD1K14MGgl05CG4AU01","_blank","noopener,noreferrer")}>
          Upgrade with Stripe →
        </button>
        <button className="btn btn-ghost btn-full" onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}

// ── COLLECT PAGE ───────────────────────────────────────────────────────────
function CollectPage({ slug, userId: userIdProp, company: companyProp, onDone, previewMode }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [f, setF] = useState({ name:"", role:"", text:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const submittingRef = useRef(false);
  const [userId, setUserId] = useState(userIdProp || null);
  const [company, setCompany] = useState(companyProp || "");
  const [profileLoading, setProfileLoading] = useState(!!slug);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  // If rendered via URL (/collect/slug), look up profile from slug
  useEffect(() => {
    if (!slug) return;
    supabase.from("profiles").select("id, company").eq("slug", slug).single()
      .then(({ data, error }) => {
        if (data) {
          setUserId(data.id);
          setCompany(data.company);
          document.title = `Leave a review for ${data.company} · Voicemark`;
        } else {
          setErr("Collection page not found.");
        }
        setProfileLoading(false);
      });
    return () => { document.title = "Voicemark – Collect Client Testimonials Automatically"; };
  }, [slug]);

  const submit = async () => {
    if (submittingRef.current) return;
    if (!rating || !f.text || !f.name) { setErr("Please add a rating, your name, and a review"); return; }
    if (!userId) { setErr("Invalid collection link."); return; }
    submittingRef.current = true;
    setLoading(true); setErr("");
    const { data: rpcResult, error: rpcError } = await supabase.rpc("submit_review", {
      p_user_id: userId, p_name: f.name, p_role: f.role, p_text: f.text, p_rating: rating,
    });
    if (rpcError) { submittingRef.current = false; setErr("Something went wrong. Please try again."); setLoading(false); return; }
    if (rpcResult?.error === "quota_exceeded") { submittingRef.current = false; setErr("This collection page has reached its review limit."); setLoading(false); return; }
    if (rpcResult?.error === "profile_not_found") { submittingRef.current = false; setErr("Invalid collection link."); setLoading(false); return; }
    if (!rpcResult?.ok) { submittingRef.current = false; setErr("Something went wrong. Please try again."); setLoading(false); return; }
    // Fire-and-forget email notification to the profile owner
    fetch(`${SUPABASE_URL}/functions/v1/notify-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
      body: JSON.stringify({ userId, reviewerName: f.name, reviewText: f.text, rating }),
    }).catch(() => {});
    submittingRef.current = false;
    setSubmitted(true); setLoading(false);
    if (onDone) setTimeout(onDone, 2000);
  };

  if (profileLoading) return <div className="collect-page"><div className="loading">Loading...</div></div>;

  return (
    <div className="collect-page">
      <div className="collect-card">
        {!submitted ? <>
          <div className="cc-header">
            <div className="cc-logo">{company?.[0] || "V"}</div>
            <div><h2>How was your experience?</h2><p>{company} · Takes 60 seconds</p></div>
          </div>
          <div className="star-row">
            {[1,2,3,4,5].map(n => (
              <button key={n} className={`star-btn ${n<=(hover||rating)?"on":""}`}
                onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}>★</button>
            ))}
          </div>
          <div className="field"><label>Your review</label><textarea placeholder="What did you enjoy about working together?" value={f.text} onChange={set("text")} maxLength={600} /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div className="field"><label>Your name</label><input placeholder="Sarah K." value={f.name} onChange={set("name")} maxLength={80} /></div>
            <div className="field"><label>Role / Company</label><input placeholder="Freelance Designer" value={f.role} onChange={set("role")} maxLength={80} /></div>
          </div>
          {err && <p className="err">{err}</p>}
          <button className="btn btn-primary btn-full" onClick={submit} disabled={loading || previewMode} style={previewMode ? {opacity:0.5,cursor:"not-allowed"} : {}}>{previewMode ? "Disabled in preview" : loading ? "Submitting..." : "Submit review →"}</button>
          <div className="collect-footer">Powered by <span>Voicemark</span></div>
        </> : (
          <div className="success-card">
            <div className="success-icon">🎉</div>
            <h2 style={{ marginBottom:8 }}>Thank you!</h2>
            <p style={{ color:"var(--muted)", fontSize:14 }}>Your review has been submitted and will appear on {company || "their"} website shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── DASHBOARD ──────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState("reviews");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [viewCollect, setViewCollect] = useState(false);

  const [profile, setProfile] = useState(user.profile);
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [saveMsg, setSaveMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [companyInput, setCompanyInput] = useState(profile?.company || "");
  const [upgradedBanner, setUpgradedBanner] = useState(false);
  const isPaid = profile?.plan === "paid";
  const collectUrl = profile?.slug ? `https://www.voicemark.co/collect/${profile.slug}` : "";

  // Re-fetch profile always (get latest plan), and handle ?upgraded=1 from Stripe redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const justUpgraded = params.get("upgraded") === "1";
    if (justUpgraded) window.history.replaceState({}, "", window.location.pathname);

    supabase.from("profiles").select("*").eq("id", user.id).single()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setCompanyInput(data.company || "");
          if (justUpgraded && data.plan === "paid") {
            setUpgradedBanner(true);
            setTimeout(() => setUpgradedBanner(false), 6000);
          }
        }
      });

    // If just upgraded but webhook hasn't arrived yet, poll every 2s for up to 20s
    if (justUpgraded) {
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        const { data } = await supabase.from("profiles").select("plan").eq("id", user.id).single();
        if (data?.plan === "paid") {
          setProfile(prev => ({ ...prev, plan: "paid" }));
          setUpgradedBanner(true);
          setTimeout(() => setUpgradedBanner(false), 6000);
          clearInterval(poll);
        }
        if (attempts >= 10) clearInterval(poll);
      }, 2000);
      return () => clearInterval(poll);
    }
  }, [user.id]);

  const fetchReviews = async (silent = false) => {
    if (silent) setRefreshing(true); else setLoading(true);
    const { data, error } = await supabase.from("reviews").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) { setFetchError(true); }
    else { setFetchError(false); setReviews(data || []); }
    if (silent) setRefreshing(false); else setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
    const interval = setInterval(() => {
      if (document.visibilityState !== "hidden") fetchReviews(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const total = reviews.length;
  const pending = reviews.filter(r => r.status === "pending").length;
  const quotaCount = reviews.filter(r => r.status !== "rejected").length;
  const avgRating = total ? +(reviews.reduce((s,r) => s + r.rating, 0) / total).toFixed(1) : "—";

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    const { error } = await supabase.from("reviews").update({ status }).eq("id", id).eq("user_id", user.id);
    if (!error) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } else {
      fetchReviews(true); // fallback: refetch on error
    }
    setUpdatingId(null);
  };

  const deleteReview = async (id) => {
    setUpdatingId(id);
    const { error } = await supabase.from("reviews").delete().eq("id", id).eq("user_id", user.id);
    if (!error) {
      setReviews(prev => prev.filter(r => r.id !== id));
    } else {
      fetchReviews(); // fallback: refetch on error
    }
    setConfirmDeleteId(null);
    setUpdatingId(null);
  };

  const copy = (text, setter) => { navigator.clipboard.writeText(text).catch(() => {}); setter(true); setTimeout(() => setter(false), 2000); };

  const saveProfile = async () => {
    if (!companyInput.trim()) { setSaveMsg("Company name is required"); setTimeout(() => setSaveMsg(""), 2000); return; }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ company: companyInput }).eq("id", user.id);
    if (!error) { setProfile(prev => ({ ...prev, company: companyInput })); setSaveMsg("Saved!"); setTimeout(() => setSaveMsg(""), 2000); }
    else { setSaveMsg("Error saving"); setTimeout(() => setSaveMsg(""), 2000); }
    setSaving(false);
  };

  if (viewCollect) return (
    <div style={{ position:"relative" }}>
      <div style={{ position:"fixed",top:0,left:0,right:0,zIndex:50,background:"#fef3c7",borderBottom:"2px solid #f59e0b",padding:"10px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:14 }}>
        <span>👁 Preview mode — submissions are disabled</span>
        <button className="btn btn-ghost btn-sm" onClick={() => setViewCollect(false)}>← Back to dashboard</button>
      </div>
      <div style={{ paddingTop:48 }}>
        <CollectPage userId={user.id} company={profile?.company} previewMode={true} onDone={() => setViewCollect(false)} />
      </div>
    </div>
  );

  return (
    <div className="app">
      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} />}
      <aside className="sidebar">
        <div className="s-logo">Voice<span>mark</span></div>
        <nav className="s-nav">
          {[["reviews","⭐","Reviews"],["embed","🔗","Embed widget"],["collect","📨","Collection link"],["settings","⚙️","Settings"]].map(([v,ic,lb]) => (
            <div key={v} className={`s-item ${tab===v?"active":""}`} onClick={() => setTab(v)}><span>{ic}</span><span>{lb}</span></div>
          ))}
        </nav>
        <div className="s-bottom">
          <div style={{ marginBottom:4 }}>{profile?.company}</div>
          <div style={{ marginBottom:10, wordBreak:"break-all" }}>{user.email}</div>
          <button className="btn btn-ghost btn-sm" style={{ color:"#7a756e",borderColor:"#222",width:"100%" }} onClick={onLogout}>Log out</button>
        </div>
      </aside>

      <main className="main">
        {upgradedBanner && (
          <div style={{ background:"#0d9488",color:"white",padding:"12px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:14 }}>
            <span>🎉 <strong>Welcome to Pro!</strong> Your account has been upgraded. Collect unlimited reviews.</span>
            <button onClick={() => setUpgradedBanner(false)} style={{ background:"none",border:"none",color:"white",cursor:"pointer",fontSize:18llineHeight:1 }}>×</button>
          </div>
        )}
        {!isPaid && (
          <div className="trial-banner" style={quotaCount >= FREE_QUOTA ? {background:"#fef3c7",borderBottomColor:"#f59e0b"} : {}}>
            {quotaCount >= FREE_QUOTA
              ? <span>⚠️ <strong>Review limit reached</strong> · Upgrade to keep collecting</span>
              : <span>Free plan · <strong>{Math.max(0, FREE_QUOTA - quotaCount)} of {FREE_QUOTA} reviews remaining</strong></span>
            }
            <button className="btn btn-primary btn-sm" onClick={() => setShowPaywall(true)}>Upgrade $19/mo →</button>
          </div>
        )}

        {tab === "reviews" && (
          <>
            <div className="topbar">
              <h1>Reviews {refreshing && <span style={{ fontSize:13,color:"var(--muted)",fontFamily:"'Epilogue',sans-serif",fontWeight:400 }}>· syncing…</span>}</h1>
              <button className="btn btn-primary btn-sm" onClick={() => setViewCollect(true)}>Preview collection page →</button>
            </div>
            <div className="content">
              <div className="stats-row">
                <div className="stat-card"><div className="stat-val">{total}</div><div className="stat-label">Total reviews</div></div>
                <div className="stat-card"><div className="stat-val">{avgRating}</div><div className="stat-label">Avg rating</div></div>
                <div className="stat-card"><div className="stat-val">{pending}</div><div className="stat-label">Awaiting approval</div></div>
              </div>
              {loading ? <div className="loading">Loading reviews...</div> : fetchError ? (
                <div className="empty">
                  <h3>Could not load reviews</h3>
                  <p>Check your connection and try again.</p>
                  <button className="btn btn-primary" onClick={() => fetchReviews()}>Retry</button>
                </div>
              ) : reviews.length === 0 ? (
                <div className="empty">
                  <h3>No reviews yet</h3>
                  <p>Send your collection link to a happy client to get started.</p>
                  <button className="btn btn-primary" onClick={() => setTab("collect")}>Get your collection link →</button>
                </div>
              ) : (
                <div className="reviews-list">
                  {reviews.map(r => (
                    <div className="review-card" key={r.id}>
                      <div className="rc-top">
                        <div>
                          <div className="rc-stars">{stars(r.rating)}</div>
                          <div className="rc-text">"{r.text}"</div>
                          <div className="rc-author">{r.name}</div>
                          {r.role && <div className="rc-role">{r.role}</div>}
                        </div>
                        <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8 }}>
                          <span className={`status-pill pill-${r.status}`}>{r.status}</span>
                          <span className="rc-date">{r.created_at ? new Date(r.created_at).toLocaleDateString("nb-NO", { day:"numeric", month:"short", year:"numeric" }) : ""}</span>
                        </div>
                      </div>
                      <div className="rc-actions">
                          {r.status === "pending" && <>
                            <button className="btn btn-primary btn-sm" onClick={() => updateStatus(r.id,"approved")} disabled={!!updatingId}>✓ Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => updateStatus(r.id,"rejected")} disabled={!!updatingId}>✕ Reject</button>
                          </>}
                          {r.status === "approved" && <button className="btn btn-ghost btn-sm" style={{color:"var(--muted)",fontSize:12}} onClick={() => updateStatus(r.id,"pending")} disabled={!!updatingId}>↩ Move to pending</button>}
                          {r.status === "rejected" && <button className="btn btn-ghost btn-sm" style={{color:"var(--muted)",fontSize:12}} onClick={() => updateStatus(r.id,"pending")} disabled={!!updatingId}>↩ Restore</button>}
                          {confirmDeleteId === r.id
                            ? <>
                                <span style={{ fontSize:12,color:"#dc2626" }}>Delete permanently?</span>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteReview(r.id)} disabled={!!updatingId}>Yes, delete</button>
                                <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                              </>
                            : <button className="btn btn-ghost btn-sm" style={{color:"#dc2626",fontSize:12}} onClick={() => setConfirmDeleteId(r.id)} disabled={!!updatingId}>🗑 Delete</button>
                          }
                        </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {tab === "embed" && (
          <>
            <div className="topbar"><h1>Embed widget</h1></div>
            <div className="content">
              <div className="settings-card">
                <h3>Add to your website</h3>
                <p style={{ fontSize:14,color:"var(--muted)",marginBottom:16 }}>Paste this one line of code anywhere on your website. The widget updates automatically when you approve new reviews.</p>
                <div className="embed-box">
                  <code>{`<script src="https://www.voicemark.co/widget.js" data-id="${user.id}"></script>`}</code>
                  <button className="btn btn-primary btn-sm" onClick={() => copy(`<script src="https://www.voicemark.co/widget.js" data-id="${user.id}"></script>`, setCopiedEmbed)}>{copiedEmbed ? "✓ Copied!" : "Copy code"}</button>
                </div>
              </div>
              <div className="settings-card">
                <h3>Widget preview</h3>
                  <div className="widget-grid" style={{ marginTop:4 }}>
                  {reviews.filter(r => r.status==="approved").slice(0,4).map(r => (
                    <div className="t-tile" key={r.id}>
                      <div className="t-stars">{stars(r.rating)}</div>
                      <div className="t-text">"{r.text}"</div>
                      <div className="t-author">
                        <div className="t-avatar" style={{ background:"var(--teal)" }}>{r.name?.[0] || "?"}</div>
                        <div><div className="t-name">{r.name}</div><div className="t-role">{r.role}</div></div>
                      </div>
                    </div>
                  ))}
                  {reviews.filter(r => r.status==="approved").length === 0 && <p style={{ color:"var(--muted)",fontSize:14,gridColumn:"1/-1" }}>Approve some reviews to see the widget preview.</p>}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "collect" && (
          <>
            <div className="topbar"><h1>Collection link</h1></div>
            <div className="content">
              <div className="settings-card">
                <h3>Your collection link</h3>
                <p style={{ fontSize:14,color:"var(--muted)",marginBottom:16 }}>Share this link with any client. No account needed on their end.</p>
                <div className="link-box">
                  <span className="link-url">{collectUrl || <span style={{ color:"var(--muted)" }}>Fetching your link...</span>}</span>
                  <button className="btn btn-primary btn-sm" onClick={() => copy(collectUrl, setCopiedLink)} disabled={!collectUrl}>{copiedLink ? "✓ Copied!" : "Copy link"}</button>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setViewCollect(true)}>Preview what clients see →</button>
              </div>
              <div className="settings-card">
                <h3>Ready-to-send email template</h3>
                <div style={{ background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:16,fontSize:14,lineHeight:1.8,color:"#3a3630" }}>
                  Hi [Name],<br /><br />
                  It was a pleasure working with you! If you have 60 seconds, a short review would mean a lot:<br />
                  <span style={{ color:"var(--teal)" }}>{collectUrl}</span><br /><br />
                  Thank you 🙏
                </div>
                <button className="btn btn-ghost btn-sm" style={{ marginTop:12 }} disabled={!collectUrl} onClick={() => copy(`Hi [Name],\n\nIt was a pleasure working with you! If you have 60 seconds, a short review would mean a lot:\n${collectUrl}\n\nThank you 🙏`, setCopiedEmail)}>{copiedEmail ? "✓ Copied!" : "Copy email template"}</button>
              </div>
            </div>
          </>
        )}

        {tab === "settings" && (
          <>
            <div className="topbar"><h1>Settings</h1></div>
            <div className="content">
              <div className="settings-card">
                <h3>Account</h3>
                <div className="field"><label>Company name</label><input value={companyInput} onChange={e => setCompanyInput(e.target.value)} /></div>
                <div className="field"><label>Email</label><input defaultValue={user.email} disabled /></div>
                <button className="btn btn-primary btn-sm" onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : saveMsg || "Save changes"}</button>
              </div>
              <div className="settings-card">
                <h3>Subscription</h3>
                <p style={{ fontSize:14,color:"var(--muted)",marginBottom:16 }}>
                  {isPaid ? "You are on the Pro plan ($19/mo)." : "Free plan - " + Math.max(0, FREE_QUOTA - quotaCount) + " of " + FREE_QUOTA + " free reviews remaining."}
                </p>
                {!isPaid && <button className="btn btn-primary btn-sm" onClick={() => setShowPaywall(true)}>Upgrade to Pro → $19/mo</button>}
                {isPaid && <button className="btn btn-ghost btn-sm" onClick={() => window.open("https://billing.stripe.com/p/login/8x23cv4Wd1Au5Gm5CG4AU00","_blank","noopener,noreferrer")}>Manage subscription →</button>}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ── RESET PASSWORD SCREEN ──────────────────────────────────────────────────
function ResetPassword({ onDone, onHome }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const go = async () => {
    if (!password || password.length < 8) { setErr("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setErr("Passwords do not match"); return; }
    setLoading(true); setErr("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setErr(error.message); setLoading(false); return; }
    setDone(true);
    setTimeout(onDone, 2000);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo" onClick={onHome}>Voice<span>mark</span></div>
        {done ? <>
          <h2>Password updated!</h2>
          <p className="auth-sub">Redirecting you to log in...</p>
        </> : <>
          <h2>Set new password</h2>
          <p className="auth-sub">Choose a strong password for your account</p>
          <div className="field"><label>New password</label><input type="password" autoComplete="new-password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} /></div>
          <div className="field"><label>Confirm password</label><input type="password" autoComplete="new-password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key==="Enter" && go()} /></div>
          {err && <p className="err">{err}</p>}
          <button className="btn btn-primary btn-full" onClick={go} disabled={loading}>{loading ? "Saving..." : "Set new password →"}</button>
        </>}
      </div>
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("ErrorBoundary caught:", error, info); }
  render() {
    if (this.state.hasError) return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:40,textAlign:"center"}}>
        <div style={{fontSize:40}}>😕</div>
        <h2 style={{marginBottom:8}}>Something went wrong</h2>
        <p style={{color:"#8a857d",fontSize:14,maxWidth:360}}>An unexpected error occurred. Please refresh the page.</p>
        <button className="btn btn-primary" style={{marginTop:24}} onClick={() => window.location.reload()}>Refresh page</button>
      </div>
    );
  e  return this.props.children;
  }
}


// ── SEO HELPER ─────────────────────────────────────────────────────────────
function setMeta({ title, description, url, type }) {
  document.title = title;
  const set = (sel, attr, val) => {
    let el = document.querySelector(sel);
    if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
    el.setAttribute(attr, val);
  };
  set('meta[name="description"]', "name", "description");
  set('meta[name="description"]', "content", description);
  set('meta[property="og:title"]', "property", "og:title");
  set('meta[property="og:title"]', "content", title);
  set('meta[property="og:description"]', "property", "og:description");
  set('meta[property="og:description"]', "content", description);
  set('meta[property="og:url"]', "property", "og:url");
  set('meta[property="og:url"]', "content", url || window.location.href);
  set('meta[property="og:type"]', "property", "og:type");
  set('meta[property="og:type"]', "content", type || "website");
  set('meta[property="og:image"]', "property", "og:image");
  set('meta[property="og:image"]', "content", "https://www.voicemark.co/og-image.png");
}


// ── BLOG DATA ──────────────────────────────────────────────────────────────
const POSTS = [
  {
    slug: "how-to-ask-clients-for-testimonials",
    tag: "Guide",
    title: "How to Ask Clients for Testimonials (Without Feeling Awkward)",
    description: "Learn exactly how to ask clients for testimonials — what to say, when to ask, and how to make it effortless. Practical scripts and templates included.",
    excerpt: "Most freelancers never ask for testimonials. Here\'s exactly what to say, when to say it, and how to make it effortless for your client.",
    date: "March 16, 2026",
    readTime: "8 min read",
    body: `
<h2>Why learning how to ask clients for testimonials is worth it</h2>
<p>Knowing how to ask clients for testimonials is one of the highest-leverage skills a freelancer can develop. When a potential client finds you — through your website, a referral, or social media — the first thing they're looking for is proof that you deliver. Not just what you say about yourself, but what others say about working with you.</p>
<p>According to BrightLocal, 88% of consumers trust online reviews as much as personal recommendations. For freelancers, a single strong testimonial from a real client does more for your credibility than any portfolio piece or about-page copy. It answers the question every prospect is silently asking: <em>"Can I trust this person with my project?"</em></p>
<p>The challenge is that testimonials don't appear on their own. You have to ask for them — and most freelancers never do. This guide gives you the exact scripts, timing, and approach to make asking feel natural and get a yes almost every time.</p>

<h2>The best time to ask</h2>
<p>Timing is everything. Ask too early and the client hasn't experienced the full value of your work. Ask too late and the positive feelings have faded, the project is a distant memory, and they've moved on.</p>
<p>The sweet spot is right after project completion — ideally within one to two weeks of delivery or handover. At this point:</p>
<ul>
  <li>The work is fresh in their mind</li>
  <li>They've had a chance to see the results</li>
  <li>The positive emotion from a successful project is still there</li>
  <li>They haven't yet been buried under new priorities</li>
</ul>

<h2>Three approaches that work</h2>

<h3>1. The direct ask (best for warm relationships)</h3>
<p>If you have a good rapport with your client, a simple, direct ask is the most effective approach. Keep it short and specific.</p>
<blockquote>Hi [Name], I really enjoyed working on [project] with you. If you have 60 seconds, I'd love a short testimonial I can share on my website. Here's my review link: [your Voicemark link]. Thank you so much — it genuinely helps.</blockquote>
<p>That's it. Short, honest, with a direct link. No lengthy preamble needed.</p>

<h3>2. The offboarding ask (built into your process)</h3>
<p>The most consistent way to collect testimonials is to bake it into your offboarding routine. At the end of every project, send a final summary email that includes a testimonial request as one of the last items.</p>
<p>This removes the awkwardness entirely because it becomes part of how you close every project — not a separate, special ask. Include the testimonial link in your final invoice or project handover document.</p>

<h3>3. The follow-up ask (for past clients)</h3>
<p>Have great clients from the past you never asked? It's not too late.</p>
<blockquote>Hi [Name], I hope things are going well! I'm updating my website and would love to include a word from you about our work together on [project]. If you have a moment: [link]. No pressure at all — and thank you regardless.</blockquote>
<p>Most clients are genuinely happy to help when asked this way.</p>

<h2>Make it as easy as possible</h2>
<p>The number one reason clients don't leave testimonials isn't that they don't want to — it's that it feels like too much work. Here's how to remove every barrier:</p>
<ol>
  <li><strong>Send a direct link.</strong> Don't ask them to find a form on your website. A one-click collection link removes all friction.</li>
  <li><strong>Suggest a prompt.</strong> Ask a specific question: "What was the biggest result you got from our work together?" A blank text box is intimidating; a question makes it easy to start.</li>
  <li><strong>Keep it short.</strong> Tell them two or three sentences is perfect. Most people overthink it and write nothing.</li>
  <li><strong>No account needed.</strong> If your collection tool requires sign-up, most won't bother. The review process should take under 60 seconds.</li>
</ol>

<h2>What makes a good testimonial?</h2>
<p>Not all testimonials are equally useful. A vague "Great work, would recommend!" is better than nothing, but a specific, results-focused testimonial converts much better. The best testimonials mention:</p>
<ul>
  <li>A specific problem or situation before your work</li>
  <li>The result or outcome after your work</li>
  <li>Something specific about working with you (communication, reliability, speed)</li>
</ul>
<p>You can guide your client toward this by asking: <em>"What was the situation before we worked together, and what changed after?"</em></p>
<p>Compare these two testimonials:</p>
<blockquote><strong>Weak:</strong> "Great designer, would recommend!"</blockquote>
<blockquote><strong>Strong:</strong> "Our conversion rate was flat for months. After the redesign, it jumped 34% in the first week. Working with [name] was effortless — they asked the right questions, hit every deadline, and delivered beyond what we expected."</blockquote>
<p>The strong version converts because it's specific, measurable, and addresses the exact fear a potential client has. When you ask for testimonials, guide your clients toward this level of specificity with one targeted question.</p>

<h2>What to do if a client says no</h2>
<p>It happens. Don't take it personally. Some clients are busy, private, or simply not writers. A few things you can do:</p>
<ul>
  <li><strong>Offer to write a draft for them.</strong> Say: "I can write a short draft based on the project — you just edit and approve." Most people find this much easier than writing from scratch.</li>
  <li><strong>Ask for a LinkedIn recommendation instead.</strong> Some clients are more comfortable with a platform they already use.</li>
  <li><strong>Ask again later.</strong> Wait a few months, reach out with a project update, and try once more.</li>
</ul>
<p>The freelancers who consistently collect the most testimonials aren't the most persuasive — they're the most systematic. Build the ask into your process, use a direct collection link, and most clients will be happy to help.</p>

<h2>Once you have it: display it proudly</h2>
<p>Collecting the testimonial is only half the job. For the full picture on where and how to display testimonials, read our guide on <a href="/blog/how-to-add-testimonials-to-your-website" style="color:#0d9488;text-decoration:underline">how to add testimonials to your website</a>. Add your testimonials to your website homepage, proposals, LinkedIn profile, and email signature. The more visible they are, the harder they work for you.</p>
    `
  },
  {
    slug: "how-to-add-testimonials-to-your-website",
    tag: "Tutorial",
    title: "How to Add Testimonials to Your Website (The Right Way)",
    description: "The right way to add testimonials to your website — where to place them, what they should say, and how to embed them so they update automatically.",
    excerpt: "Adding testimonials to your website can double your conversion rate — but only if you do it right. Here's where to place them and how to display them effectively.",
    date: "March 16, 2026",
    readTime: "6 min read",
    body: `
<h2>Why testimonials on your website work</h2>
<p>Your website has one job: convert visitors into clients. And nothing converts better than hearing from someone who has already hired you and loved it.</p>
<p>Studies consistently show that social proof — reviews, testimonials, ratings — is one of the most powerful conversion tools available. A visitor who reads a genuine testimonial from a past client is significantly more likely to reach out than one who only reads your own copy about yourself.</p>
<p>The problem most freelancers and consultants face isn't a lack of happy clients. It's that those clients' words are buried in old emails, never captured, or sitting unused on LinkedIn. This guide shows you how to fix that.</p>

<h2>Where to place testimonials on your website</h2>
<p>Placement matters as much as the testimonials themselves. Here are the highest-impact locations:</p>

<h3>Your homepage</h3>
<p>Your homepage is where most visitors land first. A short testimonial section — two or three quotes from real clients — placed between your hero section and your services does a huge amount of work. It tells visitors immediately that other people have trusted you and been happy with the results.</p>

<h3>Your services or work page</h3>
<p>Place testimonials that are specific to the type of work you're describing. If a client mentions your speed, put that testimonial next to where you talk about your process. Specificity matters — a generic quote anywhere is less powerful than a relevant quote right next to the claim it supports.</p>

<h3>Your contact or inquiry page</h3>
<p>This is one of the most underused placements. A visitor who has made it to your contact page is already interested — they just need a final push. A strong testimonial right next to your contact form can be the thing that turns an uncertain visitor into an inquiry.</p>

<h3>Your proposals</h3>
<p>If you send proposals to potential clients, adding one or two testimonials at the end is a simple way to reinforce your credibility at exactly the right moment.</p>

<h2>What your testimonials should say</h2>
<p>Not all testimonials are equally effective. A vague "Great to work with!" is better than nothing, but a specific, outcome-focused testimonial is significantly more powerful.</p>
<p>The best testimonials answer three questions:</p>
<ul>
  <li><strong>What was the situation before?</strong> ("I had no online presence and was struggling to find clients...")</li>
  <li><strong>What changed after working with you?</strong> ("...within three months I had a full pipeline.")</li>
  <li><strong>What made the experience worth it?</strong> ("Working with [name] was effortless — they handled everything and kept me updated throughout.")</li>
</ul>
<p>When you ask clients for testimonials, guide them gently toward this structure by asking a specific question rather than a generic "Can you write a review?"</p>

<h2>How to add testimonials to your website automatically</h2>
<p>Before you can display testimonials, you need to collect them. Read our guide on <a href="/blog/how-to-ask-clients-for-testimonials" style="color:#0d9488;text-decoration:underline">how to ask clients for testimonials</a> if you're starting from scratch.</p>
<p>The old way of adding testimonials to your website was to copy-paste quotes manually every time you got a new one. This is slow, easy to forget, and means your website is almost always out of date.</p>
<p>The modern approach is to use an embeddable widget that updates automatically. You collect a testimonial, approve it in a dashboard, and it appears on your website without touching the code again. The embed is a single line of HTML:</p>
<blockquote><code>&lt;script src="https://www.voicemark.co/widget.js" data-id="YOUR_ID"&gt;&lt;/script&gt;</code></blockquote>
<p>Paste it anywhere on your website — Squarespace, Webflow, WordPress, or custom HTML. New approved testimonials appear automatically. No developer needed, no manual updates.</p>
<p>This matters because fresh, recent testimonials are more convincing than ones from two years ago. An automatically updating widget keeps your social proof current without any extra effort.</p>

<h2>How many testimonials do you need?</h2>
<p>More is not always better. Three to five strong, specific testimonials beat twenty vague ones every time. Start with your best three, display them prominently, and add new ones as you collect them.</p>
<p>As you grow, you can filter and curate — showing only the testimonials most relevant to the type of work you want more of.</p>
    `
  },
  {
    slug: "social-proof-for-freelancers",
    tag: "Strategy",
    title: "Social Proof for Freelancers: Why It Matters and How to Get It",
    description: "Social proof is the most powerful tool a freelancer has for winning new clients. Here's what it is, why it works, and how to build it from scratch.",
    excerpt: "Social proof is the single most powerful tool a freelancer has for winning new clients. Here's what it is, why it works, and how to build it from scratch.",
    date: "March 16, 2026",
    readTime: "7 min read",
    body: `
<h2>What is social proof for freelancers?</h2>
<p>Social proof for freelancers is any external evidence that other clients have hired you and been happy with the results. The term comes from psychology — it describes the human tendency to look to the actions and opinions of others when making decisions under uncertainty. When you're unsure whether to trust someone, you look for signals that other people already have — and were right to.</p>
<p>For a freelancer, social proof is especially powerful because every new client relationship starts from zero trust. You have no brand recognition, no institutional backing, no team to vouch for you. Social proof fills that gap.</p>
<p>For freelancers and consultants, social proof comes in several forms:</p>
<ul>
  <li>Client testimonials and reviews</li>
  <li>Case studies showing results</li>
  <li>Logos of companies you've worked with</li>
  <li>Number of clients served</li>
  <li>Ratings and star scores</li>
  <li>LinkedIn recommendations</li>
</ul>
<p>Of all of these, client testimonials are the most accessible and the most convincing. They're personal, specific, and hard to fake.</p>

<h2>Why social proof matters more for freelancers than for agencies</h2>
<p>When a potential client hires a large agency, they're buying into a brand with an established reputation. There are case studies, a track record, multiple team members to vouch for the work.</p>
<p>When they hire a freelancer, they're hiring a person. And people are inherently harder to evaluate. Your portfolio shows what you've made, but testimonials show what it was like to work with you — your communication, your reliability, your problem-solving under pressure.</p>
<p>This is why social proof is disproportionately valuable for solo operators. It bridges the trust gap that every freelancer faces with every new prospect.</p>

<h2>The trust gap: why new clients hesitate</h2>
<p>Most freelancers don't lose clients because of their skills. They lose them because of uncertainty. A potential client is essentially being asked to hand money and responsibility to someone they've never worked with before.</p>
<p>That's a leap of faith. Social proof makes the leap smaller. When a prospect reads: "I was nervous about hiring a freelancer for such a critical project, but [name] made the entire process easy and delivered results beyond what I expected" — that directly addresses the exact fear they have.</p>
<p>Good testimonials don't just praise your work. They narrate the experience of trusting you and being glad they did.</p>

<h2>How to build social proof from scratch</h2>
<p>If you're just starting out, or if you've been freelancing for years but never systematically collected testimonials, here's how to build a foundation quickly.</p>

<h3>Start with your best past clients</h3>
<p>Think of the two or three clients who were most satisfied with your work and with whom you had the best relationship. Reach out personally and ask for a short testimonial. Most will say yes — people enjoy helping someone they liked working with.</p>

<h3>Ask immediately after project completion</h3>
<p>Going forward, make asking for a testimonial a standard part of how you close every project. The best time is one to two weeks after delivery, when the client has seen the results but the positive experience is still fresh.</p>

<h3>Make it effortless for your client</h3>
<p>Send a direct link to a collection page. Tell them two or three sentences is plenty. Ask a specific question to get them started: "What was the situation before we worked together, and what changed?" The easier you make it, the more likely they are to do it.</p>

<h3>Diversify your social proof</h3>
<p>Once you have testimonials, think about other forms of social proof you can build. A LinkedIn recommendation from a client carries weight. A case study with real numbers ("increased conversions by 40%") is compelling. A list of recognisable client logos builds credibility at a glance.</p>

<h2>Where to display your social proof</h2>
<p>Collecting testimonials is only half the job. The other half is making sure the right people see them at the right time.</p>
<p>Display your testimonials on your website homepage, your services page, and your contact page. Include them in proposals. Share standout quotes on LinkedIn. The more visible your social proof, the harder it works for you — passively, around the clock, even when you're not actively pitching.</p>

<h2>The compounding effect</h2>
<p>Social proof compounds over time. Each testimonial you collect makes the next potential client more likely to hire you, which gives you another opportunity to collect a testimonial. Freelancers who invest in building social proof early find that new client acquisition gets progressively easier — because their reputation does most of the selling for them.</p>
    `
  },
  {
    slug: "freelance-portfolio-tips",
    tag: "Guide",
    title: "Freelance Portfolio Tips: The One Thing Most Portfolios Are Missing",
    description: "Most freelance portfolios show great work but miss the one thing that actually convinces clients to hire you. Here's what it is and how to add it.",
    excerpt: "Your portfolio shows your work. But the one thing that actually convinces clients to hire you isn't in most freelance portfolios — and it's easier to fix than you think.",
    date: "March 16, 2026",
    readTime: "5 min read",
    body: `
<h2>The freelance portfolio tip most guides don't mention</h2>
<p>Most freelance portfolio tips focus on presentation: use good case studies, show your process, write clear service descriptions, make it easy to contact you. All of that matters. But there's one freelance portfolio tip that almost no guide mentions, and it's the one that most directly affects whether a visitor becomes a client.</p>
<p>Most freelance portfolios follow the same formula: a clean layout, a few case studies, a list of services, a contact form. If you've put effort into yours, you might also have some process documentation, before-and-after comparisons, or detailed project breakdowns.</p>
<p>All of that is valuable. But there's one thing almost every freelance portfolio is missing: the words of someone who has already hired you.</p>

<h2>What clients actually want to know</h2>
<p>When a potential client lands on your portfolio, they're not just asking "is this person skilled?" They're asking:</p>
<ul>
  <li>Is this person easy to work with?</li>
  <li>Do they communicate clearly?</li>
  <li>Do they deliver what they promise?</li>
  <li>Will I regret hiring them?</li>
</ul>
<p>Your portfolio answers the first question. A well-placed testimonial answers all the others.</p>
<p>No amount of polished case study writing can answer "is this person easy to work with?" as convincingly as a past client saying: "Working with [name] was the smoothest project I've had in years. They handled everything, kept me informed, and delivered early."</p>

<h2>Why most freelancers skip testimonials</h2>
<p>It's not that freelancers don't have happy clients. Most do. The problem is that asking for a testimonial feels awkward, or it's easy to forget when you're busy moving on to the next project.</p>
<p>The result is that years of great work go uncaptured. Clients who would have happily written a glowing review were never asked. And portfolios that could be winning more business stay silent on the most important question a prospect has.</p>

<h2>How to add testimonials to your portfolio</h2>
<p>The good news is that this is one of the easiest improvements you can make to your portfolio. Here's the approach that works:</p>

<h3>Collect first, display second</h3>
<p>Start by reaching out to two or three past clients and asking for a short testimonial. Tell them two sentences is plenty. Ask a specific question to make it easy: "What was the result of our work together, and what was it like working with me?"</p>

<h3>Place them strategically</h3>
<p>Don't bury testimonials at the bottom of a separate "testimonials" page. Place them where the decision happens — next to your services description, on your homepage above the fold, and right next to your contact form where a prospect is making up their mind.</p>

<h3>Keep them fresh and automatic</h3>
<p>The most effective portfolios display testimonials that update automatically as you collect new ones. This means your social proof is always current, and you never have to manually edit your website every time a client says something kind.</p>

<h3>Match testimonials to services</h3>
<p>If you offer multiple services, match your testimonials to the relevant service. A testimonial about your design work should appear on your design services page. A testimonial about your communication should appear wherever a client might be nervous about that exact thing.</p>

<h2>The portfolio that wins more business</h2>
<p>The freelancers who consistently win the best clients aren't always the most skilled — they're the ones who have built the most trust before the first conversation even happens. A portfolio backed by genuine client testimonials does exactly that.</p>
<p>It tells every new visitor: other people have taken this leap, and they were glad they did. Come join them.</p>
<p>Ready to add testimonials to your portfolio? Read our guide on <a href="/blog/how-to-add-testimonials-to-your-website" style="color:#0d9488;text-decoration:underline">how to add testimonials to your website</a>.</p>

<h2>Frequently asked questions</h2>

<h3>How many testimonials should a freelance portfolio have?</h3>
<p>Three to five strong, specific testimonials is the sweet spot for most freelance portfolios. More is not always better — three outstanding testimonials beat twenty vague ones every time. Start with your best three and add more as you collect them.</p>

<h3>Where should testimonials go on a freelance portfolio?</h3>
<p>The highest-impact placements are your homepage (above the fold or just below it), your services page next to the relevant service, and your contact page where visitors are making their final decision. Don't bury them on a separate testimonials page nobody visits.</p>

<h3>What should a freelance testimonial say?</h3>
<p>The best testimonials mention a specific situation before your work, the result or outcome after, and something about what it was like to work with you. Guide clients toward this by asking: "What was the situation before we worked together, and what changed?"</p>
    `
  }
];

// ── BLOG INDEX ─────────────────────────────────────────────────────────────
function BlogIndex({ onPost, onSignup, onLogin, onHome }) {
  useEffect(() => {
    setMeta({
      title: "Blog · Voicemark",
      description: "Practical guides on collecting testimonials, building social proof, and growing your freelance business.",
      url: "https://www.voicemark.co/blog"
    });
    return () => { document.title = "Voicemark – Collect Client Testimonials Automatically"; };
  }, []);
  return (
    <div>
      <header>
        <nav className="nav">
          <Logo onClick={onHome} />
          <div className="nav-actions">
            <NavLink href="/blog" className="btn btn-ghost" style={{fontSize:13}}>Blog</NavLink>
            <NavLink href="/?login=1" className="btn btn-ghost" onClick={onLogin}>Log in</NavLink>
            <NavLink href="/?signup=1" className="btn btn-primary" onClick={onSignup}>Start free →</NavLink>
          </div>
        </nav>
      </header>
      <div className="blog-hero">
        <h1>Resources for freelancers</h1>
        <p>Practical guides on collecting social proof and growing your freelance business.</p>
      </div>
      <div className="blog-grid">
        {POSTS.map(post => (
          <NavLink href={"/blog/" + post.slug} className="blog-card" key={post.slug} onClick={() => onPost(post.slug)}>
            <div className="blog-card-tag">{post.tag}</div>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <div className="blog-card-meta">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </NavLink>
        ))}
      </div>
      <footer className="site-footer"><Logo onClick={onHome} /><span>© 2026 Voicemark · Built for freelancers & consultants</span></footer>
    </div>
  );
}

// ── BLOG POST ──────────────────────────────────────────────────────────────
function BlogPost({ slug, onBack, onSignup, onLogin, onHome }) {
  const post = POSTS.find(p => p.slug === slug);
  useEffect(() => {
    if (post) {
      setMeta({
        title: post.title + " · Voicemark",
        description: post.description,
        url: "https://www.voicemark.co/blog/" + post.slug,
        type: "article"
      });
    }
    window.scrollTo(0, 0);
    return () => { document.title = "Voicemark – Collect Client Testimonials Automatically"; };
  }, [slug]);
  useJsonLd(post ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": "2026-03-16",
    "author": { "@type": "Organization", "name": "Voicemark" },
    "publisher": { "@type": "Organization", "name": "Voicemark", "url": "https://www.voicemark.co" },
    "url": "https://www.voicemark.co/blog/" + (post?.slug || "")
  } : {});
  if (!post) return <div className="blog-post-wrap"><p>Post not found.</p></div>;
  return (
    <div>
      <header>
        <nav className="nav">
          <Logo onClick={onHome} />
          <div className="nav-actions">
            <NavLink href="/blog" className="btn btn-ghost" style={{fontSize:13}}>Blog</NavLink>
            <NavLink href="/?login=1" className="btn btn-ghost" onClick={onLogin}>Log in</NavLink>
            <NavLink href="/?signup=1" className="btn btn-primary" onClick={onSignup}>Start free →</NavLink>
          </div>
        </nav>
      </header>
      <article className="blog-post-wrap">
        <NavLink href="/blog" className="blog-post-back">← All articles</NavLink>
        <div className="blog-post-tag">{post.tag}</div>
        <h1>{post.title}</h1>
        <div className="blog-post-meta">{post.date} · {post.readTime}</div>
        <div className="blog-post-body" dangerouslySetInnerHTML={{ __html: post.body }} />
        <div className="blog-post-cta">
          <h3>Collect your first testimonial in 2 minutes</h3>
          <p>Voicemark gives you a personal collection link you can send to any client. They leave a review in 60 seconds — no account needed. You approve it, and it appears on your website automatically.</p>
          <NavLink href="/?signup=1" className="btn btn-primary" onClick={onSignup}>Get started free →</NavLink>
        </div>
      </article>
      <footer className="site-footer"><Logo onClick={onHome} /><span>© 2026 Voicemark · Built for freelancers & consultants</span></footer>
    </div>
  );
}


function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const path = currentPath;
  const collectMatch = path.match(/^\/collect\/(.+)$/);

  const [screen, setScreen] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("signup") === "1") {
      window.history.replaceState({}, "", "/");
      return "signup";
    }
    if (p.get("login") === "1") {
      window.history.replaceState({}, "", "/");
      return "login";
    }
    return "landing";
  });
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const onPop = () => {
      const newPath = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      setCurrentPath(newPath);
      if (newPath === "/") {
        if (params.get("signup") === "1") {
          window.history.replaceState({}, "", "/");
          setScreen("signup");
        } else if (params.get("login") === "1") {
          window.history.replaceState({}, "", "/");
          setScreen("login");
        } else {
          setScreen("landing");
        }
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    // Check if this is a password recovery redirect from Supabase email link
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setChecking(false);
      setScreen("reset");
      return;
    }

    // Get current session first, then set up listener for future changes
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        setUser({ ...session.user, profile });
        setScreen("app");
      }
      setChecking(false);
    });

    // Listen for auth events (password recovery + future sign-ins via magic link etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setScreen("reset");
        setChecking(false);
      } else if (event === "SIGNED_IN" && session?.user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        setUser({ ...session.user, profile });
        setScreen("app");
        setChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const blogPostMatch = path.match(/^\/blog\/(.+)$/);
  const isBlogIndex = path === "/blog";

  if (collectMatch) {
    return <><StyleInject /><CollectPage slug={collectMatch[1]} /></>;
  }
  if (isBlogIndex) {
    return <><StyleInject /><BlogIndex onPost={slug => { window.history.pushState({}, "", "/blog/" + slug); window.dispatchEvent(new PopStateEvent("popstate")); }} onSignup={() => { window.history.pushState({}, "", "/?signup=1"); window.dispatchEvent(new PopStateEvent("popstate")); }} onLogin={() => { window.history.pushState({}, "", "/?login=1"); window.dispatchEvent(new PopStateEvent("popstate")); }} onHome={() => { window.history.pushState({}, "", "/"); window.dispatchEvent(new PopStateEvent("popstate")); }} /></>;
  }
  if (blogPostMatch) {
    return <><StyleInject /><BlogPost slug={blogPostMatch[1]} onBack={() => { window.history.pushState({}, "", "/blog"); window.dispatchEvent(new PopStateEvent("popstate")); }} onSignup={() => { window.history.pushState({}, "", "/?signup=1"); window.dispatchEvent(new PopStateEvent("popstate")); }} onLogin={() => { window.history.pushState({}, "", "/?login=1"); window.dispatchEvent(new PopStateEvent("popstate")); }} onHome={() => { window.history.pushState({}, "", "/"); window.dispatchEvent(new PopStateEvent("popstate")); }} /></>;
  }

  if (checking) return <><StyleInject /><div className="loading" style={{ minHeight:"100vh" }}>Loading...</div></>;

  const auth = u => { setUser(u); setScreen("app"); };
  const logout = async () => { await supabase.auth.signOut(); setUser(null); setScreen("landing"); };

  return (
    <>
      <StyleInject />
      {screen === "app" && user && <Dashboard user={user} onLogout={logout} />}
      {screen === "login" && <Auth mode="login" onAuth={auth} onSwitch={() => setScreen("signup")} onHome={() => setScreen("landing")} />}
      {screen === "signup" && <Auth mode="signup" onAuth={auth} onSwitch={() => setScreen("login")} onHome={() => setScreen("landing")} />}
      {screen === "reset" && <ResetPassword onDone={() => setScreen("login")} onHome={() => setScreen("landing")} />}
      {screen === "landing" && <Landing onSignup={() => setScreen("signup")} onLogin={() => setScreen("login")} />}
    </>
  );
}

function Root() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default Root;

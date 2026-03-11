import { useState, useEffect } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://dcjfuwapheupwxnroizo.supabase.co";
const SUPABASE_KEY = "sb_publishable_DPLOo-i8GB8bFyZ04abC4w_ffuUKYV1";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const FREE_QUOTA = 3;
const newSlug = (company) => company.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);
const today = () => new Date().toISOString().split("T")[0];

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
.widget-code{background:var(--ink);color:#a8f0e8;font-family:monospace;font-size:13px;padding:16px 20px;border-radius:var(--r);margin-top:20px;text-align:center}
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
@media(max-width:640px){
  .nav,.site-footer{padding:16px 20px}
  .hero{padding:40px 20px}
  .how-steps,.widget-grid,.stats-row,.faq-section{grid-template-columns:1fr}
  .faq-section{padding:48px 20px}
  .app{flex-direction:column}
  .sidebar{width:100%;height:auto;position:relative}
  .content{padding:20px}
}
`;

function StyleInject() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = G;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
  return null;
}

function Logo({ onClick }) {
  return <span className="logo" onClick={onClick}>Voice<span>mark</span></span>;
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
  const tiles = [
    { name:"Sarah K.", role:"Freelance Designer", rating:5, text:"Landed 3 new clients after adding these reviews to my portfolio.", color:"#0d9488" },
    { name:"Marco T.", role:"Business Consultant", rating:5, text:"My proposal conversion rate doubled. Clients trust me before we meet.", color:"#7c3aed" },
    { name:"Priya M.", role:"UX Researcher", rating:4, text:"Sent the link to 10 clients, got 8 reviews back within a day.", color:"#b45309" },
    { name:"James W.", role:"Photographer", rating:5, text:"Finally a tool that looks as professional as my work.", color:"#0369a1" },
  ];
  return (
    <div>
      <nav className="nav">
        <Logo />
        <div className="nav-actions">
          <button className="btn btn-ghost" onClick={onLogin}>Log in</button>
          <button className="btn btn-primary" onClick={onSignup}>Start free →</button>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-badge">✦ Built for freelancers & consultants</div>
        <h1>Turn happy clients into<br /><em>social proof</em></h1>
        <p>Send one link. Collect beautiful testimonials. Embed them on your website automatically.</p>
        <div className="hero-cta">
          <button className="btn btn-primary btn-lg" onClick={onSignup}>Collect your first review →</button>
          <button className="btn btn-outline btn-lg" onClick={onLogin}>Log in</button>
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
                <div className="t-avatar" style={{ background:t.color }}>{t.name[0]}</div>
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
          <button className="btn btn-primary btn-lg btn-full" onClick={onSignup}>Get started free →</button>
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
        <button className="btn btn-lg" style={{ background:"white",color:"var(--teal)",border:"none",fontWeight:600 }} onClick={onSignup}>Get started free →</button>
      </div>
      <footer className="site-footer"><Logo /><span>© 2026 Voicemark · Built for freelancers & consultants</span></footer>
    </div>
  );
}

// ── AUTH ───────────────────────────────────────────────────────────────────
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
        const { data, error } = await supabase.auth.signUp({ email: f.email, password: f.password });
        if (error) { setErr(error.message); setLoading(false); return; }
        const slug = newSlug(f.company);
        await supabase.from("profiles").insert({ id: data.user.id, company: f.company, slug, plan: "trial" });
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
        <div className="field"><label>Email</label><input type="email" placeholder="you@example.com" value={f.email} onChange={set("email")} onKeyDown={e => e.key==="Enter" && go()} /></div>
        <div className="field">
          <label style={{ display:"flex", justifyContent:"space-between" }}>
            Password
            {mode === "login" && <button style={{ background:"none",border:"none",color:"var(--teal)",fontSize:12,cursor:"pointer",fontFamily:"inherit" }} onClick={() => setForgotMode(true)}>Forgot password?</button>}
          </label>
          <input type="password" placeholder="••••••••" value={f.password} onChange={set("password")} onKeyDown={e => e.key==="Enter" && go()} />
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
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Free reviews used up</h2>
        <p>You've collected 10 free reviews. Upgrade to keep collecting unlimited testimonials.</p>
        <div className="m-price">$19 <span>/ month</span></div>
        <ul className="m-features">
          {["Unlimited testimonials","Embeddable widget","Custom branding","Email notifications"].map(f => <li key={f}>{f}</li>)}
        </ul>
        <button className="btn btn-primary btn-lg btn-full" style={{ marginBottom:10 }}
          onClick={() => window.open("https://buy.stripe.com/fZu5kD1K14MGgl05CG4AU01","_blank")}>
          Upgrade with Stripe →
        </button>
        <button className="btn btn-ghost btn-full" onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}

// ── COLLECT PAGE ───────────────────────────────────────────────────────────
function CollectPage({ userId, company, onDone }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [f, setF] = useState({ name:"", role:"", text:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    if (!rating || !f.text || !f.name) { setErr("Please add a rating, your name, and a review"); return; }
    setLoading(true); setErr("");
    const { error } = await supabase.from("reviews").insert({ user_id: userId, name: f.name, role: f.role, text: f.text, rating, status: "pending" });
    if (error) { setErr("Something went wrong. Please try again."); setLoading(false); return; }
    setSubmitted(true); setLoading(false);
    if (onDone) setTimeout(onDone, 2000);
  };

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
          <div className="field"><label>Your review</label><textarea placeholder="What did you enjoy about working together?" value={f.text} onChange={set("text")} /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div className="field"><label>Your name</label><input placeholder="Sarah K." value={f.name} onChange={set("name")} /></div>
            <div className="field"><label>Role / Company</label><input placeholder="Freelance Designer" value={f.role} onChange={set("role")} /></div>
          </div>
          {err && <p className="err">{err}</p>}
          <button className="btn btn-primary btn-full" onClick={submit} disabled={loading}>{loading ? "Submitting..." : "Submit review →"}</button>
          <div className="collect-footer">Powered by <span>Voicemark</span></div>
        </> : (
          <div className="success-card">
            <div className="success-icon">🎉</div>
            <h2 style={{ marginBottom:8 }}>Thank you!</h2>
            <p style={{ color:"var(--muted)", fontSize:14 }}>Your review has been submitted and will appear on {company}'s website shortly.</p>
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
  const [showPaywall, setShowPaywall] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewCollect, setViewCollect] = useState(false);

  const profile = user.profile;
  const isPaid = profile?.plan === "paid";
  const collectUrl = `voicemark.app/collect/${profile?.slug}`;

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase.from("reviews").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const total = reviews.length;
  const approved = reviews.filter(r => r.status === "approved").length;
  const pending = reviews.filter(r => r.status === "pending").length;
  const avgRating = total ? (reviews.reduce((s,r) => s + r.rating, 0) / total).toFixed(1) : "—";

  const updateStatus = async (id, status) => {
    await supabase.from("reviews").update({ status }).eq("id", id);
    fetchReviews();
  };

  const copy = (text) => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (viewCollect) return <CollectPage userId={user.id} company={profile?.company} onDone={() => { setViewCollect(false); fetchReviews(); }} />;

  return (
    <div className="app">
      <StyleInject />
      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} />}
      <aside className="sidebar">
        <div className="s-logo" onClick={onLogout}>Voice<span>mark</span></div>
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
        {!isPaid && (
          <div className="trial-banner">
            <span>Free plan · <strong>{Math.max(0, FREE_QUOTA - total)} reviews remaining</strong></span>
            <button className="btn btn-primary btn-sm" onClick={() => setShowPaywall(true)}>Upgrade $19/mo →</button>
          </div>
        )}

        {tab === "reviews" && (
          <>
            <div className="topbar">
              <h1>Reviews</h1>
              <button className="btn btn-primary btn-sm" onClick={() => setViewCollect(true)}>Preview collection page →</button>
            </div>
            <div className="content">
              <div className="stats-row">
                <div className="stat-card"><div className="stat-val">{total}</div><div className="stat-label">Total reviews</div></div>
                <div className="stat-card"><div className="stat-val">{avgRating}</div><div className="stat-label">Avg rating</div></div>
                <div className="stat-card"><div className="stat-val">{pending}</div><div className="stat-label">Awaiting approval</div></div>
              </div>
              {loading ? <div className="loading">Loading reviews...</div> : reviews.length === 0 ? (
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
                          <span className="rc-date">{r.created_at?.split("T")[0]}</span>
                        </div>
                      </div>
                      {r.status === "pending" && (
                        <div className="rc-actions">
                          <button className="btn btn-primary btn-sm" onClick={() => updateStatus(r.id,"approved")}>✓ Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => updateStatus(r.id,"rejected")}>✕ Reject</button>
                        </div>
                      )}
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
                  <code>{`<script src="https://voicemark.app/widget.js" data-id="${user.id}"></script>`}</code>
                  <button className="btn btn-primary btn-sm" onClick={() => copy(`<script src="https://voicemark.app/widget.js" data-id="${user.id}"></script>`)}>{copied ? "✓ Copied!" : "Copy code"}</button>
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
                        <div className="t-avatar" style={{ background:"var(--teal)" }}>{r.name[0]}</div>
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
                  <span className="link-url">https://{collectUrl}</span>
                  <button className="btn btn-primary btn-sm" onClick={() => copy(`https://${collectUrl}`)}>{copied ? "✓ Copied!" : "Copy link"}</button>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setViewCollect(true)}>Preview what clients see →</button>
              </div>
              <div className="settings-card">
                <h3>Ready-to-send email template</h3>
                <div style={{ background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:16,fontSize:14,lineHeight:1.8,color:"#3a3630" }}>
                  Hi [Name],<br /><br />
                  It was a pleasure working with you! If you have 60 seconds, a short review would mean a lot:<br />
                  <span style={{ color:"var(--teal)" }}>https://{collectUrl}</span><br /><br />
                  Thank you 🙏
                </div>
                <button className="btn btn-ghost btn-sm" style={{ marginTop:12 }} onClick={() => copy(`Hi [Name],\n\nIt was a pleasure working with you! If you have 60 seconds, a short review would mean a lot:\nhttps://${collectUrl}\n\nThank you 🙏`)}>{copied ? "✓ Copied!" : "Copy email template"}</button>
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
                <div className="field"><label>Company name</label><input defaultValue={profile?.company} /></div>
                <div className="field"><label>Email</label><input defaultValue={user.email} disabled /></div>
                <button className="btn btn-primary btn-sm">Save changes</button>
              </div>
              <div className="settings-card">
                <h3>Subscription</h3>
                <p style={{ fontSize:14,color:"var(--muted)",marginBottom:16 }}>
                  {isPaid ? "You're on the Pro plan ($19/mo)." : `Free plan · ${Math.max(0, FREE_QUOTA - total)} of ${FREE_QUOTA} free reviews remaining.`}
                </p>
                {!isPaid && <button className="btn btn-primary btn-sm" onClick={() => setShowPaywall(true)}>Upgrade to Pro → $19/mo</button>}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ── RESET PASSWORD SCREEN ──────────────────────────────────────────────────
function ResetPassword({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const go = async () => {
    if (!password || password.length < 6) { setErr("Password must be at least 6 characters"); return; }
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
        <div className="auth-logo">Voice<span>mark</span></div>
        {done ? <>
          <h2>Password updated!</h2>
          <p className="auth-sub">Redirecting you to log in...</p>
        </> : <>
          <h2>Set new password</h2>
          <p className="auth-sub">Choose a strong password for your account</p>
          <div className="field"><label>New password</label><input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} /></div>
          <div className="field"><label>Confirm password</label><input type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key==="Enter" && go()} /></div>
          {err && <p className="err">{err}</p>}
          <button className="btn btn-primary btn-full" onClick={go} disabled={loading}>{loading ? "Saving..." : "Set new password →"}</button>
        </>}
      </div>
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

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

    // Listen for PASSWORD_RECOVERY event (from reset email link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setScreen("reset");
        setChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checking) return <><StyleInject /><div className="loading" style={{ minHeight:"100vh" }}>Loading...</div></>;

  const auth = u => { setUser(u); setScreen("app"); };
  const logout = async () => { await supabase.auth.signOut(); setUser(null); setScreen("landing"); };

  return (
    <>
      <StyleInject />
      {screen === "app" && user && <Dashboard user={user} onLogout={logout} />}
      {screen === "login" && <Auth mode="login" onAuth={auth} onSwitch={() => setScreen("signup")} onHome={() => setScreen("landing")} />}
      {screen === "signup" && <Auth mode="signup" onAuth={auth} onSwitch={() => setScreen("login")} onHome={() => setScreen("landing")} />}
      {screen === "reset" && <ResetPassword onDone={() => setScreen("login")} />}
      {screen === "landing" && <Landing onSignup={() => setScreen("signup")} onLogin={() => setScreen("login")} />}
    </>
  );
}

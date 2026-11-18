/* WA Enquiry — lightweight, dependency-free WhatsApp lead widget. */
(() => {
  if (customElements.get("wa-enquiry")) return;
  const defaults = { name: "Let's talk", message: "Hi! I'd like to make an enquiry.", services: "Website design,UI/UX design,Other" };
  class WAEnquiry extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.opened = false;
    }
    connectedCallback() {
      const phone = (this.getAttribute("phone") || this.dataset.phone || "").replace(/\D/g, "");
      if (!phone) return;
      const name = this.getAttribute("name") || this.dataset.name || defaults.name;
      const intro = this.getAttribute("message") || this.dataset.message || defaults.message;
      const services = (this.getAttribute("services") || this.dataset.services || defaults.services).split(",").map(s => s.trim()).filter(Boolean);
      const left = (this.getAttribute("position") || this.dataset.position) === "left";
      this.shadowRoot.innerHTML = `
        <style>
          :host{--wa:#20c66b;--ink:#17211c;--muted:#64736a;font:14px/1.45 system-ui,sans-serif;position:fixed;z-index:99999;bottom:22px;${left?"left:20px":"right:20px"}}
          *{box-sizing:border-box}button,input{font:inherit}.launcher{width:58px;height:58px;border:0;border-radius:50%;background:var(--wa);color:#062b16;font-size:25px;box-shadow:0 8px 28px #0003;cursor:pointer}
          .panel{width:min(340px,calc(100vw - 32px));background:#fff;color:var(--ink);border:1px solid #e7eee9;border-radius:18px;box-shadow:0 16px 55px #10251b30;margin-bottom:12px;overflow:hidden}
          header{background:#eafaf0;padding:18px}header strong{display:block;font-size:16px}header small{color:var(--muted)}
          form{padding:16px;display:grid;gap:12px}label{display:grid;gap:6px;font-weight:600;font-size:12px}
          input,select{width:100%;padding:11px;border:1px solid #dce6df;border-radius:9px;color:var(--ink);background:#fff}
          .send{border:0;border-radius:10px;padding:12px;background:var(--wa);color:#063219;font-weight:700;cursor:pointer}
          .close{float:right;border:0;background:transparent;font-size:20px;cursor:pointer;color:var(--ink)}
          [hidden]{display:none!important}button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #86e7ae;outline-offset:2px}
          @media(prefers-reduced-motion:no-preference){.panel{animation:pop .16s ease-out}@keyframes pop{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}}
        </style>
        <section class="panel" hidden aria-label="WhatsApp enquiry">
          <header><button class="close" type="button" aria-label="Close">×</button><strong></strong><small>Usually replies as soon as possible</small></header>
          <form>
            <label>Your name<input name="visitor" autocomplete="name" placeholder="e.g. Alex" required maxlength="80"></label>
            <label>What do you need?<select name="service" required><option value="">Choose a service</option>${services.map(s=>`<option>${s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}</option>`).join("")}</select></label>
            <label>Brief details<input name="details" placeholder="Tell us a little about your project" maxlength="300"></label>
            <button class="send" type="submit">Continue on WhatsApp ↗</button>
          </form>
        </section>
        <button class="launcher" type="button" aria-label="Open WhatsApp enquiry" aria-expanded="false">◉</button>`;
      const root = this.shadowRoot, panel = root.querySelector(".panel"), launcher = root.querySelector(".launcher");
      root.querySelector("header strong").textContent = name;
      const toggle = open => { panel.hidden = !open; launcher.setAttribute("aria-expanded", String(open)); this.opened = open; if(open){root.querySelector("input").focus();this.dispatchEvent(new CustomEvent("wa-enquiry:open",{bubbles:true,composed:true}));} };
      launcher.addEventListener("click",()=>toggle(!this.opened));
      root.querySelector(".close").addEventListener("click",()=>toggle(false));
      root.querySelector("form").addEventListener("submit",e=>{
        e.preventDefault(); const data = new FormData(e.currentTarget);
        const text = [intro,`Name: ${data.get("visitor")}`,`Service: ${data.get("service")}`,data.get("details") && `Details: ${data.get("details")}`].filter(Boolean).join("\n");
        this.dispatchEvent(new CustomEvent("wa-enquiry:send",{detail:{service:data.get("service")},bubbles:true,composed:true}));
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`,"_blank","noopener,noreferrer");
      });
    }
  }
  customElements.define("wa-enquiry", WAEnquiry);
  const script = document.currentScript;
  if (script && script.dataset.phone && !document.querySelector("wa-enquiry")) {
    const el = document.createElement("wa-enquiry");
    ["phone","name","message","services","position"].forEach(k=>{if(script.dataset[k])el.setAttribute(k,script.dataset[k]);});
    document.body.append(el);
  }
})();
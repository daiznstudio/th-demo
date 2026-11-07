/* TrendHijacking redesign demo — shared behaviour */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const page = document.body.dataset.page || "";

  const ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 8h9.5M8.5 4l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  // Wordmark: "trend" heavy + "hijacking" light + square dot, outlined SVGs in assets/logo
  const LOGO = `<img src="assets/logo/th-logo-light.svg" alt="TrendHijacking" width="641" height="100">`;
  const LOGO_DARK = `<img src="assets/logo/th-logo-dark.svg" alt="TrendHijacking" width="641" height="100">`;

  const LINKS = [
    ["home", "index.html", "Home"],
    ["about", "about.html", "About us"],
    ["businesses", "businesses.html", "Businesses"],
    ["services", "services.html", "Services"],
    ["blog", "blog.html", "Blog"],
  ];
  // Businesses dropdown: niche keys match the filter chips on businesses.html
  const NICHES = [
    ["health", "Health &amp; wellness"],
    ["tech", "Tech accessories"],
    ["home", "Home"],
    ["pets", "Pets"],
    ["fashion", "Fashion"],
  ];
  const CHEVRON = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4.5l3 3 3-3"/></svg>';
  const DROP = `
    <div class="drop-panel" role="menu">
      <div class="drop-col">
        <a class="drop-all" href="businesses.html"><b>All businesses for sale</b><span>Vetted, profitable e-commerce brands</span></a>
        <h5>Browse by niche</h5>
        ${NICHES.map(([k, t]) => `<a href="businesses.html#${k}">${t}</a>`).join("")}
      </div>
      <a class="drop-card sq-sm" href="contact.html">
        <span class="pill pill-green">Sellers</span>
        <b>Sell your business</b>
        <span>Get a free, confidential valuation from our team.</span>
        <span class="link-arrow">Get started ${ARROW}</span>
      </a>
    </div>`;

  /* ---------- nav + footer ---------- */
  const navEl = $("#nav");
  if (navEl) {
    navEl.className = "nav";
    navEl.innerHTML = `
      <div class="nav-in">
        <a class="logo" href="index.html" aria-label="TrendHijacking home">${LOGO}<img class="lg-on-dark" src="assets/logo/th-logo-dark.svg" alt="" width="641" height="100"></a>
        <nav class="nav-links" aria-label="Main">
          ${LINKS.map(([k, h, t]) => k === "businesses"
            ? `<div class="drop"><button class="drop-btn ${page === k ? "active" : ""}" aria-expanded="false" aria-haspopup="true">${t}${CHEVRON}</button>${DROP}</div>`
            : `<a href="${h}" class="${page === k ? "active" : ""}">${t}</a>`).join("")}
        </nav>
        <div class="nav-cta">
          <a class="btn btn-duo" href="contact.html">Book a consultation<span class="ic">${ARROW}</span></a>
          <button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
        </div>
      </div>
      <div class="mnav">
        ${LINKS.map(([k, h, t]) => `<a href="${h}">${k === "businesses" ? "Businesses for sale" : t}</a>`).join("")}
        <a href="contact.html">Contact</a>
        <a class="btn btn-lime" href="contact.html">Book a consultation<span class="ic">${ARROW}</span></a>
      </div>`;
    const burger = $(".burger", navEl);
    burger.addEventListener("click", () => {
      const open = navEl.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
    // dropdown: hover opens on desktop (CSS); click toggles for touch + keyboard
    const drop = $(".drop", navEl);
    const dropBtn = $(".drop-btn", navEl);
    const setDrop = (open) => { drop.classList.toggle("open", open); dropBtn.setAttribute("aria-expanded", open); };
    dropBtn.addEventListener("click", () => setDrop(!drop.classList.contains("open")));
    document.addEventListener("click", (e) => { if (!drop.contains(e.target)) setDrop(false); });
    drop.addEventListener("keydown", (e) => { if (e.key === "Escape") { setDrop(false); dropBtn.focus(); } });
    drop.addEventListener("mouseleave", () => setDrop(false));

    // homepage: nav goes transparent with light text while it sits over the dark hero
    const darkHero = $(".hero");
    if (darkHero) {
      navEl.classList.add("on-hero");
      new IntersectionObserver(([e]) => {
        navEl.classList.toggle("on-hero", e.isIntersecting);
        darkHero.classList.toggle("is-away", !e.isIntersecting); // pauses the glow animation off screen
      }, { rootMargin: "-60px 0px 0px 0px" }).observe(darkHero);
    }
  }

  const footEl = $("#foot");
  if (footEl) {
    footEl.className = "foot";
    // latest guides sit above the footer links; blog + article pages already list posts right above the footer
    const FOOT_POSTS = [
      ["Ge0IS98pJHqXAViJqm7sPVfGJs4.png", "Acquisition", "May 25, 2026", "The M&amp;A Minefield, How to Buy an Ecommerce Business Without Destroying Your Capital"],
      ["lSisdz2W5gmqIFfuz3ScmOuK2U.png", "Acquisition", "May 22, 2026", "Web-Based Business for Sale: 5 Proven Sites Worth Buying Now"],
      ["YNBfCivpO78PLjQhM9Qb1h8Rgc.png", "Investing", "May 21, 2026", "Buy vs. Build Ecommerce Business: Which Strategy Creates Faster Online Growth?"],
    ];
    const footBlog = page === "blog" ? "" : `
        <div class="foot-blog on-dark">
          <div class="sec-head">
            <div class="stack-sm">
              <span class="eyebrow">Insights</span>
              <h2 class="d3">Our latest <em>guides.</em></h2>
            </div>
            <a class="btn btn-lime" href="blog.html">Browse the blog<span class="ic">${ARROW}</span></a>
          </div>
          <div class="posts">
            ${FOOT_POSTS.map(([img, cat, date, title]) => `<a class="post" href="article.html">
              <div class="media sq"><img src="https://framerusercontent.com/images/${img}?scale-down-to=1024" alt="" loading="lazy"></div>
              <div class="post-meta"><span class="post-cat">${cat}</span><span>·</span><span>${date}</span></div>
              <h3 class="post-t">${title}</h3>
            </a>`).join("")}
          </div>
        </div>`;
    footEl.innerHTML = `
      <div class="wrap">${footBlog}
        <div class="foot-top">
          <div>
            <a class="logo" href="index.html">${LOGO_DARK}</a>
            <p class="foot-addr">Buy-side e-commerce M&amp;A. We help entrepreneurs and investors find, vet, negotiate and acquire profitable online businesses.</p>
            <p class="foot-addr">Mildenhall, Suffolk, United Kingdom<br>St. Petersburg, Florida, United States</p>
          </div>
          <div><h4>Who we are</h4><ul>
            <li><a href="about.html">About us</a></li><li><a href="services.html#process">Our process</a></li>
            <li><a href="index.html#reviews">Testimonials &amp; reviews</a></li><li><a href="index.html#cases">Case studies</a></li>
            <li><a href="contact.html">Contact us</a></li></ul></div>
          <div><h4>E-commerce deals</h4><ul>
            <li><a href="businesses.html">Businesses for sale</a></li><li><a href="contact.html">Sell your business</a></li>
            <li><a href="blog.html">Blog &amp; guides</a></li><li><a href="contact.html">Free investment guide</a></li></ul></div>
          <div><h4>Get in touch</h4><ul>
            <li><a href="mailto:support@trendhijacking.com">support@trendhijacking.com</a></li>
            <li><a href="tel:+442032877320">+44 20 3287 7320</a></li>
            <li><a href="tel:+12136323209">+1 213 632 3209</a></li></ul></div>
        </div>
        <div class="foot-bot" style="padding-top:28px">
          <p>Testimonials are real but not typical. Results depend on many variables and no financial gain is guaranteed. This site is not affiliated with or endorsed by Facebook.</p>
          <p>© 2026 Trendhijacking.com · Company No. 13503806 · <a href="#">Privacy</a> · <a href="#">Terms</a></p>
        </div>
      </div>`;
  }

  /* WhatsApp button */
  document.body.insertAdjacentHTML("beforeend",
    `<a class="wa" href="https://wa.me/442032877320" target="_blank" rel="noopener"><i><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1a17 17 0 0 1-1.7-.6 13.3 13.3 0 0 1-5.1-4.5c-.4-.5-1.1-1.6-1.1-3s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.3.5-.4.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.2.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3.1.2.1.8-.1 1.5Z"/></svg></i><span>Message us</span></a>`);

  /* ---------- filters (businesses + blog) ---------- */
  const filterable = $("[data-filter-grid]");
  if (filterable) {
    const items = $$("[data-cat]", filterable);
    const search = $("[data-search]");
    const empty = $(".empty");
    const more = $("[data-more]");
    const count = $("[data-count]");
    const page = parseInt(filterable.dataset.page, 10) || Infinity;
    let cat = "all";
    let limit = page;
    const apply = () => {
      const q = (search?.value || "").trim().toLowerCase();
      const matches = items.filter((el) => (cat === "all" || el.dataset.cat.split(" ").includes(cat)) && (!q || el.textContent.toLowerCase().includes(q)));
      const fresh = [];
      items.forEach((el) => {
        const show = matches.indexOf(el) > -1 && matches.indexOf(el) < limit;
        if (show && el.style.display === "none") fresh.push(el);
        el.style.display = show ? "" : "none";
      });
      if (empty) empty.style.display = matches.length ? "none" : "block";
      if (more) more.style.display = matches.length > limit ? "" : "none";
      if (count) count.textContent = matches.length ? `Showing ${Math.min(limit, matches.length)} of ${matches.length} articles` : "No articles found";
      window.ScrollTrigger?.refresh();
      return fresh;
    };
    const reset = () => { limit = page; apply(); };
    $$(".chip[data-f]").forEach((c) => c.addEventListener("click", () => {
      $$(".chip[data-f]").forEach((x) => x.classList.toggle("active", x === c));
      cat = c.dataset.f;
      reset();
    }));
    search?.addEventListener("input", reset);
    more?.addEventListener("click", () => {
      limit += page;
      const fresh = apply();
      if (window.gsap && fresh.length) gsap.fromTo(fresh, { opacity: 0, y: 40, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "back.out(1.1)", stagger: 0.08 });
    });
    if (more) apply();
    // niche links from the nav dropdown arrive as businesses.html#tech
    const fromHash = () => $(`.chip[data-f="${location.hash.slice(1)}"]`)?.click();
    fromHash();
    addEventListener("hashchange", fromHash);
  }

  /* ---------- contact form (demo only) ---------- */
  const form = $("form.form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    $(".form-ok", form).style.display = "block";
    form.querySelector("button[type=submit]").disabled = true;
  });
  // homepage off-market sentence arrives as contact.html?criteria=...
  const criteria = new URLSearchParams(location.search).get("criteria");
  if (form && criteria) $("#m", form).value = criteria;

  /* ---------- homepage off-market: sentence pickers ---------- */
  const omSentence = $("#om-sentence");
  if (omSentence) {
    const picks = $$(".om-pick", omSentence);
    const cta = $("#om-cta");
    const closePicks = (except) => picks.forEach((p) => {
      if (p === except) return;
      p.classList.remove("open");
      p.firstElementChild.setAttribute("aria-expanded", "false");
    });
    picks.forEach((p) => {
      const btn = p.firstElementChild;
      const label = btn.firstElementChild;
      const menu = $(".om-menu", p);
      p.dataset.opts.split("|").forEach((opt) => {
        const item = document.createElement("button");
        item.type = "button";
        item.textContent = opt;
        if (opt === label.textContent) item.setAttribute("aria-current", "true");
        item.addEventListener("click", () => {
          label.textContent = opt;
          $$("button", menu).forEach((b) => b.removeAttribute("aria-current"));
          item.setAttribute("aria-current", "true");
          // the form only gets prefilled once the visitor has actually chosen something
          const [niche, price, role] = picks.map((x) => x.firstElementChild.firstElementChild.textContent);
          const text = `I'm looking for ${niche} priced at ${price}, and I want to be ${role}.`;
          cta.href = `contact.html?criteria=${encodeURIComponent(text)}`;
          closePicks();
          btn.focus();
        });
        menu.append(item);
      });
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        closePicks(p);
        btn.setAttribute("aria-expanded", p.classList.toggle("open"));
        // keep the open menu inside the white card on narrow screens
        menu.style.transform = "";
        if (p.classList.contains("open")) {
          const card = omSentence.parentElement.getBoundingClientRect();
          const over = menu.getBoundingClientRect().right - (card.right - 8);
          if (over > 0) menu.style.transform = `translateX(${-over}px)`;
        }
      });
    });
    document.addEventListener("click", () => closePicks());
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePicks(); });
  }

  /* ---------- services: tabs (pick a service, deal tracker) ---------- */
  $$("[data-picker]").forEach((picker) => {
    const tabs = $$('[role="tab"]', picker);
    const panels = $$('[role="tabpanel"]', picker);
    const select = (i) => {
      tabs.forEach((t, n) => {
        t.setAttribute("aria-selected", n === i);
        t.tabIndex = n === i ? 0 : -1;
        t.classList.toggle("done", n < i); // the tracker fills up to the current stage
        t.classList.toggle("now", n === i);
      });
      panels.forEach((p, n) => p.classList.toggle("on", n === i));
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(i));
      t.addEventListener("keydown", (e) => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        const next = (i + step + tabs.length) % tabs.length;
        select(next);
        tabs[next].focus();
      });
    });
    // homepage links like services.html#diligence open that service
    const fromHash = () => {
      const i = panels.findIndex((p) => `#${p.id}` === location.hash);
      if (i < 0) return;
      select(i);
      picker.scrollIntoView();
    };
    fromHash();
    addEventListener("hashchange", fromHash);
    addEventListener("load", fromHash);

    // deal tracker: walks through the stages by itself. The bar filling across the current stage IS the
    // timer (see .auto in the CSS): when it finishes the next stage opens, and pausing it pauses everything.
    if (!picker.hasAttribute("data-auto") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!panels.some((p) => `#${p.id}` === location.hash)) select(0);
    picker.classList.add("auto");
    const rail = tabs[0].parentElement;
    const pausedBy = { offscreen: true, mouse: false, keyboard: false };
    const pause = (why, on) => {
      pausedBy[why] = on;
      picker.classList.toggle("hold", Object.values(pausedBy).some(Boolean));
    };
    pause("offscreen", true);
    new IntersectionObserver(([e]) => pause("offscreen", !e.isIntersecting), { threshold: 0.5 }).observe(picker);
    // only the stage buttons pause it: the card is so wide that a resting mouse would stop it for good
    rail.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") pause("mouse", true); });
    rail.addEventListener("pointerleave", () => pause("mouse", false));
    rail.addEventListener("focusin", (e) => { if (e.target.matches(":focus-visible")) pause("keyboard", true); });
    rail.addEventListener("focusout", () => pause("keyboard", false));
    picker.addEventListener("animationend", (e) => {
      if (e.animationName !== "trk-fill") return;
      picker.style.removeProperty("--dwell");
      select((tabs.findIndex((t) => t.classList.contains("now")) + 1) % tabs.length);
    });
    // a stage the visitor chose stays up for longer before the tour carries on
    tabs.forEach((t) => t.addEventListener("click", () => {
      picker.style.setProperty("--dwell", "18s");
      t.classList.remove("now");
      void t.offsetWidth; // restart the bar, even when they clicked the stage already showing
      t.classList.add("now");
    }));
  });

  /* ---------- services: down payment slider ---------- */
  $$("[data-upfront]").forEach((tool) => {
    const input = $("input", tool);
    const bar = $(".up-bar", tool);
    const money = (v) => (v >= 1e6 ? `$${+(v / 1e6).toFixed(2)}M` : `$${Math.round(v / 1e3)}K`);
    const render = () => {
      const v = +input.value;
      $('[data-up="price"]', tool).textContent = money(v);
      $('[data-up="range"]', tool).textContent = `${money(v * 0.2)}–${money(v * 0.3)}`;
      bar.style.width = `${(v / +input.max) * 100}%`; // the full track is the slider's maximum, so the bar is to scale
    };
    input.addEventListener("input", render);
    render();
  });

  /* ---------- article: progress + toc ---------- */
  const bar = $(".progress i");
  const tocLinks = $$(".toc a");

  /* fact cards: 95% dot grid (100 dots) */
  $$("[data-dots]").forEach((g) => {
    const on = +g.dataset.dots;
    g.innerHTML = Array.from({ length: 100 }, (_, i) => `<i${i < on ? "" : ' class="off"'}></i>`).join("");
  });

  /* press strip: endless row that keeps moving, easing down to a slow drift on hover */
  $$("[data-marquee]").forEach((m) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const track = $(".press-track", m);
    const set = document.createElement("div");
    set.className = "press-set";
    set.append(...track.children);
    track.append(set);
    const unit = [...set.children];
    // repeat the outlets until one set is wider than the strip, then add a hidden twin for the seamless wrap
    while (set.offsetWidth < m.offsetWidth * 1.2) unit.forEach((it) => set.append(it.cloneNode(true)));
    const twin = set.cloneNode(true);
    twin.setAttribute("aria-hidden", "true");
    $$("a", twin).forEach((a) => (a.tabIndex = -1));
    track.append(twin);

    const BASE = 1.4, SLOW = 0.35; // px per frame at normal / hover speed
    let x = 0, speed = BASE, target = BASE, visible = true;
    m.addEventListener("pointerenter", () => (target = SLOW));
    m.addEventListener("pointerleave", () => (target = BASE));
    m.addEventListener("focusin", () => (target = SLOW));
    m.addEventListener("focusout", () => (target = BASE));
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(m);
    (function tick() {
      if (visible) {
        speed += (target - speed) * 0.05;
        x -= speed;
        const w = set.offsetWidth;
        if (-x >= w) x += w;
        track.style.transform = `translate3d(${x}px,0,0)`;
      }
      requestAnimationFrame(tick);
    })();
  });

  /* ---------- motion ---------- */
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = window.gsap && window.ScrollTrigger;

  // nav hide-on-scroll
  let lastY = 0;
  const onScroll = (y) => {
    if (navEl && !navEl.classList.contains("open")) navEl.classList.toggle("hide", y > lastY && y > 300);
    lastY = y;
    if (bar) {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    }
    if (tocLinks.length) {
      let cur = tocLinks[0];
      tocLinks.forEach((a) => { const t = $(a.getAttribute("href")); if (t && t.getBoundingClientRect().top < 160) cur = a; });
      tocLinks.forEach((a) => a.classList.toggle("on", a === cur));
    }
  };

  if (reduced || !hasGsap) {
    addEventListener("scroll", () => onScroll(scrollY), { passive: true });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("anim");

  addEventListener("scroll", () => onScroll(scrollY), { passive: true });

  // appear effect: short rise + fade, soft deceleration (no overshoot, no blur — blur repaints stutter)
  const APPEAR = { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" };

  $$("[data-split], [data-reveal]").forEach((el) => {
    gsap.to(el, {
      ...APPEAR, delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  // stagger groups
  $$("[data-stagger]").forEach((g) => {
    const kids = [...g.children];
    // CSS hover transitions on transform would fight GSAP's per-frame updates — pause them during the reveal
    gsap.set(kids, { opacity: 0, y: 24, transition: "none" });
    ScrollTrigger.batch(kids, {
      start: "top 92%", once: true,
      onEnter: (b) => gsap.to(b, { ...APPEAR, stagger: 0.1, onComplete: () => gsap.set(b, { clearProps: "all" }) }),
    });
  });

  // image parallax inside squircle frames
  $$("[data-parallax]").forEach((img) => {
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: "none",
      scrollTrigger: { trigger: img.closest(".media") || img, start: "top bottom", end: "bottom top", scrub: 1 },
    });
  });

  // about page photo card: grows to full width as you scroll (runhappy-style)
  const hero = $(".hero-media");
  if (hero) {
    // only the card's scale changes per frame (no inner parallax / backdrop blur) so it stays on the GPU
    gsap.fromTo(hero, { scale: 0.9 }, {
      scale: 1, ease: "none", force3D: true,
      scrollTrigger: { trigger: ".hero-stage", start: "top 85%", end: "top 15%", scrub: 0.4 },
    });
  }

  // homepage headline tiles settle in just after the headline
  if ($(".hero-tile")) {
    gsap.from(".hero-tile", { scale: 0.7, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.25 });
  }

  // pinned horizontal process
  const hs = $(".hscroll");
  if (hs) {
    const track = $(".hs-track", hs);
    const dist = () => Math.max(0, track.scrollWidth - hs.clientWidth);
    gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: hs, start: "top top", end: () => "+=" + dist(),
        pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: (s) => { const p = $(".hs-progress i", hs); if (p) p.style.transform = `scaleX(${s.progress})`; },
      },
    });
  }

  // fact cards: animate the small visuals in
  $$("[data-dots]").forEach((g) => {
    gsap.from(g.children, { scale: 0, duration: 0.5, ease: "power3.out", stagger: { each: 0.008, from: "start" }, scrollTrigger: { trigger: g, start: "top 90%", once: true } });
  });
  $$(".fact-years i").length && gsap.from(".fact-years i", { scaleY: 0, duration: 1, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: ".fact-years", start: "top 90%", once: true } });
  $$(".fact-seg i").length && gsap.from(".fact-seg i", { opacity: 0, y: 8, duration: 0.6, ease: "power3.out", stagger: 0.04, scrollTrigger: { trigger: ".fact-seg", start: "top 90%", once: true } });
  $$(".fact-ring .arc").forEach((a) => gsap.from(a, { strokeDasharray: "0 100", duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: a, start: "top 90%", once: true } }));

  // counters
  $$("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const dec = (el.dataset.count.split(".")[1] || "").length;
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 2, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => (el.textContent = o.v.toFixed(dec)),
    });
  });

  // case cards: slight scale-in (same treatment as the hero: no inner parallax / backdrop blur, GPU scale)
  $$(".case, .office").forEach((c) => {
    gsap.fromTo(c, { scale: 0.94 }, { scale: 1, ease: "none", force3D: true, scrollTrigger: { trigger: c, start: "top bottom", end: "top 40%", scrub: 0.4 } });
  });

  // flip cards: tap / Enter toggles (hover handles it on mouse devices)
  $$(".flip").forEach((f) => {
    const t = () => f.classList.toggle("on");
    f.addEventListener("click", () => { if (!matchMedia("(hover: hover)").matches) t(); });
    f.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); t(); } });
  });

  addEventListener("load", () => ScrollTrigger.refresh());
})();

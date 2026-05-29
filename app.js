const {
  useState,
  useEffect,
  useRef
} = React;
const QUIZ_QS = [{
  text: "How is your energy through the day?",
  opts: [{
    t: "Consistently good — alert and grounded",
    p: 0
  }, {
    t: "Afternoon slumps and occasional brain fog",
    p: 1
  }, {
    t: "Persistent fatigue that's hard to shake",
    p: 2
  }]
}, {
  text: "How does your skin, hair, and joints feel?",
  opts: [{
    t: "Supple, hydrated, and healthy",
    p: 0
  }, {
    t: "Sometimes dry, dull, or stiff",
    p: 1
  }, {
    t: "Often dry, brittle, or achy",
    p: 2
  }]
}, {
  text: "After drinking a glass of water, you feel…",
  opts: [{
    t: "Satisfied and refreshed",
    p: 0
  }, {
    t: "Still thirsty soon after",
    p: 1
  }, {
    t: "Water doesn't seem to help my thirst",
    p: 2
  }]
}, {
  text: "How is your digestion and regularity?",
  opts: [{
    t: "Regular, comfortable, no issues",
    p: 0
  }, {
    t: "Occasional sluggishness or bloating",
    p: 1
  }, {
    t: "Constipation or discomfort is common",
    p: 2
  }]
}, {
  text: "Unexplained headaches or afternoon food cravings?",
  opts: [{
    t: "Rarely or never",
    p: 0
  }, {
    t: "Sometimes — especially mid-afternoon",
    p: 1
  }, {
    t: "Frequently, without obvious cause",
    p: 2
  }]
}, {
  text: "What water do you mainly drink?",
  opts: [{
    t: "Filtered mineral-rich water or natural spring water",
    p: 0
  }, {
    t: "Tap water or standard bottled brands",
    p: 1
  }, {
    t: "Reverse osmosis, distilled, or I'm not sure",
    p: 2
  }]
}];
const QUIZ_RES = [{
  min: 0,
  max: 4,
  level: "Well-Hydrated",
  title: "Refine & Elevate",
  msg: "Your body is responding well. Now it's about elevation — explore water structuring, mineral balance, and the deeper intelligence of living water.",
  cta: "principles",
  ctaLabel: "Explore Principles"
}, {
  min: 5,
  max: 8,
  level: "Moderately Dehydrated",
  title: "Time to Upgrade",
  msg: "Your cells are asking for better water. These symptoms are real signals. Focus on mineral-rich, structured water and reduce the dehydrating agents in your environment.",
  cta: "swaps",
  ctaLabel: "See the Swaps"
}, {
  min: 9,
  max: 12,
  level: "Cellular Support Needed",
  title: "Your Cells Are Calling",
  msg: "These signs indicate your cellular hydration is compromised. A personalised consultation will identify the root cause and give you a clear, tailored path forward.",
  cta: "work",
  ctaLabel: "Work With Me"
}];
const PRINCIPLES_DATA = [{
  num: "01",
  title: "Why Hydration is the Foundation of Life",
  body: `<p>Water is not passive. It delivers nutrients to every cell, removes metabolic waste, and orchestrates thousands of physiological processes simultaneously. Even mild dehydration — as little as 2% of body weight — can measurably impair cognitive performance, reaction time, and mood.</p><p>But here is what most people miss: the human body is not made of plain water. It runs on <strong>electrolyte-rich fluids</strong> — complex solutions filled with minerals and trace elements. Flooding your body with pure H₂O can actually dilute these vital electrolytes, disrupting the very balance you are trying to restore.</p><p><strong>Salt is not your enemy — it is your bioelectrical conductor.</strong> Without minerals like sodium and potassium, electrical signals cannot travel through your body.</p><p>Signs your cells may be dehydrated:</p><div class="symp-grid"><div class="symp-item"><div class="symp-dot"></div><span>Dry skin, joints, or hair</span></div><div class="symp-item"><div class="symp-dot"></div><span>Constipation</span></div><div class="symp-item"><div class="symp-dot"></div><span>Frequent thirst water doesn't resolve</span></div><div class="symp-item"><div class="symp-dot"></div><span>Fatigue or feeling "ungrounded"</span></div><div class="symp-item"><div class="symp-dot"></div><span>Unexplained headaches</span></div><div class="symp-item"><div class="symp-dot"></div><span>Afternoon food cravings</span></div></div><p><strong>Action:</strong> Begin each morning with a glass of mineral-rich water and a small pinch of quality sea salt.</p>`,
  link: {
    label: "→ See trusted salt brands",
    page: "swaps",
    section: "salt"
  }
}, {
  num: "02",
  title: "Water as a Living Medium",
  body: `<p>Austrian naturalist <strong>Victor Schauberger</strong> described water as "the blood of the Earth" — a living substance that gains vitality as it flows naturally through the landscape. Modern science confirms that water's molecular structure changes with movement, temperature, pressure, and energetic input.</p><p>Water researcher <strong>Veda Austin</strong> has demonstrated what she calls <em>hydroglyphs</em> — repeatable crystalline ice patterns that emerge when the same energetic input is applied to water. Her conclusion: water is responsive, intelligent, and relational.</p><p><strong>Water remembers how it has been treated.</strong> Stagnant, over-processed water has a fundamentally different structural quality than water that has flowed freely through natural landscapes.</p><p><strong>Action:</strong> Stir or swirl your water before drinking. Bring gratitude to the exchange.</p>`,
  link: {
    label: "→ See structuring products",
    page: "swaps",
    section: "structuring"
  }
}, {
  num: "03",
  title: "The Key to Cellular Hydration",
  body: `<p>Water must actually make it <strong>inside your cells</strong>. Drinking more water does not automatically mean your cells are absorbing it.</p><p><strong>Hydration is electrical before it is mechanical.</strong> Your cells structure water — organising molecules to transport them from the extracellular space into the interior. This process is powered by the electrical voltage across your cell membranes and mitochondria.</p><p>Cell membranes are phospholipid bilayers that are semi-conductive. The quality of dietary fats you consume directly determines how well your membranes hold charge and facilitate water transport.</p><p><strong>Drink your food.</strong> Broths, porridges, raw vegetables, and lightly cooked eggs all contribute meaningfully to hydration in ways plain water cannot match.</p>`,
  link: {
    label: "→ See water sources",
    page: "swaps",
    section: "sources"
  }
}, {
  num: "04",
  title: "Water Structuring & Vitality",
  body: `<p>The <strong>fourth phase of water</strong> — also called structured, hexagonal, coherent, or biological water — is a plasma-like crystalline gel state. It is the form water takes inside living cells, and the form that hydrates most effectively.</p><p>Structured water forms naturally through movement (vortexing), sunlight exposure, contact with natural minerals, and low temperatures. It is degraded by stagnation, right-angle pipes, reverse osmosis, and electromagnetic pollution.</p><p><strong>At home:</strong> Swirl vigorously with a spoon before drinking. Store in glass or stainless steel. Add shungite or quartz crystals to your storage vessel. Hold your glass and bring a quiet intention before drinking.</p>`,
  link: {
    label: "→ See structuring products",
    page: "swaps",
    section: "structuring"
  }
}, {
  num: "05",
  title: "Dehydrating Agents & Your Environment",
  body: `<p>You can drink excellent water and still be chronically dehydrated if your environment is working against you.</p><div class="toxin-grid"><div class="toxin-item"><h4>Ultra-processed food</h4><p>Low moisture, high in synthetic additives that increase cellular water demand.</p></div><div class="toxin-item"><h4>EMF exposure</h4><p>Disrupts cellular voltage and impairs membrane function.</p></div><div class="toxin-item"><h4>Sleep deprivation</h4><p>Interrupts the body's overnight repair and hydration cycles.</p></div><div class="toxin-item"><h4>Fluoride &amp; Chlorine</h4><p>Chlorine disrupts gut microbiome. Fluoride has documented thyroid impacts.</p></div><div class="toxin-item"><h4>Heavy metals &amp; PFAS</h4><p>Accumulate in tissue over time, requiring robust cellular hydration to process.</p></div><div class="toxin-item"><h4>Microplastics</h4><p>Found in water, food, and air. Chemical additives within them are often more harmful than the plastic itself.</p></div></div><p><strong>What you send down the drain matters.</strong> Bleach, ammonia, and synthetic cleaners are not fully broken down in treatment. Vinegar, baking soda, citric acid, and simple soap are effective alternatives.</p>`,
  link: {
    label: "→ See filtration guide",
    page: "swaps",
    section: "filtration"
  }
}];
const PRICE_TOOLTIPS = {
  '€': 'Under €100',
  '€€': 'Under €700',
  '€€€': 'Under €1,500',
  '€€€€': 'Above €1,500',
  '€–€€': '€100–€700 range',
  '€€€–€€€€': '€1,500+ range'
};
const WATER_SOURCES = [{
  rank: "1",
  name: "Natural Spring Water",
  desc: "Sourced from deep underground aquifers, filtered naturally by soil and rock. Balanced mineral profile, natural structure, clean energetic imprint.",
  badge: "b-best",
  label: "Excellent"
}, {
  rank: "2",
  name: "Deep Well or Underground Water",
  desc: "In rural areas, it is rich in natural minerals and untouched by surface pollutants. Regular testing is essential, especially in agricultural zones.",
  badge: "b-good",
  label: "Regional"
}, {
  rank: "3",
  name: "Quality Tap Water",
  desc: "In Switzerland, Austria and Scandinavia, tap water is often safe with basic filtration. The opposite is true in most of the world.",
  badge: "b-caution",
  label: "Upgrade"
}, {
  rank: "4",
  name: "Filtered Tap Water",
  desc: "Carbon, gravity, or multi-stage filtration greatly improves tap water. Removes chlorine and many contaminants. A good baseline for most households.",
  badge: "b-best",
  label: "Ideal"
}, {
  rank: "5",
  name: "Reverse Osmosis & Distilled",
  desc: "Removes virtually everything — contaminants and minerals alike. Results in 'empty' water that can leach electrolytes if consumed long-term. Always remineralise.",
  badge: "b-caution",
  label: "Remineralise"
}, {
  rank: "6",
  name: "Rainwater",
  desc: "Can be pure in remote clean-air environments. In urban areas, often contains acidic compounds and air pollutants. Must be filtered and tested if used for drinking.",
  badge: "b-avoid",
  label: "Situational"
}];
const SALT_DATA = {
  europe: ["Rapunzel Meersalz", "Saltverk Icelandic Salt", "Vera Salt", "Mediterra Mediterranean Sea Salt", "Mayi Spring Salt"],
  australia: ["Lake Deborah Salt", "Tasman Sea Salt", "Murray River Salt"],
  usa: ["Jacobsen Salt Co. Sea Salt", "Diamond Crystal Kosher Salt", "Vancouver Island Sea Salt", "Mayi Delice Fine Natural Spring Salt", "Only Plastic-Free Spring Salt"]
};
const TRUSTED_WATER = [{
  region: "USA",
  brands: "Splendor Water, Mountain Valley, Castle Rock, Gerolsteiner, Icelandic Glacial, Blue Spring Living, Three Bays Still Water"
}, {
  region: "Europe",
  brands: "Hallstein Water, Acqua Filette, Llanllyr Source, Borjomi, Gerolsteiner, Lofoten Arctic, Vincentka, Tatranská Minerálka"
}, {
  region: "Australia",
  brands: "Cape Grim, Pristine Yarra Valley, Daylesford & Hepburn Mineral Springs"
}];
const QUESTION_WATER = [{
  region: "USA",
  brands: "Fiji, Nestlé Pure Life, Dasani, Aquafina, Crystal Geyser, Arrowhead, Deer Park, San Pellegrino, 365 Sparkling Water",
  issues: "Toxins, tap reprocessing, heavy metals"
}, {
  region: "Europe",
  brands: "Evian, Contrex, Volvic, Vittel, Highland Spring, Perrier, San Pellegrino, Jana, Solan de Cabras, Vichy Catalan",
  issues: "Plastic leaching, microplastics, heavy metals"
}, {
  region: "Australia",
  brands: "Mount Franklin, Frantelle, Pump Spring Water",
  issues: "Plastic leaching"
}];
const FILTRATION_TYPES = [{
  name: "Reverse Osmosis",
  desc: "Removes most contaminants including heavy metals and fluoride. Always remineralise after."
}, {
  name: "Carbon Block",
  desc: "Removes chlorine, VOCs, and organic chemicals effectively. Good everyday workhorse."
}, {
  name: "Ceramic",
  desc: "Physically blocks bacteria and sediment. Long-lasting and low-maintenance."
}, {
  name: "Charcoal / Shungite",
  desc: "Reduces chemicals and adds beneficial minerals back. Great for basic enhancement."
}, {
  name: "UV Light",
  desc: "Kills bacteria and viruses without chemicals, but does not remove heavy metals."
}, {
  name: "Ozone",
  desc: "Ozone molecules eliminate contaminants on contact. Often used therapeutically or in pools."
}, {
  name: "Multi-stage Systems",
  desc: "Combination of the above. Best practice for broad-spectrum protection."
}];
const HOME_FILTERS = [{
  name: "Leogant Spring System",
  tech: "Activated carbon, EM ceramics, vortex module",
  best: "High-end undersink with vitalization",
  avail: "Germany, Austria, EU",
  url: "https://leogant.com",
  price: "€€€–€€€€"
}, {
  name: "Atla Water System",
  note: "formerly AquaLiv",
  tech: "Multi-stage filtration, mineralisation, structured vortexing",
  best: "Bioavailable mineral-rich water",
  avail: "USA, Canada, international",
  url: "https://atlawater.com",
  price: "€€"
}, {
  name: "Aquasana Rhino Max Flow",
  tech: "Carbon/KDF filtration, optional UV, salt-free softener",
  best: "Whole-house chemical & heavy metal filtration",
  avail: "USA, Canada",
  url: "https://www.aquasana.com/whole-house-water-filters/rhino-max-flow-100362408.html",
  price: "€€€€"
}, {
  name: "Stabfor S-SAT Home Filter",
  tech: "Ceramic, carbon, structured vortex module (no RO)",
  best: "Point-of-entry with energising effect",
  avail: "Central Europe",
  url: "https://eshop.newhumansolution.com/sk/produkty-stabfor-stabfor-s-sat-domaci-filter-1-s-vlozkou-5-10mcr/",
  price: "€€€€"
}];
const PORTABLE_FILTERS = [{
  name: "Survivor Filter PRO",
  tech: "Pre-filter, carbon, ultrafiltration",
  best: "Hiking, camping, emergencies",
  avail: "USA, Canada, Mexico, Europe",
  url: "https://www.survivorfilter.com/collections/all",
  price: "€"
}, {
  name: "Epic Vostok Stainless Bottle",
  tech: "Activated carbon + UF",
  best: "Travel, everyday use, insulated",
  avail: "USA, Canada, Australia, Europe",
  url: "https://epicwaterfilters.com.au/products/epic-vostok-double-walled-vacuum-insulated-stainless-steel-34-oz-filtered-filter-water-bottle",
  price: "€"
}, {
  name: "GRAYL UltraPress",
  tech: "Electroadsorption + activated carbon",
  best: "International travel, trekking",
  avail: "USA, Canada, Europe, Russia",
  url: "https://grayl.com/collections/featured-collection",
  price: "€–€€"
}, {
  name: "Aurmina",
  tech: "Flocculation, agglutination, coagulation",
  best: "Everyday use, travel",
  avail: "USA, ships worldwide by request",
  url: "https://www.aurmina.com",
  price: "€€"
}];
const STRUCT_PRODUCTS = [{
  name: "Alive Water Vortex Revitalizer",
  desc: "Double spiral vortex mimics natural streams to enhance structure and pH.",
  avail: "Canada, US",
  url: "https://www.alivewater.ca",
  price: "€€"
}, {
  name: "Analemma Coherent Water",
  desc: "Uses light and frequency to structure water for enhanced bioavailability.",
  avail: "US, Canada, Europe, Russia, AU",
  url: "https://eu.analemma-water.com/?country=SK",
  price: "€€"
}, {
  name: "Flaska TPS Water Bottle",
  desc: "Silica imprinting mimics spring water's vibrational memory.",
  avail: "Europe, US, Canada, Russia",
  url: "https://flaska.ie/catalog",
  price: "€"
}, {
  name: "Vortex Magnet Energizer (VME)",
  desc: "Vortex motion combined with reversed magnetic fields.",
  avail: "US, Canada, Europe",
  url: "https://vibrantvitalwater.com/products/",
  price: "€€"
}, {
  name: "3DModelShop Schauberger Devices",
  desc: "3D-printed vortex generators replicating Schauberger's spiral designs.",
  avail: "Worldwide",
  url: "https://pedros3dmodels.myshopify.com/collections/viktor-schauberger",
  price: "€"
}, {
  name: "Aurmina Mineral Solution",
  desc: "Volcanic minerals promote more organised molecular structure in water.",
  avail: "US, ships worldwide",
  url: "https://www.aurmina.com",
  price: "€€"
}];
function useReveal() {
  useEffect(() => {
    const t = setTimeout(() => {
      const els = document.querySelectorAll('.reveal:not(.vis)');
      if (!els.length) return;
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('vis');
            obs.unobserve(e.target);
          }
        });
      }, {
        threshold: 0.1
      });
      els.forEach(el => obs.observe(el));
      return () => obs.disconnect();
    }, 100);
    return () => clearTimeout(t);
  });
}
function PriceTier({
  price
}) {
  const tip = PRICE_TOOLTIPS[price] || price;
  if (price.includes('–')) return React.createElement("span", {
    title: tip,
    style: {
      fontFamily: 'var(--ff-ui)',
      fontSize: '0.741rem',
      fontWeight: 700,
      color: 'var(--rose-gold)',
      letterSpacing: '.04em',
      cursor: 'help'
    }
  }, price);
  const n = price.length;
  return React.createElement("span", {
    title: tip,
    style: {
      fontFamily: 'var(--ff-ui)',
      fontSize: '0.741rem',
      fontWeight: 700,
      letterSpacing: '.04em',
      cursor: 'help'
    }
  }, React.createElement("span", {
    style: {
      color: 'var(--rose-gold)'
    }
  }, '€'.repeat(n)), React.createElement("span", {
    style: {
      color: 'rgba(196,146,156,.18)'
    }
  }, '€'.repeat(4 - n)));
}
function PriceLegend() {
  return React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      flexWrap: 'wrap',
      padding: '.65rem 1rem',
      background: 'rgba(150,45,73,.06)',
      border: '1px solid rgba(150,45,73,.18)',
      borderRadius: 3,
      margin: '1.5rem 0 0'
    }
  }, React.createElement("span", {
    style: {
      fontFamily: 'var(--ff-ui)',
      fontSize: '0.551rem',
      fontWeight: 600,
      letterSpacing: '.15em',
      textTransform: 'uppercase',
      color: 'var(--text-soft)'
    }
  }, "Price guide"), Object.entries(PRICE_TOOLTIPS).filter(([k]) => !k.includes('–')).map(([t, l]) => React.createElement("span", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '.4rem'
    }
  }, React.createElement(PriceTier, {
    price: t
  }), React.createElement("span", {
    style: {
      fontFamily: 'var(--ff-ui)',
      fontSize: '0.57rem',
      color: 'var(--text-soft)'
    }
  }, l))));
}
function WaveSVG({
  cls
}) {
  return React.createElement("svg", {
    className: cls,
    viewBox: "0 0 1440 120",
    xmlns: "http://www.w3.org/2000/svg",
    preserveAspectRatio: "none",
    style: {
      height: 120
    }
  }, React.createElement("path", {
    d: "M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z",
    fill: "rgba(45,122,150,1)"
  }));
}
const SOCIALS = [{
  name: 'Instagram',
  handle: '@discern.like.a.rebel',
  url: 'https://www.instagram.com/discern.like.a.rebel/',
  icon: React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, React.createElement("path", {
    d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
  }))
}, {
  name: 'YouTube',
  handle: '@discernlikearebel',
  url: 'https://www.youtube.com/@discernlikearebel',
  icon: React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, React.createElement("path", {
    d: "M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"
  }))
}];
function SocialLinks({
  style = 'bar'
}) {
  if (style === 'bar') return React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '.85rem'
    }
  }, SOCIALS.map(s => React.createElement("a", {
    key: s.name,
    href: s.url,
    target: "_blank",
    rel: "noopener noreferrer",
    title: `${s.name} ${s.handle}`,
    style: {
      color: 'rgba(255,255,255,.65)',
      display: 'flex',
      alignItems: 'center',
      transition: 'color .2s'
    },
    onMouseEnter: e => e.currentTarget.style.color = '#fff',
    onMouseLeave: e => e.currentTarget.style.color = 'rgba(255,255,255,.65)'
  }, s.icon)));
  if (style === 'footer') return React.createElement("div", {
    style: {
      display: 'flex',
      gap: '1.25rem',
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, SOCIALS.map(s => React.createElement("a", {
    key: s.name,
    href: s.url,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '.45rem',
      fontFamily: 'var(--ff-ui)',
      fontSize: '0.57rem',
      fontWeight: 600,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--text-soft)',
      textDecoration: 'none',
      transition: 'color .2s'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--rose-gold)',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--text-soft)'
  }, s.icon, React.createElement("span", null, s.handle))));
  if (style === 'block') return React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '.75rem'
    }
  }, SOCIALS.map(s => React.createElement("a", {
    key: s.name,
    href: s.url,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '.9rem',
      padding: '.9rem 1.25rem',
      background: 'rgba(150,45,73,.06)',
      border: '1px solid var(--border)',
      borderRadius: 4,
      textDecoration: 'none',
      transition: 'all .2s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'rgba(150,45,73,.12)';
      e.currentTarget.style.borderColor = 'rgba(150,45,73,.38)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'rgba(150,45,73,.06)';
      e.currentTarget.style.borderColor = 'rgba(150,45,73,.2)';
    }
  }, React.createElement("span", {
    style: {
      color: 'var(--rose-gold)'
    }
  }, s.icon), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: 'var(--ff-ui)',
      fontSize: '0.532rem',
      fontWeight: 700,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--text-soft)',
      marginBottom: '.15rem'
    }
  }, s.name), React.createElement("div", {
    style: {
      fontFamily: 'var(--ff-body)',
      fontSize: '1.045rem',
      color: 'var(--text-dim)'
    }
  }, s.handle)))));
  return null;
}
function BrandBar() {
  return React.createElement("div", {
    className: "brand-bar"
  }, React.createElement("span", {
    className: "brand-bar__name"
  }, "Discern Like A Rebel"), React.createElement("span", {
    className: "brand-bar__tag"
  }, "Smashing The Toxins Out Of The Way"), React.createElement(SocialLinks, {
    style: "bar"
  }));
}
function Nav({
  page,
  navigate
}) {
  const [mob, setMob] = useState(false);
  const [wOpen, setWOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => {
      if (ref.current && !ref.current.contains(e.target)) setWOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const isW = ['principles', 'swaps'].includes(page);
  return React.createElement("nav", {
    className: "nav"
  }, React.createElement("div", {
    className: "nav__inner"
  }, React.createElement("div", {
    className: "nav__logo",
    onClick: () => {
      navigate('home');
      setMob(false);
    }
  }, React.createElement("span", {
    className: "nav__logo-sub"
  }, "Discern Like A Rebel"), React.createElement("span", {
    className: "nav__logo-title"
  }, "Living Water")), React.createElement("ul", {
    className: "nav__links"
  }, React.createElement("li", {
    ref: ref,
    className: "dropdown"
  }, React.createElement("button", {
    className: `dropdown__btn ${isW ? 'on' : ''}`,
    onClick: () => setWOpen(!wOpen)
  }, "Water ", React.createElement("span", {
    className: `dropdown__chev ${wOpen ? 'open' : ''}`
  }, "\u25BE")), React.createElement("div", {
    className: `dropdown__menu ${wOpen ? 'open' : ''}`
  }, React.createElement("button", {
    className: "dropdown__item",
    onClick: () => {
      navigate('principles');
      setWOpen(false);
    }
  }, "Principles"), React.createElement("button", {
    className: "dropdown__item dropdown__item--rebel",
    onClick: () => {
      navigate('swaps');
      setWOpen(false);
    }
  }, "Swaps \u2192"))), React.createElement("li", null, React.createElement("button", {
    className: `nav__link ${page === 'about' ? 'on' : ''}`,
    onClick: () => navigate('about')
  }, "About")), React.createElement("li", null, React.createElement("button", {
    className: `nav__link ${page === 'contact' ? 'on' : ''}`,
    onClick: () => navigate('contact')
  }, "Contact")), React.createElement("li", null, React.createElement("button", {
    className: `nav__link ${page === 'work' ? 'on' : ''}`,
    onClick: () => navigate('work')
  }, "Work With Me")), React.createElement("li", null, React.createElement("button", {
    className: "nav__cta",
    onClick: () => navigate('swaps')
  }, "Swaps \u2192"))), React.createElement("button", {
    className: "hamburger",
    onClick: () => setMob(!mob)
  }, React.createElement("span", null), React.createElement("span", null), React.createElement("span", null))), React.createElement("div", {
    className: `mob-nav ${mob ? 'open' : ''}`
  }, [{
    id: 'home',
    l: 'Home'
  }, {
    id: 'principles',
    l: 'Water — Principles'
  }, {
    id: 'swaps',
    l: 'Water — Swaps',
    r: true
  }, {
    id: 'about',
    l: 'About'
  }, {
    id: 'work',
    l: 'Work With Me'
  }, {
    id: 'contact',
    l: 'Contact'
  }].map(item => React.createElement("button", {
    key: item.id,
    className: `mob-link ${page === item.id ? 'on' : ''} ${item.r ? 'mob-link--rebel' : ''}`,
    onClick: () => {
      navigate(item.id);
      setMob(false);
    }
  }, item.l))));
}
function FloatingSwapsBtn({
  navigate
}) {
  return React.createElement("button", {
    className: "float-swaps",
    onClick: () => navigate('swaps')
  }, "Swaps \u2192");
}
function Ticker() {
  const items = ['Water', 'Supplements', 'Home & Environment', 'Clothing', 'Food & Nutrition', 'Personal Care', 'Sleep', 'Movement'];
  const all = [...items, ...items];
  return React.createElement("div", {
    className: "ticker-wrap"
  }, React.createElement("div", {
    className: "ticker-inner"
  }, all.map((item, i) => React.createElement("span", {
    key: i,
    className: "ticker-item"
  }, item, " ", React.createElement("span", {
    className: "ticker-sep"
  }, "\xD7")))));
}
function HomePage({
  navigate
}) {
  useReveal();
  useEffect(() => {
    const timer = setTimeout(() => {
      const section = document.querySelector('.method-section');
      if (!section) return;
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            document.querySelectorAll('.unruly-hole').forEach(h => h.classList.add('fired'));
            obs.disconnect();
          }
        });
      }, {
        threshold: 0.15
      });
      obs.observe(section);
      return () => obs.disconnect();
    }, 150);
    return () => clearTimeout(timer);
  }, []);
  return React.createElement("div", {
    className: "page-in"
  }, React.createElement("section", {
    className: "brand-hero"
  }, React.createElement("div", {
    className: "brand-hero__bg"
  }), React.createElement("div", {
    className: "container",
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, React.createElement("span", {
    className: "label label--rebel a1",
    style: {
      display: 'block',
      marginBottom: '1.5rem'
    }
  }, "Discern Like A Rebel"), React.createElement("span", {
    className: "brand-hero__title a1"
  }, "DISCERN"), React.createElement("span", {
    className: "brand-hero__title brand-hero__title--italic a2"
  }, "like a"), React.createElement("span", {
    className: "brand-hero__title brand-hero__title--red a3"
  }, "REBEL"), React.createElement("span", {
    className: "brand-hero__tag a4"
  }, "Smashing The ", React.createElement("span", {
    className: "smash-word"
  }, "Toxins", React.createElement("span", {
    className: "smash-strike"
  })), " Out Of The Way.", React.createElement("br", null), "Ruthlessly curated education and swaps \u2014 across water, supplements, home, and beyond."), React.createElement("div", {
    className: "a4",
    style: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
      marginTop: '2.5rem'
    }
  }, React.createElement("button", {
    className: "btn btn-rebel",
    onClick: () => navigate('swaps')
  }, "Explore Swaps \u2192"), React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => navigate('principles')
  }, "Read the Guide"))), React.createElement("div", {
    className: "hero-scroll"
  }, React.createElement("div", {
    className: "scroll-line"
  }))), React.createElement(Ticker, null), React.createElement("div", {
    className: "method-section"
  }, React.createElement("div", {
    className: "unruly-hole-wrap",
    style: {
      width: '180px',
      top: '-55px',
      right: '-45px',
      transform: 'rotate(13deg)'
    }
  }, React.createElement("img", {
    className: "unruly-hole",
    src: "assets/unruly-hole.png",
    style: {
      '--hole-opacity': 0.3,
      width: '100%',
      animationDelay: '0.00s'
    },
    alt: ""
  })), React.createElement("div", {
    className: "unruly-hole-wrap",
    style: {
      width: '215px',
      top: '70px',
      left: '9%',
      transform: 'rotate(-9deg)'
    }
  }, React.createElement("img", {
    className: "unruly-hole",
    src: "assets/unruly-hole.png",
    style: {
      '--hole-opacity': 0.28,
      width: '100%',
      animationDelay: '0.12s'
    },
    alt: ""
  })), React.createElement("div", {
    className: "unruly-hole-wrap",
    style: {
      width: '165px',
      top: '38%',
      left: '-50px',
      transform: 'rotate(5deg)'
    }
  }, React.createElement("img", {
    className: "unruly-hole",
    src: "assets/unruly-hole.png",
    style: {
      '--hole-opacity': 0.27,
      width: '100%',
      animationDelay: '0.22s'
    },
    alt: ""
  })), React.createElement("div", {
    className: "unruly-hole-wrap",
    style: {
      width: '195px',
      top: '30%',
      right: '7%',
      transform: 'rotate(-15deg)'
    }
  }, React.createElement("img", {
    className: "unruly-hole",
    src: "assets/unruly-hole.png",
    style: {
      '--hole-opacity': 0.26,
      width: '100%',
      animationDelay: '0.08s'
    },
    alt: ""
  })), React.createElement("div", {
    className: "unruly-hole-wrap",
    style: {
      width: '295px',
      bottom: '25px',
      left: '27%',
      transform: 'rotate(21deg)'
    }
  }, React.createElement("img", {
    className: "unruly-hole",
    src: "assets/unruly-hole.png",
    style: {
      '--hole-opacity': 0.29,
      width: '100%',
      animationDelay: '0.30s'
    },
    alt: ""
  })), React.createElement("div", {
    className: "unruly-hole-wrap",
    style: {
      width: '205px',
      bottom: '-35px',
      right: '13%',
      transform: 'rotate(-6deg)'
    }
  }, React.createElement("img", {
    className: "unruly-hole",
    src: "assets/unruly-hole.png",
    style: {
      '--hole-opacity': 0.25,
      width: '100%',
      animationDelay: '0.17s'
    },
    alt: ""
  })), React.createElement("div", {
    className: "container",
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, React.createElement("div", {
    className: "reveal",
    style: {
      marginBottom: '3.5rem'
    }
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '.75rem'
    }
  }, "THE UNRULY WAY"), React.createElement("h2", {
    style: {
      fontSize: 'clamp(1.71rem,3.325vw,2.66rem)',
      color: 'var(--cream)',
      marginBottom: '.75rem'
    }
  }, "This isn't a method."), React.createElement("p", {
    style: {
      fontFamily: 'var(--ff-body)',
      fontSize: 'clamp(0.95rem,1.9vw,1.14rem)',
      fontStyle: 'italic',
      color: 'var(--text-dim)',
      lineHeight: 1.65
    }
  }, "It's a middle finger to toxins, served with a cup of bone broth and zero apology.")), React.createElement("div", {
    className: "reveal d1"
  }, React.createElement("div", {
    className: "unruly-row"
  }, React.createElement("div", {
    className: "unruly-item"
  }, React.createElement("div", {
    className: "unruly-num"
  }, "01"), React.createElement("div", {
    className: "unruly-verb"
  }, "Food is medicine."), React.createElement("p", {
    className: "unruly-desc"
  }, "I eat fermented everything. Grass-fed protein. Weeds from the meadow. I know the farmers by name. My wallet votes like a wrecking ball.")), React.createElement("div", {
    className: "unruly-item"
  }, React.createElement("div", {
    className: "unruly-num"
  }, "02"), React.createElement("div", {
    className: "unruly-verb unruly-verb--rebel"
  }, "Nature is the first pharmacy."), React.createElement("p", {
    className: "unruly-desc"
  }, "Sunlight. Grounding. Living water. Circadian and seasonal rhythms \u2014 not as a trend, but as a rebellion against the fake-lit, fake-fed world.")), React.createElement("div", {
    className: "unruly-item"
  }, React.createElement("div", {
    className: "unruly-num"
  }, "03"), React.createElement("div", {
    className: "unruly-verb"
  }, "One ingredient is enough."), React.createElement("p", {
    className: "unruly-desc"
  }, "Seed oils? Trans fats? Refined sugar, Frankenfoods, plastics, petrochemicals? Zero tolerance. One swap at a time. No rush. No mercy.")), React.createElement("div", {
    className: "unruly-item"
  }, React.createElement("div", {
    className: "unruly-num"
  }, "04"), React.createElement("div", {
    className: "unruly-verb unruly-verb--rebel"
  }, "Soil health = human health."), React.createElement("p", {
    className: "unruly-desc"
  }, "No healthy food without healthy soil. Regenerative agriculture isn't a buzzword. It's my line in the sand."))), React.createElement("div", {
    className: "unruly-row"
  }, React.createElement("div", {
    className: "unruly-item"
  }, React.createElement("div", {
    className: "unruly-num"
  }, "05"), React.createElement("div", {
    className: "unruly-verb"
  }, "I listen to my body without shame."), React.createElement("p", {
    className: "unruly-desc"
  }, "Yes, I'm that annoyingly picky friend. I bring my own salt to restaurants and raw milk to caf\xE9s. I used to apologize. I don't anymore.")), React.createElement("div", {
    className: "unruly-item"
  }, React.createElement("div", {
    className: "unruly-num"
  }, "06"), React.createElement("div", {
    className: "unruly-verb unruly-verb--rebel"
  }, "I detox gently. Then I go deeper."), React.createElement("p", {
    className: "unruly-desc"
  }, "Bone broths, bitter herbs, then concentrated extracts. Soft first. Then fierce.")), React.createElement("div", {
    className: "unruly-item"
  }, React.createElement("div", {
    className: "unruly-num"
  }, "07"), React.createElement("div", {
    className: "unruly-verb"
  }, "Conscious resilience."), React.createElement("p", {
    className: "unruly-desc"
  }, "Stress and fear are toxins too. If I fail today? I still pat myself on the back. I'm not afraid of what I know. I'm armed with it.")), React.createElement("div", {
    className: "unruly-item"
  }, React.createElement("div", {
    className: "unruly-num"
  }, "08"), React.createElement("div", {
    className: "unruly-verb unruly-verb--rebel"
  }, "The body is infinite possibility."), React.createElement("p", {
    className: "unruly-desc"
  }, "Trampolines. Crushed bones for toothpaste. Resin chewing. Aluminum foil at night. Chakras. Yes, even the really woo stuff. Nothing is too much when you love your body like a rebel loves her cause.")))))), React.createElement("section", {
    className: "topics-section"
  }, React.createElement("div", {
    className: "container"
  }, React.createElement("div", {
    className: "reveal"
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '.75rem'
    }
  }, "Topics"), React.createElement("h2", {
    style: {
      fontSize: 'clamp(1.9rem,3.8vw,3.04rem)',
      color: 'var(--cream)',
      marginBottom: '.5rem'
    }
  }, "Choose your area"), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      fontStyle: 'italic',
      fontSize: '1.1115rem'
    }
  }, "Each topic is independently researched, tested, and swapped. Water is live now.")), React.createElement("div", {
    className: "topic-grid"
  }, React.createElement("div", {
    className: "topic-card topic-card--water reveal d1",
    onClick: () => navigate('swaps')
  }, React.createElement("div", null, React.createElement("span", {
    className: "topic-badge badge-live"
  }, "\u25CF Live Now"), React.createElement("div", {
    className: "topic-title"
  }, "Living Water"), React.createElement("p", {
    className: "topic-desc"
  }, "From cellular hydration and water structuring to the best sources, filtration systems, and salt brands \u2014 backed by science and lived experience.")), React.createElement("div", {
    className: "topic-actions"
  }, React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: e => {
      e.stopPropagation();
      navigate('principles');
    }
  }, "Principles"), React.createElement("button", {
    className: "btn btn-rebel btn-sm",
    onClick: e => {
      e.stopPropagation();
      navigate('swaps');
    }
  }, "Swaps \u2192"))), [{
    title: 'Supplements',
    sub: 'What actually works — and what to throw out.'
  }, {
    title: 'Home & Environment',
    sub: 'Air, EMF, cleaning products, and your living space.'
  }, {
    title: 'Clothing',
    sub: 'Fabrics, dyes, and what you wear next to your skin.'
  }].map((t, i) => React.createElement("div", {
    key: t.title,
    className: `topic-card topic-card--soon reveal d${i + 2}`
  }, React.createElement("span", {
    className: "topic-badge badge-soon"
  }, "Coming Soon"), React.createElement("div", {
    className: "topic-soon-title"
  }, t.title), React.createElement("div", {
    className: "topic-soon-sub"
  }, t.sub)))))), React.createElement("section", {
    className: "about-teaser"
  }, React.createElement("div", {
    className: "container"
  }, React.createElement("div", {
    className: "about-teaser-grid"
  }, React.createElement("div", {
    className: "reveal"
  }, React.createElement("div", {
    className: "about-photo-sm"
  }, React.createElement("img", {
    src: "natalie.jpg",
    alt: "Natalie \u2014 Discern Like A Rebel"
  }))), React.createElement("div", {
    className: "reveal d2"
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '1rem'
    }
  }, "The Person Behind It"), React.createElement("h2", {
    style: {
      fontSize: 'clamp(1.9rem,3.8vw,2.85rem)',
      color: 'var(--cream)',
      marginBottom: '1.25rem'
    }
  }, "Natalie"), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      fontSize: '1.1115rem',
      fontStyle: 'italic',
      lineHeight: 1.8,
      marginBottom: '1rem'
    }
  }, "Environmental scientist. Holistic practitioner. Someone who tested everything on herself before recommending it to anyone else."), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      lineHeight: 1.85,
      marginBottom: '2rem',
      fontSize: '1.1115rem'
    }
  }, "I studied environmental sciences at the University of Vienna, spent years in the lab, then had health challenges that sent me on a different kind of research journey. Today I combine laboratory precision with lived experience \u2014 and a healthy disrespect for anything that doesn't hold up to scrutiny."), React.createElement("div", {
    style: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap'
    }
  }, React.createElement("button", {
    className: "btn btn-gold",
    onClick: () => navigate('about')
  }, "My Story"), React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => navigate('work')
  }, "Work With Me")))))));
}
function AboutPage({
  navigate
}) {
  useReveal();
  return React.createElement("div", {
    className: "page-in"
  }, React.createElement("div", {
    className: "page-hero page-hero--water"
  }, React.createElement("div", {
    className: "container",
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '1rem'
    }
  }, "About"), React.createElement("h1", {
    style: {
      fontSize: 'clamp(2.85rem,7.6vw,6.175rem)',
      color: 'var(--cream)'
    }
  }, React.createElement("em", {
    style: {
      color: 'var(--foam)'
    }
  }, "Meet"), React.createElement("br", null), "Natalie"))), React.createElement("section", {
    style: {
      background: 'linear-gradient(180deg,#0a2230 0%,var(--near-black) 100%)'
    }
  }, React.createElement("div", {
    className: "container"
  }, React.createElement("div", {
    className: "about-grid"
  }, React.createElement("div", {
    className: "about-sticky reveal"
  }, React.createElement("div", {
    className: "photo-frame"
  }, React.createElement("img", {
    src: "natalie.jpg",
    alt: "Natalie \u2014 Discern Like A Rebel"
  })), React.createElement("div", {
    className: "photo-cap"
  }, "Natalie \xB7 Discern Like A Rebel")), React.createElement("div", null, React.createElement("div", {
    className: "reveal d1"
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '1rem'
    }
  }, "My Journey"), React.createElement("h2", {
    style: {
      fontSize: 'clamp(1.71rem,3.325vw,2.66rem)',
      color: 'var(--cream)',
      marginBottom: '1.5rem'
    }
  }, "From scientific curiosity to holistic mastery")), React.createElement("div", {
    className: "reveal d2"
  }, React.createElement("p", {
    style: {
      fontSize: '1.1115rem',
      fontStyle: 'italic',
      color: 'var(--mist)',
      lineHeight: 1.8,
      marginBottom: '1.5rem'
    }
  }, "\"I first learnt about water while studying environmental sciences at the University of Vienna. After graduating, water chemistry drifted into the background \u2014 until quite challenging health issues brought it to the forefront of my life.\""), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      lineHeight: 1.85,
      marginBottom: '1.25rem'
    }
  }, "That wake-up call set me on a journey. I looked into alternative water sources, learnt from holistic practitioners, and experimented with various methods \u2014 spending freely on equipment and protocols and using myself as a test subject. My confidence grew gradually, both in the science and in how to genuinely use this knowledge in daily life."), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      lineHeight: 1.85,
      marginBottom: '1.25rem'
    }
  }, "Programming the remediation of uranium-contaminated aquifers in the lab was not my calling \u2014 but I'm genuinely grateful for the technical skills it gave me. They are now part of my toolkit for achieving real, effective results."), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      lineHeight: 1.85,
      marginBottom: '2rem'
    }
  }, "Today, by weaving together holistic wisdom, solid scientific research, and hands-on experience, I've crafted a genuinely practical and personal approach to hydration that I love sharing with others.")), React.createElement("div", {
    className: "divider reveal"
  }, React.createElement("div", {
    className: "div-line"
  }), React.createElement("div", {
    className: "div-mark"
  }, "\u2726"), React.createElement("div", {
    className: "div-line"
  })), React.createElement("div", {
    className: "reveal d1"
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '1rem'
    }
  }, "Discern Like A Rebel"), React.createElement("h3", {
    style: {
      fontSize: 'clamp(1.425rem,2.85vw,2.09rem)',
      color: 'var(--cream)',
      marginBottom: '1rem'
    }
  }, "Smashing the toxins out of the way"), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      lineHeight: 1.85,
      marginBottom: '1.5rem',
      fontStyle: 'italic',
      fontSize: '1.1115rem'
    }
  }, "Discerning like a rebel means choosing to question the mainstream, look past the surface, and make decisions from a place of genuine knowledge and deep self-trust. If it doesn't pass the test \u2014 it's out. No compromise."), React.createElement("div", {
    className: "values-grid"
  }, [{
    title: 'Rooted in Science',
    text: 'Environmental science background. Lab experience. Real methodology.'
  }, {
    title: 'Lived Through It',
    text: 'Personal health challenges shaped everything. This is not theoretical.'
  }, {
    title: 'Holistically Whole',
    text: 'Science without wisdom is incomplete. Both have their place.'
  }, {
    title: 'Radically Honest',
    text: 'No affiliate links. No brand allegiances. Just what actually works.'
  }].map(v => React.createElement("div", {
    key: v.title,
    className: "value-item"
  }, React.createElement("h4", null, v.title), React.createElement("p", null, v.text))))), React.createElement("div", {
    className: "reveal d2",
    style: {
      marginTop: '2.5rem'
    }
  }, React.createElement("div", {
    className: "quote"
  }, React.createElement("p", null, "The feeling inside my body is the authority from which I speak most of the time. Everything else \u2014 the science, the research, the expert voices \u2014 supplements what lived experience has already taught me.")), React.createElement("div", {
    style: {
      marginTop: '1.5rem',
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap'
    }
  }, React.createElement("button", {
    className: "btn btn-rebel",
    onClick: () => navigate('work')
  }, "Work With Me"), React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => navigate('principles')
  }, "Read the Guide")), React.createElement("div", {
    style: {
      marginTop: '2.5rem'
    }
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '1rem'
    }
  }, "Find me here"), React.createElement(SocialLinks, {
    style: "block"
  }))))))));
}
function Accordion({
  item,
  navigate
}) {
  const [open, setOpen] = useState(false);
  return React.createElement("div", {
    className: "accordion"
  }, React.createElement("button", {
    className: `acc-head ${open ? 'open' : ''}`,
    onClick: () => setOpen(!open)
  }, React.createElement("span", {
    className: "acc-num"
  }, item.num), React.createElement("span", {
    className: "acc-title"
  }, item.title), React.createElement("span", {
    className: `acc-chev ${open ? 'open' : ''}`
  }, "\u25BC")), React.createElement("div", {
    className: `acc-body ${open ? 'open' : ''}`
  }, React.createElement("div", {
    className: "acc-content",
    dangerouslySetInnerHTML: {
      __html: item.body
    }
  }), item.link && React.createElement("div", {
    style: {
      padding: '0 1.75rem 2rem'
    }
  }, React.createElement("button", {
    className: "crosslink",
    onClick: () => navigate(item.link.page, item.link.section)
  }, item.link.label))));
}
function DehydrationQuiz({
  navigate
}) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  function pick(p) {
    const ns = score + p;
    if (step < QUIZ_QS.length - 1) {
      setScore(ns);
      setStep(step + 1);
    } else {
      setScore(ns);
      setDone(true);
    }
  }
  function reset() {
    setStep(0);
    setScore(0);
    setDone(false);
  }
  const res = done ? QUIZ_RES.find(r => score >= r.min && score <= r.max) || QUIZ_RES[2] : null;
  return React.createElement("section", {
    className: "quiz-wrap",
    style: {
      padding: '6rem 0'
    }
  }, React.createElement("div", {
    className: "quiz-inner"
  }, React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: '3.5rem'
    }
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '.75rem'
    }
  }, "Cellular Hydration Check"), React.createElement("h2", {
    style: {
      fontSize: 'clamp(1.9rem,3.8vw,2.85rem)',
      color: 'var(--cream)',
      fontStyle: 'italic'
    }
  }, "Are your cells truly hydrated?"), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      marginTop: '.75rem',
      fontStyle: 'italic'
    }
  }, "6 questions \xB7 2 minutes \xB7 No email required")), !done ? React.createElement("div", null, React.createElement("div", {
    className: "q-progress"
  }, QUIZ_QS.map((_, i) => React.createElement("div", {
    key: i,
    className: "q-prog-bar"
  }, React.createElement("div", {
    className: "q-prog-fill",
    style: {
      width: i < step ? '100%' : i === step ? '50%' : '0%'
    }
  })))), React.createElement("div", {
    style: {
      fontFamily: 'var(--ff-ui)',
      fontSize: '0.589rem',
      color: 'var(--text-soft)',
      marginBottom: '.75rem',
      letterSpacing: '.1em'
    }
  }, step + 1, " / ", QUIZ_QS.length), React.createElement("div", {
    key: step,
    className: "q-text"
  }, QUIZ_QS[step].text), React.createElement("div", {
    className: "q-opts"
  }, QUIZ_QS[step].opts.map((o, i) => React.createElement("button", {
    key: i,
    className: "q-opt",
    onClick: () => pick(o.p)
  }, React.createElement("span", {
    className: "q-letter"
  }, String.fromCharCode(65 + i)), React.createElement("span", {
    className: "q-opt-text"
  }, o.t)))), step > 0 && React.createElement("button", {
    onClick: () => setStep(step - 1),
    style: {
      marginTop: '1.25rem',
      fontFamily: 'var(--ff-ui)',
      fontSize: '0.6175rem',
      letterSpacing: '.1em',
      color: 'var(--text-soft)',
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    }
  }, "\u2190 Back")) : React.createElement("div", {
    className: "q-result"
  }, React.createElement("div", {
    className: "q-score"
  }, score, "/", QUIZ_QS.length * 2), React.createElement("div", {
    className: "q-level"
  }, res.level), React.createElement("div", {
    className: "q-rtitle"
  }, res.title), React.createElement("p", {
    className: "q-rmsg"
  }, res.msg), React.createElement("div", {
    className: "q-ract"
  }, React.createElement("button", {
    className: "btn btn-rebel",
    onClick: () => navigate(res.cta)
  }, res.ctaLabel), React.createElement("button", {
    className: "btn btn-ghost",
    onClick: reset
  }, "Retake")))));
}
function PrinciplesPage({
  navigate
}) {
  useReveal();
  return React.createElement("div", {
    className: "page-in"
  }, React.createElement("div", {
    className: "page-hero page-hero--water"
  }, React.createElement("div", {
    className: "container",
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, React.createElement("div", {
    className: "water-badge"
  }, React.createElement("span", {
    className: "water-dot"
  }), React.createElement("span", {
    style: {
      marginLeft: '.4rem'
    }
  }, "Living Water")), React.createElement("h1", {
    style: {
      fontSize: 'clamp(2.66rem,6.65vw,5.7rem)',
      color: 'var(--cream)',
      marginTop: '1rem'
    }
  }, "The ", React.createElement("em", {
    style: {
      color: 'var(--foam)'
    }
  }, "why"), React.createElement("br", null), "behind the water"), React.createElement("p", {
    style: {
      maxWidth: 540,
      color: 'var(--text-dim)',
      fontSize: '1.1115rem',
      fontStyle: 'italic',
      marginTop: '1.25rem',
      lineHeight: 1.75
    }
  }, "Five foundational ideas that will permanently change how you relate to water and hydration."))), React.createElement("section", {
    style: {
      background: 'linear-gradient(180deg,#0a2230 0%,var(--near-black) 100%)'
    }
  }, React.createElement("div", {
    className: "container"
  }, React.createElement("div", {
    style: {
      maxWidth: 820
    }
  }, PRINCIPLES_DATA.map((item, i) => React.createElement("div", {
    key: item.num,
    className: "reveal",
    style: {
      transitionDelay: `${i * .05}s`
    }
  }, React.createElement(Accordion, {
    item: item,
    navigate: navigate
  })))), React.createElement("div", {
    className: "reveal",
    style: {
      marginTop: '3rem',
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap'
    }
  }, React.createElement("button", {
    className: "btn btn-rebel",
    onClick: () => navigate('swaps')
  }, "See the Swaps \u2192"), React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => navigate('work')
  }, "Book a Consultation")))), React.createElement(DehydrationQuiz, {
    navigate: navigate
  }));
}
function SwapsPage({
  navigate,
  scrollTarget
}) {
  const [tab, setTab] = useState(scrollTarget || 'sources');
  useReveal();
  useEffect(() => {
    if (scrollTarget) setTab(scrollTarget);
  }, [scrollTarget]);
  const tabs = [{
    id: 'sources',
    l: 'Water Sources'
  }, {
    id: 'salt',
    l: 'Salt Guide'
  }, {
    id: 'brands',
    l: 'Water Brands'
  }, {
    id: 'filtration',
    l: 'Filtration'
  }, {
    id: 'structuring',
    l: 'Structuring'
  }, {
    id: 'storage',
    l: 'Storage'
  }];
  const vs = {
    fontFamily: 'var(--ff-ui)',
    fontSize: '0.589rem',
    fontWeight: 600,
    letterSpacing: '.1em',
    textTransform: 'uppercase',
    color: 'var(--rebel)',
    borderBottom: '1px solid rgba(150,45,73,.3)',
    paddingBottom: '1px',
    whiteSpace: 'nowrap',
    textDecoration: 'none'
  };
  return React.createElement("div", {
    className: "page-in"
  }, React.createElement("div", {
    className: "page-hero page-hero--water",
    style: {
      background: 'linear-gradient(180deg,var(--near-black) 0%,#0d3044 100%)'
    }
  }, React.createElement("div", {
    className: "container",
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, React.createElement("div", {
    className: "water-badge"
  }, React.createElement("span", {
    className: "water-dot"
  }), React.createElement("span", {
    style: {
      marginLeft: '.4rem'
    }
  }, "Living Water")), React.createElement("h1", {
    style: {
      fontSize: 'clamp(2.66rem,6.65vw,5.7rem)',
      color: 'var(--cream)',
      marginTop: '1rem'
    }
  }, "From knowing", React.createElement("br", null), React.createElement("em", {
    style: {
      color: 'var(--rebel-lt)'
    }
  }, "to doing")), React.createElement("p", {
    style: {
      maxWidth: 560,
      color: 'var(--text-dim)',
      fontSize: '1.1115rem',
      fontStyle: 'italic',
      marginTop: '1.25rem',
      lineHeight: 1.75
    }
  }, "Concrete, tested product recommendations \u2014 with prices, links, and zero compromise."))), React.createElement("section", {
    style: {
      background: 'linear-gradient(180deg,#0d3044 0%,var(--near-black) 100%)'
    }
  }, React.createElement("div", {
    className: "container"
  }, React.createElement("div", {
    className: "swap-tabs"
  }, tabs.map(t => React.createElement("button", {
    key: t.id,
    className: `s-tab ${tab === t.id ? 'on' : ''}`,
    onClick: () => setTab(t.id)
  }, t.l))), tab === 'sources' && React.createElement("div", {
    key: "sources",
    style: {
      animation: 'fadeIn .4s ease both'
    }
  }, React.createElement("div", {
    style: {
      marginBottom: '2rem'
    }
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '.75rem'
    }
  }, "Ranked by Quality"), React.createElement("h2", {
    style: {
      fontSize: 'clamp(1.71rem,3.325vw,2.47rem)',
      color: 'var(--cream)',
      marginBottom: '.75rem'
    }
  }, "The Best Water Sources"), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      fontStyle: 'italic',
      maxWidth: 580
    }
  }, "The ideal water is living, structured, and mineral-rich. Where you are determines your options.")), React.createElement("div", {
    className: "src-list"
  }, WATER_SOURCES.map(s => React.createElement("div", {
    key: s.rank,
    className: "src-item"
  }, React.createElement("div", {
    className: "src-rank"
  }, s.rank), React.createElement("div", {
    className: "src-info"
  }, React.createElement("div", {
    className: "src-name"
  }, s.name), React.createElement("p", {
    className: "src-desc"
  }, s.desc)), React.createElement("div", {
    className: `badge ${s.badge}`
  }, s.label)))), React.createElement("button", {
    className: "crosslink",
    onClick: () => navigate('principles')
  }, "\u2190 Why this matters in Principles")), tab === 'salt' && React.createElement("div", {
    key: "salt",
    style: {
      animation: 'fadeIn .4s ease both'
    }
  }, React.createElement("div", {
    style: {
      marginBottom: '2rem'
    }
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '.75rem'
    }
  }, "The Supernutrient"), React.createElement("h2", {
    style: {
      fontSize: 'clamp(1.71rem,3.325vw,2.47rem)',
      color: 'var(--cream)',
      marginBottom: '.75rem'
    }
  }, "Salt \u2014 Your Friend"), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      fontStyle: 'italic',
      maxWidth: 620
    }
  }, "Quality salt contains over 60 trace minerals. These recommendations are based on third-party testing.")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
      gap: '1.5rem',
      marginTop: '2rem'
    }
  }, Object.entries(SALT_DATA).map(([r, b]) => React.createElement("div", {
    key: r,
    className: "card",
    style: {
      cursor: 'default'
    }
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '1rem'
    }
  }, r.charAt(0).toUpperCase() + r.slice(1)), React.createElement("ul", {
    style: {
      listStyle: 'none'
    }
  }, b.map(x => React.createElement("li", {
    key: x,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '.65rem',
      padding: '.42rem 0',
      borderBottom: '1px solid var(--border)',
      color: 'var(--text-dim)',
      fontSize: '1.045rem'
    }
  }, React.createElement("span", {
    style: {
      color: 'var(--rebel)',
      fontSize: '0.665rem'
    }
  }, "\u25C6"), x)))))), React.createElement("button", {
    className: "crosslink",
    onClick: () => navigate('principles')
  }, "\u2190 Why salt matters in Principles")), tab === 'brands' && React.createElement("div", {
    key: "brands",
    style: {
      animation: 'fadeIn .4s ease both'
    }
  }, React.createElement("div", {
    style: {
      marginBottom: '2rem'
    }
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '.75rem'
    }
  }, "Independent Research"), React.createElement("h2", {
    style: {
      fontSize: 'clamp(1.71rem,3.325vw,2.47rem)',
      color: 'var(--cream)',
      marginBottom: '.75rem'
    }
  }, "Water Brand Guide"), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      fontStyle: 'italic',
      maxWidth: 620
    }
  }, "All questionable brands listed are legal and generally below official toxicity limits, but have the highest number of independent reports of detectable pollutants.")), React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '1rem',
      color: 'var(--foam)'
    }
  }, "Trusted Brands"), React.createElement("div", {
    className: "tbl-wrap"
  }, React.createElement("table", {
    className: "dtbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Region"), React.createElement("th", null, "Brands"))), React.createElement("tbody", null, TRUSTED_WATER.map(r => React.createElement("tr", {
    key: r.region
  }, React.createElement("td", {
    style: {
      color: 'var(--gold)',
      fontWeight: 600,
      whiteSpace: 'nowrap'
    }
  }, r.region), React.createElement("td", null, r.brands)))))), React.createElement("div", {
    className: "label",
    style: {
      margin: '2rem 0 1rem',
      color: '#e08888'
    }
  }, "Most Questionable Brands"), React.createElement("div", {
    className: "tbl-wrap"
  }, React.createElement("table", {
    className: "dtbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Region"), React.createElement("th", null, "Brands"), React.createElement("th", null, "Issues"))), React.createElement("tbody", null, QUESTION_WATER.map(r => React.createElement("tr", {
    key: r.region
  }, React.createElement("td", {
    style: {
      color: 'var(--gold)',
      fontWeight: 600,
      whiteSpace: 'nowrap'
    }
  }, r.region), React.createElement("td", null, r.brands), React.createElement("td", {
    style: {
      color: '#e08888',
      fontSize: '0.8075rem'
    }
  }, r.issues))))))), tab === 'filtration' && React.createElement("div", {
    key: "filtration",
    style: {
      animation: 'fadeIn .4s ease both'
    }
  }, React.createElement("div", {
    style: {
      marginBottom: '2rem'
    }
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '.75rem'
    }
  }, "How to Filter"), React.createElement("h2", {
    style: {
      fontSize: 'clamp(1.71rem,3.325vw,2.47rem)',
      color: 'var(--cream)',
      marginBottom: '.75rem'
    }
  }, "Filtration Systems"), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      fontStyle: 'italic',
      maxWidth: 620
    }
  }, "The right filtration depends on your water source, location, and concerns. Always remineralise if using reverse osmosis.")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
      gap: '1rem',
      marginBottom: '3rem'
    }
  }, FILTRATION_TYPES.map(f => React.createElement("div", {
    key: f.name,
    className: "card",
    style: {
      cursor: 'default',
      padding: '1.5rem'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--ff-disp)',
      fontSize: '1.1115rem',
      color: 'var(--cream)',
      marginBottom: '.5rem'
    }
  }, f.name), React.createElement("p", {
    style: {
      fontSize: '1.045rem',
      color: 'var(--text-dim)',
      lineHeight: 1.65
    }
  }, f.desc)))), React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '1rem'
    }
  }, "Top Home Systems"), React.createElement("div", {
    className: "tbl-wrap"
  }, React.createElement("table", {
    className: "dtbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Product"), React.createElement("th", null, "Technology"), React.createElement("th", null, "Best For"), React.createElement("th", null, "Availability"), React.createElement("th", null, "Price"), React.createElement("th", null, "Link"))), React.createElement("tbody", null, HOME_FILTERS.map(f => React.createElement("tr", {
    key: f.name
  }, React.createElement("td", {
    style: {
      color: 'var(--cream)',
      fontWeight: 500
    }
  }, f.name, f.note && React.createElement("div", {
    style: {
      fontSize: '0.741rem',
      color: 'var(--text-soft)',
      fontStyle: 'italic',
      marginTop: '.15rem'
    }
  }, f.note)), React.createElement("td", null, f.tech), React.createElement("td", null, f.best), React.createElement("td", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, f.avail), React.createElement("td", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, React.createElement(PriceTier, {
    price: f.price
  })), React.createElement("td", null, React.createElement("a", {
    href: f.url,
    target: "_blank",
    rel: "noopener noreferrer",
    style: vs
  }, "Visit \u2192"))))))), React.createElement("div", {
    className: "label",
    style: {
      margin: '2rem 0 1rem'
    }
  }, "Top Portable Systems"), React.createElement("div", {
    className: "tbl-wrap"
  }, React.createElement("table", {
    className: "dtbl"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Product"), React.createElement("th", null, "Method"), React.createElement("th", null, "Best For"), React.createElement("th", null, "Availability"), React.createElement("th", null, "Price"), React.createElement("th", null, "Link"))), React.createElement("tbody", null, PORTABLE_FILTERS.map(f => React.createElement("tr", {
    key: f.name
  }, React.createElement("td", {
    style: {
      color: 'var(--cream)',
      fontWeight: 500
    }
  }, f.name), React.createElement("td", null, f.tech), React.createElement("td", null, f.best), React.createElement("td", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, f.avail), React.createElement("td", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, React.createElement(PriceTier, {
    price: f.price
  })), React.createElement("td", null, React.createElement("a", {
    href: f.url,
    target: "_blank",
    rel: "noopener noreferrer",
    style: vs
  }, "Visit \u2192"))))))), React.createElement(PriceLegend, null), React.createElement("button", {
    className: "crosslink",
    style: {
      marginTop: '1rem'
    },
    onClick: () => navigate('principles')
  }, "\u2190 Understand why filtration matters")), tab === 'structuring' && React.createElement("div", {
    key: "structuring",
    style: {
      animation: 'fadeIn .4s ease both'
    }
  }, React.createElement("div", {
    style: {
      marginBottom: '2rem'
    }
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '.75rem'
    }
  }, "The Fourth Phase"), React.createElement("h2", {
    style: {
      fontSize: 'clamp(1.71rem,3.325vw,2.47rem)',
      color: 'var(--cream)',
      marginBottom: '.75rem'
    }
  }, "Water Structuring Tools"), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      fontStyle: 'italic',
      maxWidth: 620
    }
  }, "Structured water is the form your cells actually use. These products help recreate it at home.")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    }
  }, STRUCT_PRODUCTS.map(p => React.createElement("div", {
    key: p.name,
    className: "card",
    style: {
      cursor: 'default'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--ff-disp)',
      fontSize: '1.1115rem',
      color: 'var(--cream)',
      marginBottom: '.5rem'
    }
  }, p.name), React.createElement("p", {
    style: {
      fontSize: '1.045rem',
      color: 'var(--text-dim)',
      lineHeight: 1.65,
      marginBottom: '.75rem'
    }
  }, p.desc), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '.5rem'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '.75rem'
    }
  }, React.createElement("div", {
    className: "label",
    style: {
      fontSize: '0.551rem'
    }
  }, p.avail), React.createElement(PriceTier, {
    price: p.price
  })), React.createElement("a", {
    href: p.url,
    target: "_blank",
    rel: "noopener noreferrer",
    style: vs
  }, "Visit \u2192"))))), React.createElement(PriceLegend, null), React.createElement("div", {
    className: "quote",
    style: {
      marginTop: '1.5rem'
    }
  }, React.createElement("p", null, "\"The simplest structuring practice costs nothing: swirl your water vigorously with a spoon before drinking. Hold gratitude in your heart as you do it.\"")), React.createElement("button", {
    className: "crosslink",
    onClick: () => navigate('principles')
  }, "\u2190 Read about Water Structuring in Principles")), tab === 'storage' && React.createElement("div", {
    key: "storage",
    style: {
      animation: 'fadeIn .4s ease both'
    }
  }, React.createElement("div", {
    style: {
      marginBottom: '2rem'
    }
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '.75rem'
    }
  }, "Preserve What You Have"), React.createElement("h2", {
    style: {
      fontSize: 'clamp(1.71rem,3.325vw,2.47rem)',
      color: 'var(--cream)',
      marginBottom: '.75rem'
    }
  }, "Water Storage Guide"), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      fontStyle: 'italic',
      maxWidth: 620
    }
  }, "How you store water determines whether it retains its quality.")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
      gap: '1.25rem'
    }
  }, [{
    title: 'Glass — The Gold Standard',
    body: 'Blue or violet glass is ideal. Miron violet glass creates a protective field and is excellent for long-term storage.',
    badge: 'b-best',
    bl: 'Best'
  }, {
    title: 'Copper Vessels',
    body: 'From Ayurvedic tradition. Imparts antimicrobial benefits and subtle mineralisation. Requires regular cleaning.',
    badge: 'b-good',
    bl: 'Good'
  }, {
    title: 'Stainless Steel',
    body: 'Durable and clean. Good for bulk storage and travel. Use food-grade only.',
    badge: 'b-good',
    bl: 'Good'
  }, {
    title: 'Plastic — Avoid',
    body: 'Even BPA-free plastics leach microplastics and endocrine disruptors over time, especially with heat or sunlight.',
    badge: 'b-avoid',
    bl: 'Avoid'
  }].map(s => React.createElement("div", {
    key: s.title,
    className: "card",
    style: {
      cursor: 'default'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '.75rem'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--ff-disp)',
      fontSize: '1.1115rem',
      color: 'var(--cream)'
    }
  }, s.title), React.createElement("div", {
    className: `badge ${s.badge}`,
    style: {
      marginLeft: '.75rem',
      flexShrink: 0
    }
  }, s.bl)), React.createElement("p", {
    style: {
      fontSize: '1.045rem',
      color: 'var(--text-dim)',
      lineHeight: 1.65
    }
  }, s.body)))), React.createElement("div", {
    className: "card",
    style: {
      marginTop: '1.5rem',
      cursor: 'default',
      background: 'rgba(200,169,107,.06)',
      borderColor: 'rgba(200,169,107,.2)'
    }
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '.75rem'
    }
  }, "Storage Tips"), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      fontSize: '1.045rem',
      lineHeight: 1.75
    }
  }, "Store between ", React.createElement("strong", {
    style: {
      color: 'var(--cream)'
    }
  }, "4\u201320\xB0C (39\u201368\xB0F)"), ". Keep away from direct sunlight and electronics. Add a pinch of unrefined sea salt per litre for long-term storage. Place shungite or sun-charged quartz crystals in your storage container."))))));
}
function WorkPage({
  navigate
}) {
  useReveal();
  return React.createElement("div", {
    className: "page-in"
  }, React.createElement("div", {
    className: "page-hero page-hero--rebel"
  }, React.createElement("div", {
    className: "container",
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, React.createElement("div", {
    className: "label label--rebel",
    style: {
      marginBottom: '1rem'
    }
  }, "Consultancy"), React.createElement("h1", {
    style: {
      fontSize: 'clamp(2.66rem,6.65vw,5.7rem)',
      color: 'var(--cream)'
    }
  }, "Work", React.createElement("br", null), React.createElement("em", {
    style: {
      color: 'var(--rebel-lt)'
    }
  }, "With Me")), React.createElement("p", {
    style: {
      maxWidth: 520,
      color: 'var(--text-dim)',
      fontSize: '1.1115rem',
      fontStyle: 'italic',
      marginTop: '1.25rem',
      lineHeight: 1.75
    }
  }, "Personal and company consultations \u2014 a tailored, honest look at your water reality, with a clear path forward."))), React.createElement("section", {
    style: {
      background: 'linear-gradient(180deg,#1a0810 0%,var(--near-black) 100%)'
    }
  }, React.createElement("div", {
    className: "container"
  }, React.createElement("div", {
    className: "offer-grid reveal"
  }, React.createElement("div", {
    className: "offer-card"
  }, React.createElement("div", {
    className: "offer-type"
  }, "Individual"), React.createElement("div", {
    className: "offer-title"
  }, "1-on-1 Consultation"), React.createElement("p", {
    className: "offer-desc"
  }, "A personal deep-dive into your water reality. We look at your location, current sources, health goals, and existing habits. You leave with a clear, tailored action plan."), React.createElement("ul", {
    className: "offer-list"
  }, React.createElement("li", null, "Full water source assessment for your location"), React.createElement("li", null, "Filtration and structuring recommendations"), React.createElement("li", null, "Personalised mineral and salt protocol"), React.createElement("li", null, "Dehydrating agent audit for your lifestyle"), React.createElement("li", null, "Written summary with product recommendations")), React.createElement("a", {
    href: "mailto:discernlikearebel@proton.me?subject=1-on-1 Consultation Enquiry",
    className: "btn btn-rebel"
  }, "Book a Session")), React.createElement("div", {
    className: "offer-card"
  }, React.createElement("div", {
    className: "offer-type"
  }, "Organisations"), React.createElement("div", {
    className: "offer-title"
  }, "Company Consultation"), React.createElement("p", {
    className: "offer-desc"
  }, "Helping organisations understand and improve the water environment they create for their teams. Because hydration culture is a legitimate part of workplace wellbeing."), React.createElement("ul", {
    className: "offer-list"
  }, React.createElement("li", null, "Office water quality assessment"), React.createElement("li", null, "Filtration and dispenser recommendations"), React.createElement("li", null, "Team education \u2014 principles and practical swaps"), React.createElement("li", null, "Ongoing advisory relationship available"), React.createElement("li", null, "Customised to your organisation's scale")), React.createElement("a", {
    href: "mailto:discernlikearebel@proton.me?subject=Company Consultation Enquiry",
    className: "btn btn-ghost"
  }, "Get in Touch"))), React.createElement("div", {
    className: "divider reveal",
    style: {
      margin: '4rem 0'
    }
  }, React.createElement("div", {
    className: "div-line"
  }), React.createElement("div", {
    className: "div-mark"
  }, "\u2726"), React.createElement("div", {
    className: "div-line"
  })), React.createElement("div", {
    className: "reveal",
    style: {
      textAlign: 'center',
      marginBottom: '2.5rem'
    }
  }, React.createElement("div", {
    className: "label",
    style: {
      marginBottom: '.75rem'
    }
  }, "How It Works"), React.createElement("h2", {
    style: {
      fontSize: 'clamp(1.71rem,3.325vw,2.66rem)',
      color: 'var(--cream)'
    }
  }, "The process, simply")), React.createElement("div", {
    className: "process-grid reveal d1"
  }, [{
    num: '01',
    title: 'Reach Out',
    body: 'Send an email with a brief note about what you are dealing with. I will reply personally.'
  }, {
    num: '02',
    title: 'Deep Dive',
    body: 'We go through your water sources, location, habits, health context, and goals in a focused conversation.'
  }, {
    num: '03',
    title: 'Your Plan',
    body: 'You receive a written, personalised protocol — clear, actionable, and built around your actual life.'
  }].map(s => React.createElement("div", {
    key: s.num,
    className: "process-step"
  }, React.createElement("div", {
    className: "process-step__num"
  }, s.num), React.createElement("h4", null, s.title), React.createElement("p", null, s.body)))), React.createElement("div", {
    className: "reveal",
    style: {
      textAlign: 'center',
      marginTop: '4rem'
    }
  }, React.createElement("div", {
    className: "quote",
    style: {
      borderLeft: 'none',
      borderTop: '1px solid var(--rebel)',
      borderBottom: '1px solid var(--rebel)',
      textAlign: 'center',
      padding: '2rem'
    }
  }, React.createElement("p", null, "\"Nothing hits more than when you finally see improvement in your own health. That is what I work towards for every person I work with.\"")), React.createElement("div", {
    style: {
      marginTop: '2rem'
    }
  }, React.createElement("a", {
    href: "mailto:discernlikearebel@proton.me",
    className: "btn btn-rebel"
  }, "discernlikearebel@proton.me"))))));
}
function ContactPage({
  navigate
}) {
  useReveal();
  return React.createElement("div", {
    className: "page-in"
  }, React.createElement("div", {
    className: "contact-wrap"
  }, React.createElement("div", {
    className: "narrow reveal",
    style: {
      position: 'relative',
      zIndex: 1,
      textAlign: 'center'
    }
  }, React.createElement("div", {
    className: "label label--rebel",
    style: {
      marginBottom: '1.25rem'
    }
  }, "Get in Touch"), React.createElement("h1", {
    style: {
      fontSize: 'clamp(2.66rem,6.65vw,5.225rem)',
      color: 'var(--cream)',
      fontStyle: 'italic',
      lineHeight: 1.1,
      marginBottom: '1.25rem'
    }
  }, "Let's talk", React.createElement("br", null), "about your water"), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      fontSize: '1.1115rem',
      fontStyle: 'italic',
      lineHeight: 1.8,
      marginBottom: '1rem'
    }
  }, "Whether you have a question, want to book a consultation, or simply want to share something water-related that moved you \u2014 I'd love to hear from you."), React.createElement("a", {
    className: "email-link",
    href: "mailto:discernlikearebel@proton.me"
  }, "discernlikearebel@proton.me"), React.createElement("p", {
    style: {
      color: 'var(--text-soft)',
      fontSize: '0.855rem',
      fontStyle: 'italic',
      marginBottom: '2.5rem'
    }
  }, "I read every message and reply personally."), React.createElement("div", {
    style: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, React.createElement("a", {
    href: "mailto:discernlikearebel@proton.me?subject=Consultation",
    className: "btn btn-rebel"
  }, "Book a Consultation"), React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => navigate('principles')
  }, "Explore the Guide")), React.createElement("div", {
    style: {
      marginTop: '3rem'
    }
  }, React.createElement("div", {
    className: "label label--rebel",
    style: {
      marginBottom: '1rem',
      textAlign: 'left'
    }
  }, "Follow Along"), React.createElement(SocialLinks, {
    style: "block"
  })), React.createElement("div", {
    style: {
      marginTop: '2rem',
      padding: '2rem',
      border: '1px solid rgba(150,45,73,.25)',
      borderRadius: 4,
      background: 'rgba(150,45,73,.05)'
    }
  }, React.createElement("div", {
    className: "label label--rebel",
    style: {
      marginBottom: '.75rem',
      textAlign: 'left'
    }
  }, "Discern Like A Rebel"), React.createElement("p", {
    style: {
      color: 'var(--text-dim)',
      fontSize: '1.1115rem',
      fontStyle: 'italic',
      lineHeight: 1.75,
      textAlign: 'left'
    }
  }, "An invitation to choose knowledge over convenience, presence over habit, and the intelligence of nature over the noise of marketing. One glass of living water at a time.")))));
}
function Footer({
  navigate
}) {
  return React.createElement("footer", {
    className: "footer"
  }, React.createElement("div", {
    className: "footer-inner"
  }, React.createElement("div", null, React.createElement("div", {
    className: "footer-brand"
  }, "Discern Like A Rebel"), React.createElement("div", {
    className: "footer-copy",
    style: {
      marginTop: '.35rem'
    }
  }, "Living Water \u2014 first topic")), React.createElement("div", {
    className: "footer-links"
  }, [['home', 'Home'], ['principles', 'Principles'], ['swaps', 'Swaps'], ['about', 'About'], ['work', 'Work With Me'], ['contact', 'Contact']].map(([id, l]) => React.createElement("button", {
    key: id,
    className: "footer-link",
    onClick: () => navigate(id)
  }, l))), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '.75rem'
    }
  }, React.createElement(SocialLinks, {
    style: "footer"
  }), React.createElement("div", {
    className: "footer-copy"
  }, "\xA9 2025 Discern Like A Rebel. All rights reserved.", React.createElement("br", null), "Educational purposes only \u2014 not a substitute for medical advice."))));
}
function App() {
  const getPage = () => {
    const h = (typeof window !== 'undefined' ? window.location.hash : '').replace('#', '');
    return ['home', 'principles', 'swaps', 'about', 'work', 'contact'].includes(h) ? h : 'home';
  };
  const [page, setPage] = useState(getPage);
  const [scrollTarget, setScrollTarget] = useState(null);
  function navigate(p, section = null) {
    setPage(p);
    setScrollTarget(section);
    window.location.hash = p;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  useEffect(() => {
    const h = () => {
      const p = window.location.hash.replace('#', '');
      if (['home', 'principles', 'swaps', 'about', 'work', 'contact'].includes(p)) setPage(p);
    };
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);
  return React.createElement("div", null, React.createElement(BrandBar, null), React.createElement(Nav, {
    page: page,
    navigate: navigate
  }), React.createElement("main", {
    style: {
      paddingTop: '98px'
    }
  }, page === 'home' && React.createElement(HomePage, {
    navigate: navigate
  }), page === 'about' && React.createElement(AboutPage, {
    navigate: navigate
  }), page === 'principles' && React.createElement(PrinciplesPage, {
    navigate: navigate
  }), page === 'swaps' && React.createElement(SwapsPage, {
    navigate: navigate,
    scrollTarget: scrollTarget
  }), page === 'work' && React.createElement(WorkPage, {
    navigate: navigate
  }), page === 'contact' && React.createElement(ContactPage, {
    navigate: navigate
  })), React.createElement(Footer, {
    navigate: navigate
  }), React.createElement(FloatingSwapsBtn, {
    navigate: navigate
  }));
}
(function(){
  var rootEl = document.getElementById("root");
  var el = React.createElement(App, null);
  if (rootEl && rootEl.firstChild) {
    ReactDOM.hydrateRoot(rootEl, el);
  } else {
    ReactDOM.createRoot(rootEl).render(el);
  }
})();

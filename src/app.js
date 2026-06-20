/* ===== font pairings ===== */
const FONTS={
 grotesk:{label:'Space Grotesk · thePower',disp:'"Space Grotesk",Inter,sans-serif',sans:'Inter,system-ui,sans-serif',link:'family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800'},
 fraunces:{label:'Fraunces · editorial',disp:'"Fraunces",Georgia,serif',sans:'"Inter",system-ui,sans-serif',link:'family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600;700'},
 sora:{label:'Sora',disp:'"Sora",Inter,sans-serif',sans:'Inter,system-ui,sans-serif',link:'family=Sora:wght@500;600;700&family=Inter:wght@400;500;600;700'},
 archivo:{label:'Archivo',disp:'"Archivo",Inter,sans-serif',sans:'Inter,system-ui,sans-serif',link:'family=Archivo:wght@600;700;800&family=Inter:wght@400;500;600;700'},
 outfit:{label:'Outfit',disp:'"Outfit",Inter,sans-serif',sans:'Inter,system-ui,sans-serif',link:'family=Outfit:wght@500;600;700&family=Inter:wght@400;500;600;700'},
 manrope:{label:'Manrope',disp:'"Manrope",sans-serif',sans:'"Manrope",sans-serif',link:'family=Manrope:wght@400;500;600;700;800'}
};
/* ===== color helpers ===== */
function shade(hex,p){let h=hex.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');let r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);r=Math.round(r+(p<0?r*p:(255-r)*p));g=Math.round(g+(p<0?g*p:(255-g)*p));b=Math.round(b+(p<0?b*p:(255-b)*p));return '#'+[r,g,b].map(x=>Math.max(0,Math.min(255,x)).toString(16).padStart(2,'0')).join('');}

/* ===== estado ===== */
let deck={title:'Nuevo deck',theme:'',slides:[]};
let brand={accent:'#9ED9C4',accent2:'#D7FF63',ink:'#0B1F22',paper:'#F7F4EC',font:'grotesk',logo:'',clientLogo:'',clientName:''};
let sel=-1,uid=1;
const $=id=>document.getElementById(id);
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600);}

/* ===== persistencia ===== */
function save(){try{localStorage.setItem('tp_deck2',JSON.stringify({deck,brand,collapsed}));}catch(e){}}
function load(){try{const r=JSON.parse(localStorage.getItem('tp_deck2'));if(r&&r.deck){deck=r.deck;brand=Object.assign(brand,r.brand||{});collapsed=r.collapsed||{};$('deckTitle').value=deck.title;}}catch(e){}}

/* ===== inyección de marca en el documento exportado ===== */
function brandStyle(){
  const f=FONTS[brand.font]||FONTS.grotesk;
  const ink2=shade(brand.ink,.10),ink3=shade(brand.ink,.18),paper2=shade(brand.paper,-.08);
  // selector con la misma especificidad que html.editorial (0,0,1,1) e inyectado después,
  // para que la marca del usuario gane SIEMPRE al preset del tema (si no, en editorial los
  // colores de marca quedaban pisados por html.editorial y no se renderizaban).
  return `<link href="https://fonts.googleapis.com/css2?${f.link}&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style id="brandvars">:root,html.editorial{
 --mint:${brand.accent};--acc:${brand.accent};--mint-2:${shade(brand.accent,.25)};--mint-3:${shade(brand.accent,.5)};
 --lime:${brand.accent2};--acc-2:${brand.accent2};
 --ink:${brand.ink};--ink-2:${ink2};--ink-3:${ink3};--paper:${brand.paper};--paper-2:${paper2};
 --line-strong:${brand.accent}61;
 --display:${f.disp};--sans:${f.sans};
}</style>`;
}
function brandEl(){
  if(brand.clientLogo){
    const main=brand.logo?`<img src="${brand.logo}" alt="">`:`<img src="https://dondeestudiar.eu/wp-content/uploads/2023/12/thePower-LOGO-CARD.png" alt="thePower" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="tp-wm" style="display:none">the<b>Power</b></span>`;
    const cli=/^(https?:|data:)/.test(brand.clientLogo)?`<img src="${brand.clientLogo}" alt="">`:`<span class="kpmg-wm" style="color:${brand.ink}">${brand.clientLogo}</span>`;
    return `<div class="brand cob">${main}<span class="x">×</span><span class="chipw">${cli}</span></div>`;
  }
  if(brand.logo)return `<div class="brand"><img src="${brand.logo}" alt=""></div>`;
  return null; // usar el del template
}

/* ===== construcción de doc ===== */
function applyExtras(html,d){
  let s=html;
  if(d._wm){if(/data-wm=/.test(s))s=s.replace(/data-wm="[^"]*"/,'data-wm="'+esc(d._wm)+'"');else s=s.replace('<section class="scene','<section data-wm="'+esc(d._wm)+'" class="scene');}
  if(d._flip)s=s.replace('class="scene','class="scene flip');
  if(d._bg)s=s.replace(/(<section[^>]*>)/,'$1<div class="sbgimg"><img src="'+esc(d._bg)+'" alt=""><div class="sbgov"></div></div>');
  let ex='';
  if(d._badge)ex+='<div class="sbadge '+(d._badgePos||'tr')+'">'+esc(d._badge)+'</div>';
  if(d._foot)ex+='<div class="sfoot-x">'+esc(d._foot)+'</div>';
  if(d._side)ex+='<div class="stag-side">'+esc(d._side)+'</div>';
  if(ex)s=s.replace('</section>',ex+'</section>');
  return s;
}
function sceneHTML(s){return applyExtras(TYPES[s.type].render(s.data),s.data);}
function buildDoc(scenes,n){
  let html=TPL.replace('<!--SCENES-->',scenes).replace('__TOT__',n);
  // tema editorial base
  if(deck.theme==='editorial'){
    html=html.replace('<html lang="es">','<html lang="es" class="editorial">');
    html=html.replace(/<!--\s*(<link href="https:\/\/fonts.googleapis.com\/css2\?family=Fraunces[\s\S]*?>)\s*-->/,'$1');
  }
  // inyectar marca (colores+fuentes) antes de </head>
  html=html.replace('</head>',brandStyle()+'\n</head>');
  // logo / coibranding
  const be=brandEl();
  if(be)html=html.replace(/<div class="brand[^]*?<\/div>\s*(?=<!-- coibranding)/,be+'\n    ');
  return html;
}
function previewDoc(s){return buildDoc(sceneHTML(s),1);}
function deckDoc(){return buildDoc(deck.slides.map(sceneHTML).join('\n'),deck.slides.length||1);}

/* ===== export PPTX (slides como imagen, alta resolución) ===== */
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>rej(new Error('No se pudo cargar '+src));document.head.appendChild(s);});}
let _libs=false;
async function ensureLibs(){if(_libs)return;
  if(!window.html2canvas)await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
  if(!window.PptxGenJS)await loadScript('https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js');
  _libs=true;}
async function renderSlidePNG(s,scale){
  const host=document.createElement('div');
  host.style.cssText='position:fixed;left:-9999px;top:0;width:1280px;height:720px;z-index:-1';
  const doc=buildDoc(sceneHTML(s),1);
  const ifr=document.createElement('iframe');ifr.style.cssText='width:1280px;height:720px;border:0';
  host.appendChild(ifr);document.body.appendChild(host);
  await new Promise(r=>{ifr.onload=r;ifr.srcdoc=doc;});
  const idoc=ifr.contentDocument;
  const st=idoc.createElement('style');st.textContent='*{animation:none!important;transition:none!important}.reveal{opacity:1!important;transform:none!important}';idoc.head.appendChild(st);
  try{await idoc.fonts.ready;}catch(e){}
  await new Promise(r=>setTimeout(r,200));
  const slideEl=idoc.querySelector('.slide')||idoc.body;
  const canvas=await window.html2canvas(slideEl,{scale:scale||2,useCORS:true,backgroundColor:null,width:1280,height:720,windowWidth:1280,windowHeight:720,logging:false});
  const png=canvas.toDataURL('image/png');
  document.body.removeChild(host);
  return png;
}
async function exportPPTX(){
  if(!deck.slides.length){toast('No hay slides');return;}
  const btn=$('btnPptx');const old=btn?btn.textContent:'';
  try{
    toast('Preparando PPTX…');if(btn){btn.disabled=true;}
    await ensureLibs();
    const pptx=new window.PptxGenJS();pptx.defineLayout({name:'W',width:13.333,height:7.5});pptx.layout='W';
    for(let i=0;i<deck.slides.length;i++){
      if(btn)btn.textContent='Render '+(i+1)+'/'+deck.slides.length;
      const png=await renderSlidePNG(deck.slides[i],2);
      const sl=pptx.addSlide();
      sl.addImage({data:png,x:0,y:0,w:13.333,h:7.5});
    }
    await pptx.writeFile({fileName:slug(deck.title)+'.pptx'});
    toast('PPTX descargado');
  }catch(e){toast('Error al exportar PPTX: '+e.message);}
  finally{if(btn){btn.disabled=false;btn.textContent=old;}}
}

/* ===== micro-previews (wireframes esquemáticos por tipo) ===== */
const GA='#9ED9C4',GL='rgba(247,244,236,.26)',GD='rgba(247,244,236,.13)';
const GLYPH={
 cover:`<rect x="8" y="7" width="14" height="2.6" rx="1.3" fill="${GA}"/><rect x="8" y="16" width="52" height="5" rx="2" fill="${GL}"/><rect x="8" y="24" width="34" height="5" rx="2" fill="${GL}"/>`,
 statement:`<rect x="20" y="12" width="60" height="5" rx="2" fill="${GL}"/><rect x="30" y="20" width="40" height="5" rx="2" fill="${GA}"/>`,
 divider:`<text x="6" y="29" font-family="sans-serif" font-size="28" font-weight="800" fill="${GA}">2</text><rect x="30" y="13" width="42" height="4" rx="2" fill="${GL}"/><rect x="30" y="20" width="28" height="3" rx="1.5" fill="${GD}"/>`,
 agenda:`<circle cx="12" cy="9" r="3" fill="none" stroke="${GA}" stroke-width="1.1"/><rect x="20" y="7.5" width="48" height="3" rx="1.5" fill="${GL}"/><rect x="80" y="7.5" width="12" height="3" rx="1.5" fill="${GD}"/><circle cx="12" cy="18" r="3" fill="none" stroke="${GA}" stroke-width="1.1"/><rect x="20" y="16.5" width="48" height="3" rx="1.5" fill="${GL}"/><rect x="80" y="16.5" width="12" height="3" rx="1.5" fill="${GD}"/><circle cx="12" cy="27" r="3" fill="none" stroke="${GA}" stroke-width="1.1"/><rect x="20" y="25.5" width="48" height="3" rx="1.5" fill="${GL}"/><rect x="80" y="25.5" width="12" height="3" rx="1.5" fill="${GD}"/>`,
 quote:`<text x="6" y="22" font-size="26" font-family="serif" fill="${GA}">“</text><rect x="24" y="11" width="60" height="4" rx="2" fill="${GL}"/><rect x="24" y="18" width="48" height="4" rx="2" fill="${GL}"/><rect x="24" y="25" width="22" height="3" rx="1.5" fill="${GA}"/>`,
 quotecard:`<rect x="8" y="7" width="22" height="22" rx="3" fill="none" stroke="${GA}" stroke-width="1.2"/><rect x="38" y="11" width="50" height="4" rx="2" fill="${GL}"/><rect x="38" y="18" width="40" height="4" rx="2" fill="${GL}"/><rect x="38" y="25" width="20" height="3" rx="1.5" fill="${GA}"/>`,
 cards:`<rect x="8" y="10" width="26" height="18" rx="2.5" fill="none" stroke="${GL}" stroke-width="1.2"/><rect x="38" y="10" width="26" height="18" rx="2.5" fill="none" stroke="${GA}" stroke-width="1.3"/><rect x="68" y="10" width="26" height="18" rx="2.5" fill="none" stroke="${GL}" stroke-width="1.2"/>`,
 icongrid:`<rect x="8" y="9" width="19" height="18" rx="2" fill="none" stroke="${GL}" stroke-width="1.1"/><circle cx="17.5" cy="15" r="2.2" fill="${GA}"/><rect x="30" y="9" width="19" height="18" rx="2" fill="none" stroke="${GL}" stroke-width="1.1"/><circle cx="39.5" cy="15" r="2.2" fill="${GA}"/><rect x="52" y="9" width="19" height="18" rx="2" fill="none" stroke="${GL}" stroke-width="1.1"/><circle cx="61.5" cy="15" r="2.2" fill="${GA}"/><rect x="74" y="9" width="19" height="18" rx="2" fill="none" stroke="${GL}" stroke-width="1.1"/><circle cx="83.5" cy="15" r="2.2" fill="${GA}"/>`,
 twocol:`<rect x="8" y="9" width="36" height="3" rx="1.5" fill="${GA}"/><rect x="8" y="15" width="32" height="2.5" rx="1" fill="${GL}"/><rect x="8" y="20" width="34" height="2.5" rx="1" fill="${GL}"/><line x1="50" y1="8" x2="50" y2="28" stroke="${GD}" stroke-width="1"/><rect x="56" y="9" width="36" height="3" rx="1.5" fill="${GA}"/><rect x="56" y="15" width="32" height="2.5" rx="1" fill="${GL}"/><rect x="56" y="20" width="28" height="2.5" rx="1" fill="${GL}"/>`,
 steps:`<line x1="6" y1="29" x2="94" y2="29" stroke="${GD}" stroke-width="1"/><rect x="12" y="22" width="13" height="7" fill="${GL}"/><rect x="32" y="18" width="13" height="11" fill="${GL}"/><rect x="52" y="13" width="13" height="16" fill="${GL}"/><rect x="72" y="8" width="13" height="21" fill="${GA}"/>`,
 layers:`<rect x="12" y="8" width="76" height="6" rx="2" fill="${GL}"/><rect x="12" y="16" width="76" height="6" rx="2" fill="${GL}"/><rect x="12" y="24" width="76" height="6" rx="2" fill="${GA}"/>`,
 qlist:`<circle cx="12" cy="12" r="4" fill="none" stroke="${GA}" stroke-width="1.2"/><rect x="22" y="10" width="62" height="4" rx="2" fill="${GL}"/><circle cx="12" cy="25" r="4" fill="none" stroke="${GA}" stroke-width="1.2"/><rect x="22" y="23" width="50" height="4" rx="2" fill="${GL}"/>`,
 list:`<circle cx="11" cy="10" r="2.2" fill="none" stroke="${GA}" stroke-width="1.2"/><rect x="18" y="8.5" width="68" height="3" rx="1.5" fill="${GL}"/><circle cx="11" cy="19" r="2.2" fill="none" stroke="${GA}" stroke-width="1.2"/><rect x="18" y="17.5" width="60" height="3" rx="1.5" fill="${GL}"/><circle cx="11" cy="28" r="2.2" fill="none" stroke="${GA}" stroke-width="1.2"/><rect x="18" y="26.5" width="64" height="3" rx="1.5" fill="${GL}"/>`,
 callout:`<rect x="14" y="10" width="72" height="17" rx="3" fill="none" stroke="${GA}" stroke-width="1.3"/><rect x="22" y="16" width="44" height="4" rx="2" fill="${GL}"/>`,
 statrow:`<text x="26" y="23" font-size="16" font-weight="800" fill="${GA}" text-anchor="middle">90%</text><text x="70" y="23" font-size="16" font-weight="800" fill="${GL}" text-anchor="middle">12</text><rect x="14" y="27" width="24" height="2.5" rx="1" fill="${GD}"/><rect x="58" y="27" width="24" height="2.5" rx="1" fill="${GD}"/>`,
 kpi:`<rect x="8" y="9" width="19" height="18" rx="2" fill="none" stroke="${GL}"/><text x="17.5" y="21" font-size="9" font-weight="800" fill="${GA}" text-anchor="middle">9</text><rect x="30" y="9" width="19" height="18" rx="2" fill="none" stroke="${GL}"/><text x="39.5" y="21" font-size="9" font-weight="800" fill="${GA}" text-anchor="middle">2</text><rect x="52" y="9" width="19" height="18" rx="2" fill="none" stroke="${GL}"/><text x="61.5" y="21" font-size="9" font-weight="800" fill="${GA}" text-anchor="middle">5</text><rect x="74" y="9" width="19" height="18" rx="2" fill="none" stroke="${GA}"/><text x="83.5" y="21" font-size="9" font-weight="800" fill="${GA}" text-anchor="middle">7</text>`,
 table:`<rect x="8" y="8" width="84" height="6" rx="1.5" fill="${GD}"/><line x1="8" y1="20" x2="92" y2="20" stroke="${GD}"/><line x1="8" y1="26" x2="92" y2="26" stroke="${GD}"/><line x1="44" y1="8" x2="44" y2="30" stroke="${GD}"/><line x1="68" y1="8" x2="68" y2="30" stroke="${GD}"/><rect x="12" y="16" width="22" height="2.5" rx="1" fill="${GA}"/>`,
 shift:`<rect x="8" y="12" width="28" height="13" rx="2" fill="none" stroke="${GL}"/><path d="M44 18 H58" stroke="${GA}" stroke-width="1.4"/><path d="M54 14 L58 18 L54 22" stroke="${GA}" stroke-width="1.4" fill="none"/><rect x="64" y="12" width="28" height="13" rx="2" fill="none" stroke="${GA}"/>`,
 flow:`<rect x="6" y="12" width="20" height="14" rx="2" fill="none" stroke="${GL}"/><path d="M28 19 H38" stroke="${GA}" stroke-width="1.3"/><rect x="40" y="12" width="20" height="14" rx="2" fill="none" stroke="${GL}"/><path d="M62 19 H72" stroke="${GA}" stroke-width="1.3"/><rect x="74" y="12" width="20" height="14" rx="2" fill="none" stroke="${GA}"/>`,
 pyramid:`<rect x="42" y="7" width="16" height="6" rx="1" fill="${GA}"/><rect x="33" y="15" width="34" height="6" rx="1" fill="${GL}"/><rect x="24" y="23" width="52" height="6" rx="1" fill="${GL}"/>`,
 donut:`<circle cx="50" cy="18" r="11" fill="none" stroke="${GD}" stroke-width="4"/><circle cx="50" cy="18" r="11" fill="none" stroke="${GA}" stroke-width="4" stroke-dasharray="48 69" stroke-linecap="round" transform="rotate(-90 50 18)"/>`,
 gauge:`<path d="M34 27 A16 16 0 0 1 66 27" fill="none" stroke="${GD}" stroke-width="4"/><path d="M34 27 A16 16 0 0 1 61 13" fill="none" stroke="${GA}" stroke-width="4" stroke-linecap="round"/>`,
 bars:`<line x1="6" y1="29" x2="94" y2="29" stroke="${GD}"/><rect x="16" y="19" width="12" height="10" fill="${GL}"/><rect x="36" y="14" width="12" height="15" fill="${GL}"/><rect x="56" y="9" width="12" height="20" fill="${GL}"/><rect x="76" y="5" width="12" height="24" fill="${GA}"/>`,
 hbars:`<rect x="8" y="9" width="62" height="4.5" rx="2" fill="${GA}"/><rect x="8" y="17" width="48" height="4.5" rx="2" fill="${GL}"/><rect x="8" y="25" width="36" height="4.5" rx="2" fill="${GL}"/>`,
 timeline:`<line x1="8" y1="18" x2="92" y2="18" stroke="${GD}" stroke-width="1.5"/><line x1="8" y1="18" x2="50" y2="18" stroke="${GA}" stroke-width="1.5"/><circle cx="8" cy="18" r="3" fill="${GA}"/><circle cx="30" cy="18" r="3" fill="${GA}"/><circle cx="50" cy="18" r="3" fill="${GA}"/><circle cx="72" cy="18" r="3" fill="${GD}"/><circle cx="92" cy="18" r="3" fill="${GD}"/>`,
 vtimeline:`<line x1="14" y1="6" x2="14" y2="31" stroke="${GD}" stroke-width="1.5"/><circle cx="14" cy="9" r="3" fill="${GA}"/><rect x="22" y="7.5" width="40" height="3" rx="1.5" fill="${GL}"/><circle cx="14" cy="19" r="3" fill="${GA}"/><rect x="22" y="17.5" width="34" height="3" rx="1.5" fill="${GL}"/><circle cx="14" cy="29" r="3" fill="none" stroke="${GD}"/><rect x="22" y="27.5" width="28" height="3" rx="1.5" fill="${GD}"/>`,
 funnel:`<rect x="20" y="7" width="60" height="5" rx="1" fill="${GA}"/><rect x="27" y="14" width="46" height="5" rx="1" fill="${GL}"/><rect x="34" y="21" width="32" height="5" rx="1" fill="${GL}"/>`,
 venn:`<circle cx="42" cy="18" r="13" fill="${GA}" fill-opacity=".12" stroke="${GA}"/><circle cx="58" cy="18" r="13" fill="${GL}" fill-opacity=".08" stroke="${GL}"/>`,
 matrix:`<rect x="14" y="6" width="72" height="24" rx="2" fill="none" stroke="${GD}"/><line x1="50" y1="6" x2="50" y2="30" stroke="${GD}"/><line x1="14" y1="18" x2="86" y2="18" stroke="${GD}"/><circle cx="68" cy="12" r="3.5" fill="${GA}"/>`,
 image:`<rect x="8" y="6" width="84" height="24" rx="2.5" fill="${GD}"/><path d="M8 30 L34 16 L48 23 L64 11 L92 30 Z" fill="${GA}" opacity=".35"/><circle cx="76" cy="12" r="3.5" fill="${GA}" opacity=".55"/>`,
 imagesplit:`<rect x="50" y="6" width="42" height="24" rx="2.5" fill="${GD}"/><path d="M50 30 L64 20 L74 25 L86 16 L92 19 L92 30 Z" fill="${GA}" opacity=".35"/><rect x="8" y="11" width="32" height="4" rx="2" fill="${GA}"/><rect x="8" y="18" width="34" height="3" rx="1.5" fill="${GL}"/><rect x="8" y="23" width="26" height="3" rx="1.5" fill="${GL}"/>`,
 video:`<rect x="8" y="6" width="84" height="24" rx="2.5" fill="${GD}"/><circle cx="50" cy="18" r="8" fill="none" stroke="${GA}" stroke-width="1.4"/><path d="M47 14 L54 18 L47 22 Z" fill="${GA}"/>`,
 gallery:`<rect x="8" y="9" width="26" height="18" rx="2" fill="${GD}"/><rect x="38" y="9" width="26" height="18" rx="2" fill="${GD}"/><rect x="68" y="9" width="26" height="18" rx="2" fill="${GD}"/><circle cx="14" cy="14" r="1.6" fill="${GA}"/>`,
 bignum:`<text x="8" y="29" font-size="30" font-weight="800" fill="${GA}">73</text><rect x="56" y="13" width="36" height="3.5" rx="1.5" fill="${GL}"/><rect x="56" y="20" width="28" height="3.5" rx="1.5" fill="${GL}"/>`,
 bento:`<rect x="8" y="7" width="40" height="22" rx="2.5" fill="${GA}" opacity=".5"/><rect x="52" y="7" width="18" height="10" rx="2" fill="${GL}"/><rect x="74" y="7" width="18" height="10" rx="2" fill="${GL}"/><rect x="52" y="19" width="40" height="10" rx="2" fill="${GL}"/>`,
 cycle:`<circle cx="50" cy="18" r="12" fill="none" stroke="${GD}" stroke-dasharray="2 2.5"/><circle cx="50" cy="6" r="3.4" fill="${GA}"/><circle cx="62" cy="18" r="3.4" fill="${GL}"/><circle cx="50" cy="30" r="3.4" fill="${GL}"/><circle cx="38" cy="18" r="3.4" fill="${GL}"/>`,
 pricing:`<rect x="8" y="9" width="24" height="20" rx="2" fill="none" stroke="${GL}"/><rect x="13" y="13" width="14" height="3" rx="1.5" fill="${GD}"/><rect x="38" y="6" width="24" height="24" rx="2" fill="none" stroke="${GA}" stroke-width="1.3"/><rect x="43" y="11" width="14" height="3.5" rx="1.5" fill="${GA}"/><rect x="68" y="9" width="24" height="20" rx="2" fill="none" stroke="${GL}"/><rect x="73" y="13" width="14" height="3" rx="1.5" fill="${GD}"/>`,
 line:`<polyline points="10,26 28,21 44,23 60,13 78,15 92,7" fill="none" stroke="${GA}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="26" r="1.8" fill="${GA}"/><circle cx="44" cy="23" r="1.8" fill="${GA}"/><circle cx="78" cy="15" r="1.8" fill="${GA}"/><circle cx="92" cy="7" r="1.8" fill="${GA}"/>`,
 proscons:`<rect x="8" y="8" width="38" height="22" rx="2" fill="none" stroke="${GA}" stroke-opacity=".6"/><path d="M14 18 l3 3 l6 -7" fill="none" stroke="${GA}" stroke-width="1.4" stroke-linecap="round"/><rect x="54" y="8" width="38" height="22" rx="2" fill="none" stroke="${GL}"/><path d="M62 15 l8 8 M70 15 l-8 8" stroke="${GL}" stroke-width="1.4" stroke-linecap="round"/>`,
 profile:`<circle cx="22" cy="13" r="7" fill="none" stroke="${GA}"/><rect x="13" y="24" width="18" height="2.6" rx="1.3" fill="${GL}"/><circle cx="50" cy="13" r="7" fill="none" stroke="${GL}"/><rect x="41" y="24" width="18" height="2.6" rx="1.3" fill="${GL}"/><circle cx="78" cy="13" r="7" fill="none" stroke="${GL}"/><rect x="69" y="24" width="18" height="2.6" rx="1.3" fill="${GL}"/>`,
 progress:`<rect x="8" y="7" width="22" height="2.6" rx="1.3" fill="${GL}"/><rect x="8" y="12" width="84" height="4" rx="2" fill="${GD}"/><rect x="8" y="12" width="62" height="4" rx="2" fill="${GA}"/><rect x="8" y="21" width="22" height="2.6" rx="1.3" fill="${GL}"/><rect x="8" y="26" width="84" height="4" rx="2" fill="${GD}"/><rect x="8" y="26" width="40" height="4" rx="2" fill="${GA}"/>`,
 logos:`<rect x="8" y="7" width="19" height="10" rx="2" fill="none" stroke="${GL}"/><rect x="30" y="7" width="19" height="10" rx="2" fill="none" stroke="${GL}"/><rect x="52" y="7" width="19" height="10" rx="2" fill="none" stroke="${GL}"/><rect x="74" y="7" width="19" height="10" rx="2" fill="none" stroke="${GL}"/><rect x="8" y="20" width="19" height="10" rx="2" fill="none" stroke="${GL}"/><rect x="30" y="20" width="19" height="10" rx="2" fill="none" stroke="${GL}"/><rect x="52" y="20" width="19" height="10" rx="2" fill="none" stroke="${GL}"/><rect x="74" y="20" width="19" height="10" rx="2" fill="none" stroke="${GL}"/>`,
 cta:`<rect x="22" y="9" width="56" height="5" rx="2" fill="${GL}"/><rect x="32" y="17" width="36" height="3" rx="1.5" fill="${GD}"/><rect x="36" y="23" width="28" height="8" rx="4" fill="${GA}"/>`,
 checklist:`<rect x="8" y="7" width="6.5" height="6.5" rx="1.5" fill="${GA}"/><rect x="20" y="8.5" width="52" height="3.5" rx="1.5" fill="${GL}"/><rect x="8" y="16" width="6.5" height="6.5" rx="1.5" fill="${GA}"/><rect x="20" y="17.5" width="44" height="3.5" rx="1.5" fill="${GL}"/><rect x="8" y="25" width="6.5" height="6.5" rx="1.5" fill="none" stroke="${GD}"/><rect x="20" y="26.5" width="48" height="3.5" rx="1.5" fill="${GD}"/>`
};
/* mapa tipo -> glyph */
GLYPH.threecol=`<rect x="8" y="9" width="24" height="3" rx="1.5" fill="${GA}"/><line x1="8" y1="15" x2="32" y2="15" stroke="${GD}"/><rect x="8" y="18" width="22" height="2.5" rx="1" fill="${GL}"/><rect x="8" y="23" width="20" height="2.5" rx="1" fill="${GL}"/><rect x="38" y="9" width="24" height="3" rx="1.5" fill="${GA}"/><line x1="38" y1="15" x2="62" y2="15" stroke="${GD}"/><rect x="38" y="18" width="22" height="2.5" rx="1" fill="${GL}"/><rect x="68" y="9" width="24" height="3" rx="1.5" fill="${GA}"/><line x1="68" y1="15" x2="92" y2="15" stroke="${GD}"/><rect x="68" y="18" width="20" height="2.5" rx="1" fill="${GL}"/>`;
GLYPH.splitstat=`<text x="8" y="27" font-size="24" font-weight="800" fill="${GA}">12h</text><rect x="56" y="10" width="34" height="3.5" rx="1.5" fill="${GL}"/><path d="M56 19 l2.5 2.5 l4 -4" fill="none" stroke="${GA}" stroke-width="1.2"/><rect x="64" y="19" width="26" height="2.5" rx="1" fill="${GL}"/><path d="M56 26 l2.5 2.5 l4 -4" fill="none" stroke="${GA}" stroke-width="1.2"/><rect x="64" y="26" width="22" height="2.5" rx="1" fill="${GL}"/>`;
GLYPH.banner=`<rect x="8" y="9" width="24" height="2.6" rx="1.3" fill="${GA}"/><rect x="8" y="15" width="64" height="7" rx="2" fill="${GL}"/><rect x="8" y="25" width="40" height="3" rx="1.5" fill="${GD}"/>`;
GLYPH.stack=`<rect x="10" y="8" width="58" height="6" rx="1.5" fill="${GA}"/><rect x="74" y="8" width="18" height="6" rx="1.5" fill="${GD}"/><rect x="10" y="16" width="58" height="6" rx="1.5" fill="${GL}"/><rect x="74" y="16" width="18" height="6" rx="1.5" fill="${GD}"/><rect x="10" y="24" width="58" height="6" rx="1.5" fill="${GL}"/><rect x="74" y="24" width="18" height="6" rx="1.5" fill="${GD}"/>`;
GLYPH.compare=`<rect x="8" y="8" width="38" height="22" rx="2" fill="none" stroke="${GL}"/><text x="27" y="23" font-size="13" font-weight="800" fill="${GL}" text-anchor="middle">A</text><rect x="54" y="8" width="38" height="22" rx="2" fill="none" stroke="${GA}"/><text x="73" y="23" font-size="13" font-weight="800" fill="${GA}" text-anchor="middle">B</text>`;
GLYPH.seq=`<text x="10" y="11" font-size="6" font-weight="800" fill="${GA}">1</text><rect x="18" y="6.5" width="46" height="3.5" rx="1.5" fill="${GL}"/><rect x="80" y="6.5" width="12" height="3.5" rx="1.5" fill="${GD}"/><text x="10" y="20" font-size="6" font-weight="800" fill="${GA}">2</text><rect x="18" y="15.5" width="46" height="3.5" rx="1.5" fill="${GL}"/><rect x="80" y="15.5" width="12" height="3.5" rx="1.5" fill="${GD}"/><text x="10" y="29" font-size="6" font-weight="800" fill="${GA}">3</text><rect x="18" y="24.5" width="46" height="3.5" rx="1.5" fill="${GL}"/><rect x="80" y="24.5" width="12" height="3.5" rx="1.5" fill="${GD}"/>`;
GLYPH.fmatrix=`<rect x="8" y="7" width="84" height="6" rx="1.5" fill="${GD}"/><line x1="50" y1="7" x2="50" y2="30" stroke="${GD}"/><line x1="71" y1="7" x2="71" y2="30" stroke="${GD}"/><rect x="12" y="17" width="24" height="2.5" rx="1" fill="${GL}"/><path d="M58 18 l2 2 l3.5 -4" fill="none" stroke="${GA}" stroke-width="1.3"/><path d="M79 18 l2 2 l3.5 -4" fill="none" stroke="${GA}" stroke-width="1.3"/><rect x="12" y="24" width="24" height="2.5" rx="1" fill="${GL}"/><path d="M58 25 l2 2 l3.5 -4" fill="none" stroke="${GA}" stroke-width="1.3"/></text>`;
const TG={cover:'cover',statement:'statement',divider:'divider',agenda:'agenda',quote:'quote',quotecard:'quotecard',cta:'cta',
 cards:'cards',icongrid:'icongrid',twocol:'twocol',steps:'steps',layers:'layers',qlist:'qlist',feat:'list',callout:'callout',hlbox:'callout',bento:'bento',profile:'profile',proscons:'proscons',checklist:'checklist',logos:'logos',
 statrow:'statrow',kpi:'kpi',table:'table',compare:'compare',shift:'shift',seq:'seq',flow:'flow',bignum:'bignum',barchart:'bars',fmatrix:'fmatrix',pricing:'pricing',progress:'progress',linechart:'line',
 pyramid:'pyramid',donut:'donut',gauge:'gauge',hbar:'hbars',timeline:'timeline',funnel:'funnel',stack:'stack',venn:'venn',matrix:'matrix',cycle:'cycle',vtimeline:'vtimeline',
 imagefull:'image',imagesplit:'imagesplit',video:'video',gallery:'gallery',threecol:'threecol',splitstat:'splitstat',banner:'banner',
 stackbar:'bars',areachart:'line',waterfall:'bars',orgchart:'flow',swimlane:'table',gantt:'hbars',
 coverimg:'image',agendaprog:'agenda',thanks:'cta',device:'imagesplit',compareimg:'gallery',statimg:'image'};
function thumb(id){const g=GLYPH[TG[id]||'list']||GLYPH.list;return `<svg viewBox="0 0 100 36" class="thmb" preserveAspectRatio="xMidYMid meet">${g}</svg>`;}

/* ===== galería (colapsable + buscador) ===== */
let galQuery='';
let collapsed={};
function renderGallery(){
  const g=$('gallery');g.innerHTML='';
  const q=galQuery.trim().toLowerCase();
  let shown=0;
  GROUPS.forEach(grp=>{
    let items=Object.entries(TYPES).filter(([,t])=>t.group===grp);
    if(q)items=items.filter(([id,t])=>(t.label+' '+t.desc+' '+id).toLowerCase().includes(q));
    if(!items.length)return;
    const open=q?true:!collapsed[grp];
    const h=document.createElement('button');h.className='ggroup acc'+(open?' open':'');
    h.innerHTML=`<span class="caret">▸</span><span class="gn">${grp}</span><span class="gcount">${items.length}</span>`;
    if(!q)h.onclick=()=>{collapsed[grp]=!collapsed[grp];save();renderGallery();};
    g.appendChild(h);
    if(open){items.forEach(([id,t])=>{
      const b=document.createElement('button');b.className='tcard';
      const lbl=q?t.label.replace(new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>'):t.label;
      b.innerHTML=`<div class="thmbwrap">${thumb(id)}</div><div class="tmeta"><div class="tn">${lbl}</div><div class="td">${t.desc}</div></div>`;
      b.onclick=()=>addSlide(id);g.appendChild(b);shown++;
    });}else{shown+=items.length;}
  });
  if(q&&shown===0)g.innerHTML='<div class="gnores">Ningún tipo coincide con “'+esc(galQuery)+'”.</div>';
}
function addSlide(id){deck.slides.push({id:uid++,type:id,data:structuredClone(TYPES[id].sample)});sel=deck.slides.length-1;syncAll();save();commit();toast('Slide añadida');}

/* ===== filmstrip ===== */
function renderFilm(){
  const f=$('film');f.innerHTML='';
  deck.slides.forEach((s,i)=>{
    const t=TYPES[s.type];
    const title=(s.data.title||s.data.text||s.data.big||s.data.eyebrow||t.label).replace(/<[^>]+>/g,'');
    const d=document.createElement('div');d.className='slip'+(i===sel?' on':'');d.draggable=true;
    d.innerHTML=`<div class="lab"><div class="i">${String(i+1).padStart(2,'0')} · ${t.label}</div><div class="t">${title}</div></div><button class="x">×</button>`;
    d.onclick=e=>{if(e.target.classList.contains('x'))delSlide(i);else{sel=i;syncAll();}};
    d.ondragstart=e=>e.dataTransfer.setData('i',i);
    d.ondragover=e=>e.preventDefault();
    d.ondrop=e=>{e.preventDefault();const from=+e.dataTransfer.getData('i');const m=deck.slides.splice(from,1)[0];deck.slides.splice(i,0,m);sel=i;syncAll();save();commit();};
    f.appendChild(d);
  });
}
function delSlide(i){deck.slides.splice(i,1);if(sel>=deck.slides.length)sel=deck.slides.length-1;syncAll();save();commit();}

/* ===== preview ===== */
let pvTimer=null;
function renderPreview(){
  const fw=$('frameWrap'),es=$('emptyState');
  if(sel<0||!deck.slides[sel]){fw.style.display='none';es.style.display='block';return;}
  fw.style.display='block';es.style.display='none';
  clearTimeout(pvTimer);pvTimer=setTimeout(()=>{$('preview').srcdoc=previewDoc(deck.slides[sel]);},140);
}

/* ===== formulario ===== */
function renderForm(){
  const wrap=$('form');
  if(sel<0||!deck.slides[sel]){wrap.innerHTML='<div class="fempty">Ninguna slide seleccionada.<br>Añade una desde la izquierda.</div>';$('formTitle').textContent='Editor';$('btnDup').style.display='none';return;}
  const s=deck.slides[sel],t=TYPES[s.type];
  $('formTitle').textContent=t.label;$('btnDup').style.display='inline-flex';
  wrap.innerHTML='';
  t.fields.forEach(f=>wrap.appendChild(fieldEl(f,s.data)));
  wrap.appendChild(extrasSection(s.data,s.type));
  const del=document.createElement('button');del.className='delslide';del.textContent='Eliminar esta slide';del.onclick=()=>delSlide(sel);wrap.appendChild(del);
}
const FLIPPABLE=['twocol','compare','proscons','quotecard','splitstat'];
function extrasSection(data,typeId){
  const wrap=document.createElement('div');wrap.className='extras';
  const open=!!(data._flip||data._bg||data._badge||data._foot||data._side||data._wm);
  const h=document.createElement('button');h.className='extras-h'+(open?' open':'');
  h.innerHTML='<span class="caret">▸</span>Variantes y elementos extra';
  const body=document.createElement('div');body.className='extras-body';body.style.display=open?'block':'none';
  h.onclick=()=>{const o=body.style.display==='none';body.style.display=o?'block':'none';h.classList.toggle('open',o);};
  wrap.appendChild(h);wrap.appendChild(body);
  // invertir (solo en tipos de 2 columnas)
  if(FLIPPABLE.includes(typeId)){
    const fl=document.createElement('label');fl.className='exrow';
    const cb=document.createElement('input');cb.type='checkbox';cb.checked=!!data._flip;cb.onchange=()=>{data._flip=cb.checked;onEdit();};
    fl.appendChild(cb);fl.appendChild(document.createTextNode('Invertir disposición (izquierda ⇄ derecha)'));body.appendChild(fl);
  }
  // imagen de fondo
  const bgf=document.createElement('div');bgf.className='field';bgf.innerHTML='<label>Imagen de fondo</label>';
  bgf.appendChild(imgControl(()=>data._bg||'',v=>{data._bg=v;}));
  if(data._bg){const clr=document.createElement('button');clr.className='additem';clr.textContent='Quitar fondo';clr.onclick=()=>{data._bg='';onEdit();renderForm();};bgf.appendChild(clr);}
  body.appendChild(bgf);
  // badge + posición
  const bf=document.createElement('div');bf.className='field';bf.innerHTML='<label>Badge / etiqueta de esquina</label>';
  const bi=document.createElement('input');bi.type='text';bi.placeholder='p.ej. NUEVO, Confidencial…';bi.value=data._badge||'';bi.oninput=()=>{data._badge=bi.value;onEdit();};bf.appendChild(bi);
  const bp=document.createElement('div');bp.className='exseg';['tr','tl','br','bl'].forEach(p=>{const b=document.createElement('button');b.textContent=p.toUpperCase();b.className=(data._badgePos||'tr')===p?'on':'';b.onclick=()=>{data._badgePos=p;[...bp.children].forEach(c=>c.classList.remove('on'));b.classList.add('on');onEdit();};bp.appendChild(b);});bf.appendChild(bp);
  body.appendChild(bf);
  // pie
  body.appendChild(simpleField('Pie / fuente',data._foot||'',v=>{data._foot=v;}));
  // etiqueta lateral
  body.appendChild(simpleField('Etiqueta lateral (vertical)',data._side||'',v=>{data._side=v;}));
  // watermark
  body.appendChild(simpleField('Watermark (texto de fondo)',data._wm||'',v=>{data._wm=v;}));
  return wrap;
}
function simpleField(label,val,on){const w=document.createElement('div');w.className='field';const l=document.createElement('label');l.textContent=label;w.appendChild(l);const i=document.createElement('input');i.type='text';i.value=val;i.oninput=()=>{on(i.value);onEdit();};w.appendChild(i);return w;}
function inputFor(t,val,on){
  if(t==='area'){const e=document.createElement('textarea');e.value=val||'';e.oninput=()=>on(e.value);return e;}
  const e=document.createElement('input');e.type='text';e.value=val||'';e.oninput=()=>on(e.value);return e;
}
function rangeFor(val,on,min,max,step){const w=document.createElement('div');w.className='rangewrap';const r=document.createElement('input');r.type='range';r.min=min!=null?min:0;r.max=max!=null?max:100;r.step=step||1;r.value=val||0;const o=document.createElement('span');o.className='rangeval';o.textContent=r.value;r.oninput=()=>{o.textContent=r.value;on(r.value);};w.appendChild(r);w.appendChild(o);return w;}
const SWATCH={mint:'#9ED9C4',lime:'#D7FF63',blue:'#A9C7FF',coral:'#FF8F70',gold:'#E9C46A',purple:'#C9B6FF',hot:'#9ED9C4',alt:'#A9C7FF',warn:'#FF8F70',green:'#9ED9C4'};
function swatchFor(opts,val,on){const w=document.createElement('div');w.className='swatchwrap';opts.forEach(o=>{const s=document.createElement('button');s.className='sw'+((val||opts[0])===o?' on':'');s.title=o;s.style.background=SWATCH[o]||o;s.onclick=()=>{[...w.children].forEach(c=>c.classList.remove('on'));s.classList.add('on');on(o);};w.appendChild(s);});return w;}
function imgControl(getV,setV){const w=document.createElement('div');w.className='imgsub';
  const row=document.createElement('div');row.className='imgrow';
  const u=document.createElement('input');u.type='text';u.placeholder='URL o sube';u.value=(getV()&&getV().startsWith('data:'))?'(imagen · '+fmtKB(dataBytes(getV()))+')':(getV()||'');u.oninput=()=>{setV(u.value);onEdit();};
  const up=document.createElement('label');up.className='imgup';up.textContent='⬆';
  const f=document.createElement('input');f.type='file';f.accept='image/*';f.hidden=true;
  f.onchange=async e=>{const fl=e.target.files[0];if(!fl)return;up.textContent='…';const ou=URL.createObjectURL(fl);let r;try{r=await optimizeImage(ou,1600,.82);}catch(_){r=await new Promise(rs=>{const fr=new FileReader();fr.onload=()=>rs(fr.result);fr.readAsDataURL(fl);});}URL.revokeObjectURL(ou);up.textContent='⬆';setV(r);onEdit();renderForm();};
  up.appendChild(f);row.appendChild(u);row.appendChild(up);w.appendChild(row);
  if(getV()&&getV().startsWith('data:')){const p=document.createElement('img');p.className='imgthumb';p.src=getV();w.appendChild(p);}
  return w;}
function selFor(opts,val,on){const e=document.createElement('select');opts.forEach(o=>{const op=document.createElement('option');op.value=o;op.textContent=o;if((val||opts[0])===o)op.selected=true;e.appendChild(op);});e.onchange=()=>on(e.value);return e;}
function iconPicker(val,on){
  const w=document.createElement('div');w.className='iconpick';
  ICONS.forEach(n=>{const b=document.createElement('button');b.className='ip'+(val===n?' on':'');b.innerHTML=`<svg class="ico"><use href="#${n}"/></svg>`;b.title=n;b.onclick=()=>{on(n);[...w.children].forEach(c=>c.classList.remove('on'));b.classList.add('on');};w.appendChild(b);});
  return w;
}
function mediaField(f,data){
  const w=document.createElement('div');w.className='field';
  const lab=document.createElement('label');lab.textContent=f.l;w.appendChild(lab);
  const m=data[f.k]||(data[f.k]={kind:f.kind,src:''});
  const url=document.createElement('input');url.type='text';url.placeholder=f.kind==='video'?'URL de YouTube/Vimeo/MP4':'URL de imagen, o sube un archivo';
  url.value=m.src&&m.src.startsWith('data:')?('(imagen embebida · '+fmtKB(dataBytes(m.src))+')'):(m.src||'');
  url.oninput=()=>{m.src=url.value;onEdit();};
  w.appendChild(url);
  if(f.kind==='image'){
    const up=document.createElement('label');up.className='uploadbtn';up.textContent='⬆ Subir y optimizar';
    const file=document.createElement('input');file.type='file';file.accept='image/*';file.hidden=true;
    file.onchange=async e=>{const fl=e.target.files[0];if(!fl)return;up.textContent='Optimizando…';const ou=URL.createObjectURL(fl);try{m.src=await optimizeImage(ou,1920,.82);}catch(_){m.src=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(fl);});}URL.revokeObjectURL(ou);up.textContent='⬆ Subir y optimizar';onEdit();renderForm();toast('Imagen · '+fmtKB(dataBytes(m.src)));};
    up.appendChild(file);w.appendChild(up);
    if(m.src&&m.src.startsWith('data:')){const pv=document.createElement('div');pv.className='mediaprev';pv.innerHTML=`<img src="${m.src}" alt=""><button class="mclr" title="Quitar">×</button>`;pv.querySelector('.mclr').onclick=()=>{m.src='';onEdit();renderForm();};w.appendChild(pv);}
    const h=document.createElement('div');h.className='hint';h.textContent='Las imágenes se redimensionan a 1920px y se comprimen en WebP antes de incrustarse: deck portátil y ligero.';w.appendChild(h);
  }
  return w;
}
function fieldEl(f,data){
  if(f.t==='media')return mediaField(f,data);
  const w=document.createElement('div');w.className='field';
  const lab=document.createElement('label');lab.textContent=f.l;w.appendChild(lab);
  if(f.t==='text'||f.t==='area'){w.appendChild(inputFor(f.t,data[f.k],v=>{data[f.k]=v;onEdit();}));}
  else if(f.t==='sel'){w.appendChild(selFor(f.opts,data[f.k],v=>{data[f.k]=v;onEdit();}));}
  else if(f.t==='range'){w.appendChild(rangeFor(data[f.k],v=>{data[f.k]=v;onEdit();},f.min,f.max,f.step));}
  else if(f.t==='swatch'){w.appendChild(swatchFor(f.opts,data[f.k],v=>{data[f.k]=v;onEdit();}));}
  else if(f.t==='list'){
    const box=document.createElement('div');box.className='items';
    (data[f.k]||[]).forEach((v,i)=>{const it=document.createElement('div');it.className='item';const ih=document.createElement('div');ih.className='ih';ih.innerHTML=`<span>#${i+1}</span>`;const rm=document.createElement('button');rm.textContent='×';rm.onclick=()=>{data[f.k].splice(i,1);onEdit();renderForm();};ih.appendChild(rm);it.appendChild(ih);const ta=document.createElement('textarea');ta.value=v;ta.oninput=()=>{data[f.k][i]=ta.value;onEdit();};it.appendChild(ta);box.appendChild(it);});
    w.appendChild(box);const add=document.createElement('button');add.className='additem';add.textContent='+ añadir';if(f.max&&(data[f.k]||[]).length>=f.max){add.disabled=true;add.textContent='Máximo '+f.max;add.classList.add('maxed');}add.onclick=()=>{(data[f.k]=data[f.k]||[]).push('');onEdit();renderForm();};w.appendChild(add);
  }else if(f.t==='items'){
    const box=document.createElement('div');box.className='items';
    (data[f.k]||[]).forEach((obj,i)=>{const it=document.createElement('div');it.className='item';const ih=document.createElement('div');ih.className='ih';ih.innerHTML=`<span>#${i+1}</span>`;const rm=document.createElement('button');rm.textContent='×';rm.onclick=()=>{data[f.k].splice(i,1);onEdit();renderForm();};ih.appendChild(rm);it.appendChild(ih);
      f.sub.forEach(sf=>{const sw=document.createElement('div');sw.className='sub';const sl=document.createElement('label');sl.textContent=sf.l;sw.appendChild(sl);
        if(sf.t==='sel')sw.appendChild(selFor(sf.opts,obj[sf.k],v=>{obj[sf.k]=v;onEdit();}));
        else if(sf.t==='range')sw.appendChild(rangeFor(obj[sf.k],v=>{obj[sf.k]=v;onEdit();},sf.min,sf.max,sf.step));
        else if(sf.t==='swatch')sw.appendChild(swatchFor(sf.opts,obj[sf.k],v=>{obj[sf.k]=v;onEdit();}));
        else if(sf.t==='icon')sw.appendChild(iconPicker(obj[sf.k],v=>{obj[sf.k]=v;onEdit();}));
        else if(sf.t==='img')sw.appendChild(imgControl(()=>obj[sf.k],v=>{obj[sf.k]=v;}));
        else sw.appendChild(inputFor(sf.t==='area'?'area':'text',obj[sf.k],v=>{obj[sf.k]=v;onEdit();}));
        it.appendChild(sw);});
      box.appendChild(it);});
    w.appendChild(box);const add=document.createElement('button');add.className='additem';add.textContent='+ añadir';if(f.max&&(data[f.k]||[]).length>=f.max){add.disabled=true;add.textContent='Máximo '+f.max;add.classList.add('maxed');}add.onclick=()=>{const o={};f.sub.forEach(sf=>o[sf.k]=(sf.t==='sel'||sf.t==='swatch')?sf.opts[0]:(sf.t==='icon'?'i-bolt':(sf.t==='range'?(sf.def!=null?sf.def:50):'')));(data[f.k]=data[f.k]||[]).push(o);onEdit();renderForm();};w.appendChild(add);
  }else if(f.t==='icon'){w.appendChild(iconPicker(data[f.k],v=>{data[f.k]=v;onEdit();}));}
  if(f.hint){const h=document.createElement('div');h.className='hint';h.innerHTML=f.hint;w.appendChild(h);}
  return w;
}
function onEdit(){renderPreview();renderFilm();updateWeight();save();commitSoon();}
function syncAll(){renderFilm();renderForm();renderPreview();updateWeight();}

/* ===== panel de marca ===== */
function renderBrandPanel(){
  const fonts=Object.entries(FONTS).map(([k,v])=>`<option value="${k}"${brand.font===k?' selected':''}>${v.label}</option>`).join('');
  $('brandBody').innerHTML=`
    <div class="bf"><label>Acento principal</label><input type="color" id="bAcc" value="${brand.accent}"></div>
    <div class="bf"><label>Acento secundario</label><input type="color" id="bAcc2" value="${brand.accent2}"></div>
    <div class="bf"><label>Fondo base</label><input type="color" id="bInk" value="${brand.ink}"></div>
    <div class="bf"><label>Texto</label><input type="color" id="bPaper" value="${brand.paper}"></div>
    <div class="bf wide"><label>Tipografía</label><select id="bFont">${fonts}</select></div>
    <div class="bf wide"><label>Logo principal (URL o subir)</label><input type="text" id="bLogo" placeholder="URL del logo" value="${brand.logo&&!brand.logo.startsWith('data:')?brand.logo:''}"><label class="uploadbtn sm">⬆ Subir<input type="file" id="bLogoF" accept="image/*" hidden></label></div>
    <div class="bf wide"><label>Coibranding · logo cliente (URL, dato o texto)</label><input type="text" id="bCli" placeholder="URL, o texto p.ej. KPMG" value="${brand.clientLogo&&!brand.clientLogo.startsWith('data:')?brand.clientLogo:''}"><label class="uploadbtn sm">⬆ Subir<input type="file" id="bCliF" accept="image/*" hidden></label></div>
    <div class="bf wide"><button class="btn ghost sm" id="bReset">↺ Restablecer marca thePower</button></div>`;
  const upd=()=>{renderPreview();save();commitSoon();updateContrast();};
  $('bAcc').oninput=e=>{brand.accent=e.target.value;upd();};
  $('bAcc2').oninput=e=>{brand.accent2=e.target.value;upd();};
  $('bInk').oninput=e=>{brand.ink=e.target.value;upd();};
  $('bPaper').oninput=e=>{brand.paper=e.target.value;upd();};
  $('bFont').onchange=e=>{brand.font=e.target.value;upd();};
  $('bLogo').oninput=e=>{brand.logo=e.target.value;upd();};
  $('bCli').oninput=e=>{brand.clientLogo=e.target.value;upd();};
  $('bLogoF').onchange=e=>{const fl=e.target.files[0];if(!fl)return;const r=new FileReader();r.onload=()=>{brand.logo=r.result;toast('Logo cargado');upd();};r.readAsDataURL(fl);};
  $('bCliF').onchange=e=>{const fl=e.target.files[0];if(!fl)return;const r=new FileReader();r.onload=()=>{brand.clientLogo=r.result;toast('Logo cliente cargado');upd();};r.readAsDataURL(fl);};
  $('bReset').onclick=()=>{brand={accent:'#9ED9C4',accent2:'#D7FF63',ink:'#0B1F22',paper:'#F7F4EC',font:'grotesk',logo:'',clientLogo:'',clientName:''};renderBrandPanel();renderPreview();save();commit();toast('Marca restablecida');};
  updateContrast();
}

function updateContrast(){const el=$('contrastWarn');if(!el)return;const ct=contrast(brand.paper,brand.ink),ca=contrast(brand.accent,brand.ink);let msgs=[];if(ct<4.5)msgs.push('texto/fondo '+ct.toFixed(1)+':1 (mín. 4.5)');if(ca<3)msgs.push('acento/fondo '+ca.toFixed(1)+':1 (mín. 3)');if(msgs.length){el.style.display='block';el.innerHTML='⚠ Contraste bajo: '+msgs.join(' · ')+'. Puede ser difícil de leer.';}else{el.style.display='none';}}

/* ===== export ===== */
function download(name,html){const b=new Blob([html],{type:'text/html'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=name;a.click();URL.revokeObjectURL(u);}
function slug(s){return (s||'deck').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
// paleta base de cada tema: al elegir un tema se vuelca en la marca (que es la fuente de
// verdad y siempre gana en el render). Así el botón de tema cambia colores visibles y, a la
// vez, los selectores de marca pueden ajustarlos después.
const THEME_PALETTES={
  '':{accent:'#9ED9C4',accent2:'#D7FF63',ink:'#0B1F22',paper:'#F7F4EC',font:'grotesk'},
  editorial:{accent:'#c8f04a',accent2:'#86a52e',ink:'#0c0d11',paper:'#ece6da',font:'fraunces'}
};
function setTheme(th){
  deck.theme=th;
  const p=THEME_PALETTES[th];
  if(p)brand=Object.assign(brand,{accent:p.accent,accent2:p.accent2,ink:p.ink,paper:p.paper,font:p.font});
  [...$('themeSel').children].forEach(b=>b.classList.toggle('on',(b.dataset.th||'')===th));
  renderBrandPanel();renderPreview();save();commit();
}

/* ===== eventos ===== */
$('btnUndo').onclick=undo;$('btnRedo').onclick=redo;
$('btnTpl').onclick=openTemplates;
$('btnExportProj').onclick=exportProject;
$('btnPptx').onclick=()=>{$('exportMenu').classList.remove('open');exportPPTX();};
$('btnExport').onclick=e=>{e.stopPropagation();$('exportMenu').classList.toggle('open');};
document.addEventListener('click',e=>{if(!e.target.closest('.exportwrap'))$('exportMenu').classList.remove('open');});
$('btnImportProj').onclick=()=>$('importProjFile').click();
$('importProjFile').onchange=e=>{const f=e.target.files[0];if(f)importProject(f);e.target.value='';};
$('deckTitle').oninput=e=>{deck.title=e.target.value;save();};
$('themeSel').onclick=e=>{if(e.target.dataset.th!==undefined)setTheme(e.target.dataset.th||'');};
$('btnDeck').onclick=()=>{$('exportMenu').classList.remove('open');if(!deck.slides.length){toast('Añade alguna slide');return;}download(slug(deck.title)+'.html',deckDoc());};
$('btnSlide').onclick=()=>{if(sel<0){toast('Selecciona una slide');return;}download(slug(deck.title)+'-slide-'+(sel+1)+'.html',previewDoc(deck.slides[sel]));};
$('btnPreview').onclick=()=>{if(!deck.slides.length){toast('Añade alguna slide');return;}const w=window.open();w.document.write(deckDoc());w.document.close();};
$('btnDup').onclick=()=>{if(sel<0)return;deck.slides.splice(sel+1,0,{id:uid++,type:deck.slides[sel].type,data:structuredClone(deck.slides[sel].data)});sel++;syncAll();save();commit();toast('Duplicada');};
$('btnBrand').onclick=()=>{$('brandPanel').classList.toggle('open');};
$('brandClose').onclick=()=>$('brandPanel').classList.remove('open');

/* ===== optimización de imágenes ===== */
function optimizeImage(srcUrl,maxW,q){maxW=maxW||1920;q=q||0.82;return new Promise((resolve,reject)=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{const nw=img.naturalWidth||maxW,nh=img.naturalHeight||maxW;const sc=Math.min(1,maxW/nw);const w=Math.max(1,Math.round(nw*sc)),h=Math.max(1,Math.round(nh*sc));const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);let out;try{out=c.toDataURL('image/webp',q);if(out.indexOf('image/webp')<0)out=c.toDataURL('image/jpeg',q);}catch(e){return reject(e);}resolve(out);};img.onerror=()=>reject(new Error('load'));img.src=srcUrl;});}
function dataBytes(s){if(!s||s.indexOf('data:')!==0)return 0;const i=s.indexOf(',');return Math.round((s.length-i-1)*0.75);}
function fmtKB(b){return b>=1048576?(b/1048576).toFixed(1)+' MB':Math.max(1,Math.round(b/1024))+' KB';}
function deckWeight(){let t=0;deck.slides.forEach(s=>{const m=s.data&&s.data.media;if(m&&m.src)t+=dataBytes(m.src);});return t;}
function updateWeight(){const el=$('weight');if(!el)return;const w=deckWeight();el.textContent=w?('⛁ '+fmtKB(w)):'';}

/* ===== historial (deshacer/rehacer) ===== */
let history=[],hidx=-1,histTimer=null,restoring=false;
function snap(){return JSON.stringify({deck,brand});}
function pushHist(){if(restoring)return;history=history.slice(0,hidx+1);history.push(snap());if(history.length>80)history.shift();hidx=history.length-1;updateUndo();}
function commit(){clearTimeout(histTimer);pushHist();}
function commitSoon(){clearTimeout(histTimer);histTimer=setTimeout(pushHist,650);}
function applyState(s){const o=JSON.parse(s);deck=o.deck;brand=Object.assign({accent:'#9ED9C4',accent2:'#D7FF63',ink:'#0B1F22',paper:'#F7F4EC',font:'grotesk',logo:'',clientLogo:'',clientName:''},o.brand);if(sel>=deck.slides.length)sel=deck.slides.length-1;}
function undo(){if(hidx<=0)return;clearTimeout(histTimer);restoring=true;hidx--;applyState(history[hidx]);$('deckTitle').value=deck.title;setThemeBtns();syncAll();renderBrandPanel();save();updateUndo();restoring=false;}
function redo(){if(hidx>=history.length-1)return;clearTimeout(histTimer);restoring=true;hidx++;applyState(history[hidx]);$('deckTitle').value=deck.title;setThemeBtns();syncAll();renderBrandPanel();save();updateUndo();restoring=false;}
function updateUndo(){const u=$('btnUndo'),r=$('btnRedo');if(u)u.disabled=hidx<=0;if(r)r.disabled=hidx>=history.length-1;}
function setThemeBtns(){[...$('themeSel').children].forEach(b=>b.classList.toggle('on',(b.dataset.th||'')===deck.theme));}

/* ===== guardar / cargar proyecto (.json) ===== */
function exportProject(){const blob={v:1,deck,brand};download(slug(deck.title)+'.tpdeck.json',JSON.stringify(blob,null,1));toast('Proyecto guardado');}
function importProject(file){const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!o.deck)throw 0;deck=o.deck;brand=Object.assign(brand,o.brand||{});sel=deck.slides.length?0:-1;$('deckTitle').value=deck.title;setThemeBtns();renderBrandPanel();syncAll();commit();save();toast('Proyecto cargado');}catch(e){toast('Archivo no válido');}};r.readAsText(file);}

/* ===== plantillas de partida ===== */
const TEMPLATES=[
 {name:'Propuesta comercial',desc:'Portada → reto → solución → programa → precio → cierre',ids:['cover','statement','twocol','icongrid','steps','pricing','cta']},
 {name:'Keynote',desc:'Apertura → tesis → dato → secciones → cierre',ids:['cover','quote','bignum','divider','cards','statement']},
 {name:'Resultados / QBR',desc:'Portada → KPIs → progreso → roadmap → siguientes pasos',ids:['cover','kpi','progress','timeline','checklist','cta']},
 {name:'Programa de formación',desc:'Portada → objetivos → itinerario → equipo → cierre',ids:['cover','icongrid','seq','profile','cta']}
];
function openTemplates(){const m=$('tplModal');m.classList.add('open');const g=$('tplGrid');g.innerHTML='';TEMPLATES.forEach((t,i)=>{const c=document.createElement('button');c.className='tplcard';c.innerHTML=`<div class="tpln">${t.name}</div><div class="tpld">${t.desc}</div><div class="tplc">${t.ids.length} slides</div>`;c.onclick=()=>useTemplate(i);g.appendChild(c);});}
function useTemplate(i){const t=TEMPLATES[i];if(deck.slides.length&&!confirm('Esto reemplaza el deck actual. ¿Continuar?'))return;deck={title:t.name,theme:'',slides:t.ids.map(id=>({id:uid++,type:id,data:structuredClone(TYPES[id].sample)}))};sel=0;$('deckTitle').value=deck.title;setThemeBtns();$('tplModal').classList.remove('open');syncAll();commit();save();toast('Plantilla cargada');}
$('tplClose').onclick=()=>$('tplModal').classList.remove('open');
$('tplModal').addEventListener('click',e=>{if(e.target.id==='tplModal')$('tplModal').classList.remove('open');});

/* ===== contraste WCAG ===== */
function _lin(c){c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4);}
function lum(hex){let h=hex.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return .2126*_lin(r)+.7152*_lin(g)+.0722*_lin(b);}
function contrast(a,b){const L1=lum(a),L2=lum(b);return ((Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05));}

/* ===== init ===== */
load();
if(!Object.keys(collapsed).length){GROUPS.slice(1).forEach(grp=>collapsed[grp]=true);}
$('galQ').addEventListener('input',e=>{galQuery=e.target.value;renderGallery();});
const MAXES={cards:4,icongrid:6,kpi:4,statrow:3,steps:5,layers:5,donut:4,bento:6,profile:5,pricing:4,barchart:8,progress:6,linechart:8,vtimeline:6,checklist:8,cycle:6,flow:5,gallery:4,threecol:3,logos:12,seq:6};
Object.entries(MAXES).forEach(([t,n])=>{if(TYPES[t])TYPES[t].fields.forEach(f=>{if(f.t==='items')f.max=n;});});
renderGallery();renderBrandPanel();syncAll();pushHist();updateContrast();
window.addEventListener('keydown',e=>{
  const mod=e.ctrlKey||e.metaKey;
  if(mod&&(e.key==='z'||e.key==='Z')){e.preventDefault();if(e.shiftKey)redo();else undo();return;}
  if(mod&&(e.key==='y'||e.key==='Y')){e.preventDefault();redo();return;}
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  if(sel<0)return;
  if(e.key==='ArrowDown'&&sel<deck.slides.length-1){sel++;syncAll();}
  if(e.key==='ArrowUp'&&sel>0){sel--;syncAll();}
});

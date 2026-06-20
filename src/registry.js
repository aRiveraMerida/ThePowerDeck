/* ===== inventario de iconos (del motor) ===== */
const ICONS="__ICONS__".split(',');

/* ===== helpers ===== */
const esc=s=>{if(s==null)return'';let e=String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');e=e.replace(/&lt;(\/?)(b|strong|i|em|small|sup|sub|u|br|span)((?:\s+(?:class|style)=&quot;[^&"<>]*&quot;)*)\s*(\/?)\s*&gt;/gi,(m,c,t,a,sc)=>{a=a.replace(/&quot;/g,'"');if(/(?:javascript:|expression\(|url\()/i.test(a))a='';return '<'+c+t+a+(sc||'')+'>';});return e;};
const colorClass=c=>c&&c!=='mint'?c:'';
const ringClass=c=>({lime:'lime',blue:'blue',coral:'coral'})[c]||'';
const ic=n=>`<svg class="ico lg"><use href="#${n||'i-bolt'}"/></svg>`;
function mediaTag(d,opt){
  opt=opt||{};
  const kb=opt.anim==='ken'?' class="kenburns"':'';
  if(!d||!d.src) return '<div style="position:absolute;inset:0;display:grid;place-items:center;color:var(--muted);font-family:var(--mono);font-size:1.9cqh;background:repeating-linear-gradient(45deg,rgba(247,244,236,.02),rgba(247,244,236,.02) 14px,transparent 14px,transparent 28px)"><span style="opacity:.6">sin imagen — busca en banco o sube una</span></div>';
  if(d.kind==='video'){
    let u=d.src;const bg=opt.bg;
    const yt=u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
    const vm=u.match(/vimeo\.com\/(\d+)/)||u.match(/player\.vimeo\.com\/video\/(\d+)/);
    if(yt){u=`https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`+(bg?`&autoplay=1&mute=1&loop=1&controls=0&playlist=${yt[1]}`:'');return `<div class="video-wrap">${bg?'<div style="position:absolute;inset:0;z-index:3"></div>':''}<iframe src="${esc(u)}" allow="autoplay; fullscreen" allowfullscreen></iframe></div>`;}
    if(vm){u=`https://player.vimeo.com/video/${vm[1]}`+(bg?'?background=1&autoplay=1&muted=1&loop=1':'?title=0&byline=0&portrait=0');return `<div class="video-wrap"><iframe src="${esc(u)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;}
    return `<video src="${esc(u)}"${kb} autoplay muted loop playsinline></video>`;
  }
  return `<img src="${esc(d.src)}"${kb} alt="">`;
}

/* ===== helpers extra ===== */
const niceMax=v=>{if(v<=0)return 1;const p=Math.pow(10,Math.floor(Math.log10(v)));const n=v/p;const m=n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10;return m*p;};
const fmtNum=v=>{v=Math.round(v*100)/100;return v>=1000?(v/1000).toLocaleString('es',{maximumFractionDigits:1})+'k':(''+v);};
const imgOr=(src,ph)=>src?`<img src="${esc(src)}" alt="">`:`<div class="ph">${ph||'imagen'}</div>`;

/* ===== REGISTRY ===== */
const TYPES={
/* ---------- ESTRUCTURA ---------- */
cover:{label:'Portada',group:'Estructura',desc:'Apertura con titular y meta',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'meta',l:'Meta (derecha)',t:'text'},{k:'title',l:'Titular',t:'area',hint:'<span class="acc">…</span> para acento'},{k:'sub',l:'Subtítulo',t:'area'},{k:'foot',l:'Pie de marca',t:'text'},{k:'wm',l:'Watermark',t:'text'},{k:'chips',l:'Chips (uno por línea)',t:'list'}],
 sample:{eyebrow:'Propuesta · Cliente',meta:'· Junio 2026',title:'Titular potente.<br><span class="acc" style="font-style:italic">Una idea, no un índice.</span>',sub:'Subtítulo en una frase.',foot:'CLIENTE · 2026',wm:'thePower',chips:['Punto 1','Punto 2','Punto 3']},
 render:d=>`<section class="scene"${d.wm?` data-wm="${esc(d.wm)}"`:''}>
  <div class="eyebrow reveal"><span>${esc(d.eyebrow)}</span>${d.meta?`<span class="num">${esc(d.meta)}</span>`:''}</div>
  <h1 class="reveal" style="font-size:9.5cqh;margin-top:3.4cqh;max-width:90cqw">${esc(d.title)}</h1>
  ${d.sub?`<p class="reveal lead muted" style="margin-top:3.4cqh;max-width:64cqw">${esc(d.sub)}</p>`:''}
  ${(d.chips&&d.chips.length)?`<div class="chips reveal" style="margin-top:4cqh">${d.chips.map((c,i)=>`<span class="chip${i===0?' on':''}">${esc(c)}</span>`).join('')}</div>`:''}
  ${d.foot?`<div class="foot reveal"><span class="dot"></span><span class="ft">${esc(d.foot)}</span></div>`:''}</section>`},

statement:{label:'Frase única',group:'Estructura',desc:'Idea fuerza centrada',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'title',l:'Frase',t:'area',hint:'<span class="acc">…</span>'},{k:'sub',l:'Apoyo',t:'area'},{k:'wm',l:'Watermark',t:'text'}],
 sample:{eyebrow:'Cierre',title:'La frase final que se quieren llevar.<br><span class="acc" style="font-style:italic">El giro memorable.</span>',sub:'',wm:''},
 render:d=>`<section class="scene center-h"${d.wm?` data-wm="${esc(d.wm)}"`:''}>
  ${d.eyebrow?`<div class="eyebrow reveal" style="justify-content:center"><span>${esc(d.eyebrow)}</span></div>`:''}
  <h2 class="reveal" style="font-size:6.4cqh;margin-top:2.8cqh;max-width:86cqw;line-height:1.1">${esc(d.title)}</h2>
  ${d.sub?`<p class="body reveal" style="margin-top:3.4cqh;max-width:68cqw;text-align:center">${esc(d.sub)}</p>`:''}</section>`},

divider:{label:'Divisor de sección',group:'Estructura',desc:'Número gigante + título',
 fields:[{k:'big',l:'Número/letra',t:'text'},{k:'title',l:'Título',t:'text'},{k:'desc',l:'Descripción',t:'area'},{k:'wm',l:'Watermark',t:'text'}],
 sample:{big:'02',title:'Qué cambia con los agentes',desc:'De responder preguntas a operar procesos.',wm:'Sección'},
 render:d=>`<section class="scene"${d.wm?` data-wm="${esc(d.wm)}"`:''}><div class="sdiv"><div class="big reveal">${esc(d.big)}</div><div><div class="st reveal">${esc(d.title)}</div>${d.desc?`<div class="sd reveal">${esc(d.desc)}</div>`:''}</div></div></section>`},

agenda:{label:'Agenda / índice',group:'Estructura',desc:'Puntos con tiempos',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'items',l:'Puntos',t:'items',sub:[{k:'n',l:'Nº',t:'text'},{k:'t',l:'Título',t:'text'},{k:'m',l:'Tiempo',t:'text'}]}],
 sample:{eyebrow:'Hoy, en 4 movimientos',items:[{n:'01',t:'Dónde estamos',m:'5 min'},{n:'02',t:'Qué cambia',m:'10 min'},{n:'03',t:'El plan',m:'10 min'},{n:'04',t:'Decisiones',m:'5 min'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal"><span class="num">·</span><span>${esc(d.eyebrow)}</span></div><div class="agenda">${d.items.map(it=>`<div class="ag reveal"><span class="n">${esc(it.n)}</span><span class="t">${esc(it.t)}</span><span class="m">${esc(it.m)}</span></div>`).join('')}</div></section>`},

quote:{label:'Cita',group:'Estructura',desc:'Frase con autor',
 fields:[{k:'text',l:'Cita',t:'area'},{k:'author',l:'Autor',t:'text'}],
 sample:{text:'No le pidamos a nuestras mejores mentes que sean compiladores de datos.',author:'Nombre Apellido · cargo'},
 render:d=>`<section class="scene"><div class="center"><div class="quote"><span class="qmark reveal">\u201c</span><div class="qt reveal">${esc(d.text)}</div><div class="qa reveal">— <b>${esc(d.author)}</b></div></div></div></section>`},

/* ---------- CONTENIDO ---------- */
cards:{label:'Tarjetas (cards)',group:'Contenido',desc:'2–4 tarjetas con icono',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'intro',l:'Intro',t:'area'},{k:'items',l:'Tarjetas',t:'items',sub:[{k:'icon',l:'Icono',t:'icon'},{k:'tag',l:'Etiqueta',t:'text'},{k:'name',l:'Título',t:'text'},{k:'desc',l:'Descripción',t:'area'},{k:'color',l:'Color',t:'swatch',opts:['mint','blue','coral','gold','purple']}]}],
 sample:{eyebrow:'Sección',num:'01',title:'Tres opciones. <span class="acc">Un destino.</span>',intro:'',items:[{icon:'i-people',tag:'01',name:'Primera',desc:'Descripción breve.',color:'mint'},{icon:'i-bolt',tag:'02',name:'Segunda',desc:'Descripción breve.',color:'blue'},{icon:'i-rocket',tag:'03',name:'Tercera',desc:'Descripción breve.',color:'coral'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal">${esc(d.title)}</h2>${d.intro?`<p class="body reveal" style="margin-top:2cqh">${esc(d.intro)}</p>`:''}<div class="cards${d.items.length===2?' two':d.items.length>=4?' four':''}">${d.items.map(it=>`<div class="card ${colorClass(it.color)} reveal">${it.icon?`<div class="cico">${ic(it.icon)}</div>`:''}<span class="ctag">${esc(it.tag)}</span><div class="cname">${esc(it.name)}</div><div class="cd">${esc(it.desc)}</div></div>`).join('')}</div></section>`},

icongrid:{label:'Capacidades (iconos)',group:'Contenido',desc:'Grid de iconos con título',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'items',l:'Items',t:'items',sub:[{k:'icon',l:'Icono',t:'icon'},{k:'t',l:'Título',t:'text'},{k:'d',l:'Desc',t:'area'},{k:'color',l:'Color',t:'swatch',opts:['mint','blue','coral','gold','purple']}]}],
 sample:{eyebrow:'Capacidades',num:'02',title:'Lo que cubre el programa',items:[{icon:'i-search',t:'Estructurar',d:'Del caos al mapa.',color:'mint'},{icon:'i-db',t:'Contrastar',d:'Datos cuadrados.',color:'blue'},{icon:'i-chart',t:'Producir',d:'Dashboard y deck.',color:'coral'},{icon:'i-mic',t:'Defender',d:'Ante el panel.',color:'gold'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="icongrid" style="--n:${d.items.length}">${d.items.map(it=>`<div class="igc ${colorClass(it.color)} reveal"><div class="ig-ic">${ic(it.icon)}</div><div class="ig-t">${esc(it.t)}</div><div class="ig-d">${esc(it.d)}</div></div>`).join('')}</div></section>`},

twocol:{label:'Dos columnas',group:'Contenido',desc:'Comparación A | B',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'lh',l:'Izq · etiqueta',t:'text'},{k:'lb',l:'Izq · grande',t:'text'},{k:'lp',l:'Izq · texto',t:'area'},{k:'rh',l:'Dcha · etiqueta',t:'text'},{k:'rb',l:'Dcha · grande',t:'text'},{k:'rp',l:'Dcha · texto',t:'area'}],
 sample:{eyebrow:'Sección',num:'01',title:'De <span class="muted">X</span> a <span class="acc">Y</span>.',lh:'Antes',lb:'Estado A.',lp:'Descripción.',rh:'Después',rb:'Estado B.',rp:'Descripción.'},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal">${esc(d.title)}</h2><div class="twocol"><div class="col reveal"><h3>${esc(d.lh)}</h3><div class="big">${esc(d.lb)}</div><p>${esc(d.lp)}</p></div><div class="divider reveal"></div><div class="col hot reveal"><h3>${esc(d.rh)}</h3><div class="big">${esc(d.rb)}</div><p>${esc(d.rp)}</p></div></div></section>`},

steps:{label:'Pasos (steps)',group:'Contenido',desc:'Progresión con barras',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'items',l:'Pasos',t:'items',sub:[{k:'k',l:'Clave',t:'text'},{k:'t',l:'Título',t:'text'},{k:'d',l:'Desc',t:'area'}]}],
 sample:{eyebrow:'Sección',num:'02',title:'El valor está al <span class="acc">final</span>.',items:[{k:'01',t:'Nivel 1',d:'Descripción.'},{k:'02',t:'Nivel 2',d:'Descripción.'},{k:'03',t:'Nivel 3',d:'Descripción.'},{k:'04',t:'Nivel 4',d:'Descripción.'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5.4cqh">${esc(d.title)}</h2><div class="steps">${d.items.map((it,i)=>`<div class="step${i===d.items.length-1?' last':''} reveal"><div class="bar"></div><div class="k">${esc(it.k)}</div><div class="t">${esc(it.t)}</div><div class="d">${esc(it.d)}</div></div>`).join('')}</div></section>`},

layers:{label:'Capas (layers)',group:'Contenido',desc:'Lista jerárquica numerada',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'intro',l:'Intro',t:'area'},{k:'items',l:'Capas',t:'items',sub:[{k:'n',l:'Nº',t:'text'},{k:'h',l:'Título',t:'text'},{k:'s',l:'Subtítulo',t:'area'}]}],
 sample:{eyebrow:'Sección',num:'03',title:'El patrón, en capas.',intro:'',items:[{n:'01',h:'Capa',s:'Qué contiene.'},{n:'02',h:'Capa',s:'Qué contiene.'},{n:'03',h:'Capa',s:'Qué contiene.'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5.4cqh">${esc(d.title)}</h2>${d.intro?`<p class="body reveal" style="margin-top:2cqh">${esc(d.intro)}</p>`:''}<div class="layers" style="max-width:82cqw">${d.items.map(it=>`<div class="layer reveal"><div class="n">${esc(it.n)}</div><div><div class="h" style="font-size:3.2cqh">${esc(it.h)}</div><div class="s">${esc(it.s)}</div></div></div>`).join('')}</div></section>`},

qlist:{label:'Preguntas (qlist)',group:'Contenido',desc:'2–3 preguntas grandes',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'items',l:'Preguntas',t:'list'}],
 sample:{eyebrow:'Para llevarse',num:'05',items:['¿Primera con <span class="acc">acento</span>?','¿Segunda?','¿Tercera?']},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><div class="qlist">${d.items.map((q,i)=>`<div class="q reveal"><div class="qn">${i+1}</div><div class="txt">${esc(q)}</div></div>`).join('')}</div></section>`},

feat:{label:'Bullets (feat)',group:'Contenido',desc:'Lista con anillo',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'items',l:'Bullets (HTML ok)',t:'list'}],
 sample:{eyebrow:'Sección',num:'01',title:'Lo aprendido',items:['<strong>Tesis uno.</strong> Desarrollo.','<strong>Tesis dos.</strong> Desarrollo.']},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div>${d.title?`<h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2>`:''}<ul class="feat">${d.items.map(x=>`<li class="reveal">${esc(x)}</li>`).join('')}</ul></section>`},

callout:{label:'Callout',group:'Contenido',desc:'Idea fuerza en caja',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'text',l:'Texto',t:'area',hint:'<span class="acc">…</span>'}],
 sample:{eyebrow:'',num:'',title:'',text:'La formación termina. <span class="acc">El ritmo, no.</span>'},
 render:d=>`<section class="scene">${d.eyebrow?`<div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div>`:''}${d.title?`<h2 class="title reveal">${esc(d.title)}</h2>`:''}<div class="callout reveal"><div class="ct">${esc(d.text)}</div></div></section>`},

hlbox:{label:'Nota destacada',group:'Contenido',desc:'Caja azul con etiqueta',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'tag',l:'Etiqueta de la caja',t:'text'},{k:'boxtitle',l:'Título de la caja',t:'text'},{k:'text',l:'Texto',t:'area'}],
 sample:{eyebrow:'Decisión de diseño',num:'06',title:'Por qué este enfoque',tag:'Basado en el piloto',boxtitle:'Dos grupos, no uno',text:'Las dificultades convergían en la herramienta, no en el dato.'},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div>${d.title?`<h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2>`:''}<div class="hl-box reveal" style="max-width:none;margin-top:4cqh"><span class="hk">${esc(d.tag)}</span>${d.boxtitle?`<div class="ht">${esc(d.boxtitle)}</div>`:''}<p>${esc(d.text)}</p></div></section>`},

/* ---------- DATOS & GRÁFICOS ---------- */
statrow:{label:'Cifras (stat row)',group:'Datos',desc:'Hasta 3 cifras grandes',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'source',l:'Fuente',t:'text'},{k:'items',l:'Cifras',t:'items',sub:[{k:'fig',l:'Cifra (HTML ok)',t:'text'},{k:'lbl',l:'Etiqueta',t:'area'}]}],
 sample:{eyebrow:'Sección',num:'00',title:'Una afirmación con <span class="acc">un dato</span>.',source:'Fuente: … 2026',items:[{fig:'~90%',lbl:'contexto'},{fig:'12<span style="font-size:5cqh">años</span>',lbl:'segundo'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="max-width:74cqw">${esc(d.title)}</h2><div class="stat-row">${d.items.map(it=>`<div class="stat reveal"><div class="fig">${esc(it.fig)}</div><div class="lbl">${esc(it.lbl)}</div></div>`).join('')}</div>${d.source?`<div class="source">${esc(d.source)}</div>`:''}</section>`},

kpi:{label:'KPIs (rejilla)',group:'Datos',desc:'Cifras en tarjetas',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'items',l:'KPIs',t:'items',sub:[{k:'v',l:'Valor (HTML ok)',t:'text'},{k:'l',l:'Etiqueta',t:'text'},{k:'lift',l:'Destacar',t:'sel',opts:['no','sí']}]}],
 sample:{eyebrow:'Resultados',num:'02',title:'El periodo en cuatro números',items:[{v:'250',l:'personas',lift:'no'},{v:'23<small>h</small>',l:'itinerario',lift:'no'},{v:'10',l:'sesiones',lift:'no'},{v:'100%',l:'bonificable',lift:'sí'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal">${esc(d.title)}</h2><div class="kpis${d.items.length===3?' three':''}">${d.items.map(it=>`<div class="kpi${it.lift==='sí'?' lift':''} reveal"><div class="kv">${esc(it.v)}</div><div class="kl">${esc(it.l)}</div></div>`).join('')}</div></section>`},

table:{label:'Tabla',group:'Datos',desc:'Columnas/filas con total',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'cols',l:'Cabeceras (una/línea)',t:'list'},{k:'rows',l:'Filas (celdas con |)',t:'list'},{k:'totalL',l:'Total · etiqueta',t:'text'},{k:'totalV',l:'Total · valor',t:'text'},{k:'source',l:'Fuente',t:'text'}],
 sample:{eyebrow:'Modelo económico',num:'09',title:'Tarifa con mínimos',cols:['Línea','Mínimo','Precio'],rows:['Directores | 24.750 € | 1.650 €/pax','Sala | 16.500 € | 275 €/asiento'],totalL:'Total',totalV:'93.750 €',source:''},
 render:d=>{const n=(d.cols||[]).length||3;const cols='1.5fr '+Array(Math.max(0,n-1)).fill('1fr').join(' ');return `<section class="scene top"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="tbl" style="--cols:${cols}"><div class="tr th">${(d.cols||[]).map(c=>`<span>${esc(c)}</span>`).join('')}</div>${(d.rows||[]).map(r=>`<div class="tr tb">${r.split('|').map((c,i)=>`<span${i===0?'':' class="num"'}>${i===0?'<b>'+esc(c.trim())+'</b>':esc(c.trim())}</span>`).join('')}</div>`).join('')}${d.totalV?`<div class="total"><span class="tl">${esc(d.totalL)}</span><span class="tv">${esc(d.totalV)}</span></div>`:''}</div>${d.source?`<div class="source">${esc(d.source)}</div>`:''}</section>`}},

compare:{label:'Comparativa antes/ahora',group:'Datos',desc:'Dos paneles con cifra',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'oldTag',l:'Izq · etiqueta',t:'text'},{k:'oldRows',l:'Izq · filas (k|v)',t:'list'},{k:'oldBL',l:'Izq · cifra etiqueta',t:'text'},{k:'oldBV',l:'Izq · cifra',t:'text'},{k:'newTag',l:'Dcha · etiqueta',t:'text'},{k:'newRows',l:'Dcha · filas (k|v)',t:'list'},{k:'newBL',l:'Dcha · cifra etiqueta',t:'text'},{k:'newBV',l:'Dcha · cifra',t:'text'}],
 sample:{eyebrow:'',num:'',title:'Antes / ahora',oldTag:'Antes',oldRows:['Inversión | 150.050 €','FUNDAE | 48.670 €'],oldBL:'Neto',oldBV:'101.380 €',newTag:'Ahora',newRows:['Inversión | 114.375 €','FUNDAE | 30.095 €'],newBL:'Neto',newBV:'84.280 €'},
 render:d=>`<section class="scene">${d.eyebrow||d.title?`<div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div>`:''}${d.title?`<h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2>`:''}<div class="compare">${['old','new'].map(s=>`<div class="cmp ${s} reveal"><span class="cmt">${esc(d[s+'Tag'])}</span>${(d[s+'Rows']||[]).map(r=>{const p=r.split('|');return `<div class="row"><span class="k">${esc((p[0]||'').trim())}</span><span class="v">${esc((p[1]||'').trim())}</span></div>`}).join('')}<div class="bigv"><span class="bl">${esc(d[s+'BL'])}</span><span class="bv">${esc(d[s+'BV'])}</span></div></div>`).join('')}</div></section>`},

shift:{label:'Cambios (antes→ahora)',group:'Datos',desc:'Tarjetas tachado→acento',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'items',l:'Cambios',t:'items',sub:[{k:'k',l:'Etiqueta',t:'text'},{k:'o',l:'Antes (tachado)',t:'text'},{k:'n',l:'Ahora',t:'text'},{k:'d',l:'Desc',t:'area'}]}],
 sample:{eyebrow:'',num:'',title:'Lo que cambia',items:[{k:'Precio',o:'488 €',n:'275 €',d:'−44%.'},{k:'Horas',o:'23h firme',n:'13h+casos',d:'Riesgo nuestro.'},{k:'Bonif.',o:'Planificada',n:'Trazada',d:'Defendible.'}]},
 render:d=>`<section class="scene">${d.title?`<h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2>`:''}<div class="shifts">${d.items.map(it=>`<div class="shift reveal"><span class="sk">${esc(it.k)}</span><span class="so">${esc(it.o)}</span><span class="sn">${esc(it.n)}</span><div class="sd">${esc(it.d)}</div></div>`).join('')}</div></section>`},

seq:{label:'Secuencia (asíncr/vivo)',group:'Datos',desc:'Items con tipo y duración',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'items',l:'Pasos',t:'items',sub:[{k:'kind',l:'Tipo',t:'text'},{k:'live',l:'En vivo',t:'sel',opts:['no','sí']},{k:'t',l:'Título',t:'text'},{k:'h',l:'Duración',t:'text'}]}],
 sample:{eyebrow:'Itinerario',num:'02',title:'La secuencia',items:[{kind:'Asíncrono',live:'no',t:'Alfabetización IA',h:'4h'},{kind:'En vivo',live:'sí',t:'Copilot aplicado',h:'2h'},{kind:'Asíncrono',live:'no',t:'Copilot 365',h:'5h'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="seq">${d.items.map((it,i)=>`<div class="seq-row${it.live==='sí'?' live':''} reveal"><span class="sn">${String(i+1).padStart(2,'0')}</span><span class="sk">${esc(it.kind)}</span><span class="st">${esc(it.t)}</span><span class="sh">${esc(it.h)}</span></div>`).join('')}</div></section>`},

flow:{label:'Flujo (pipeline)',group:'Datos',desc:'Nodos con flechas',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'items',l:'Nodos',t:'items',sub:[{k:'icon',l:'Icono',t:'icon'},{k:'t',l:'Título',t:'text'},{k:'d',l:'Desc',t:'area'}]}],
 sample:{eyebrow:'Sección',num:'04',title:'Del caos al entregable',items:[{icon:'i-doc',t:'Entrada',d:'Documento'},{icon:'i-chip',t:'Proceso',d:'Estructura'},{icon:'i-check',t:'Salida',d:'Defendido'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5.2cqh">${esc(d.title)}</h2><div class="flow" style="margin-top:6cqh">${d.items.map((it,i)=>`<div class="fnode${i===d.items.length-1?' hot':''} reveal">${it.icon?`<div class="fi">${ic(it.icon)}</div>`:''}<div class="ft" style="font-size:2.1cqh">${esc(it.t)}</div><div class="fd">${esc(it.d)}</div></div>${i<d.items.length-1?'<div class="farrow reveal"><svg viewBox="0 0 24 24" class="ico"><use href="#i-arrow-r"/></svg></div>':''}`).join('')}</div></section>`},

pyramid:{label:'Pirámide',group:'Diagramas',desc:'Niveles con etiqueta',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'inv',l:'Invertida',t:'sel',opts:['no','sí']},{k:'items',l:'Niveles (cúspide→base)',t:'items',sub:[{k:'t',l:'Nivel',t:'text'},{k:'s',l:'Sub (opcional)',t:'text'}]}],
 sample:{eyebrow:'Modelo',num:'05',title:'Tres niveles de adopción',inv:'no',items:[{t:'Estrategia',s:'la cúspide'},{t:'Orquestadores',s:'el centro'},{t:'Ejecución',s:'la base'}]},
 render:d=>{const n=d.items.length;return `<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="pyramid${d.inv==='sí'?' inv':''}">${d.items.map((it,i)=>{const w=30+ (n>1?(i*(64/(n-1))):40);return `<div class="plvl reveal" style="width:${w}cqw">${esc(it.t)}${it.s?`<span class="sub">${esc(it.s)}</span>`:''}</div>`}).join('')}</div></section>`}},

donut:{label:'Donuts (%)',group:'Diagramas',desc:'Anillos de porcentaje',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'items',l:'Donuts',t:'items',sub:[{k:'val',l:'Porcentaje',t:'range'},{k:'lbl',l:'Etiqueta',t:'area'},{k:'color',l:'Color',t:'swatch',opts:['mint','lime','blue','coral']}]}],
 sample:{eyebrow:'Sección',num:'05',title:'Adopción real, medida.',items:[{val:'68',lbl:'a 90 días',color:'mint'},{val:'92',lbl:'completaron',color:'lime'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="donuts">${d.items.map(it=>`<div class="donut reveal"><div class="dwrap"><svg viewBox="0 0 42 42" class="drawin"><circle class="ring-bg" cx="21" cy="21" r="15.9155"/><circle class="ring ${ringClass(it.color)}" cx="21" cy="21" r="15.9155" stroke-dasharray="${esc(it.val)},100"/></svg><div class="dval">${esc(it.val)}%</div></div><div class="dlbl">${esc(it.lbl)}</div></div>`).join('')}</div></section>`},

gauge:{label:'Medidor (gauge)',group:'Diagramas',desc:'Semicírculo de %',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'val',l:'Porcentaje',t:'range'},{k:'label',l:'Etiqueta',t:'text'}],
 sample:{eyebrow:'Sección',num:'05',title:'Madurez de adopción',val:'70',label:'objetivo Q4'},
 render:d=>{const v=Math.max(0,Math.min(100,parseFloat(d.val)||0));return `<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="gauge reveal" style="margin-top:6cqh"><svg viewBox="0 0 64 36" class="drawin"><path class="g-bg" d="M 5 32 A 27 27 0 0 1 59 32"/><path class="g-fill" d="M 5 32 A 27 27 0 0 1 59 32" stroke-dasharray="${(v*0.848).toFixed(1)},999"/></svg><div class="gv">${esc(d.val)}%</div><div class="gl">${esc(d.label)}</div></div></section>`}},

hbar:{label:'Barras comparativas',group:'Diagramas',desc:'Hbar con score',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'source',l:'Fuente',t:'text'},{k:'items',l:'Barras',t:'items',sub:[{k:'n',l:'Nombre',t:'text'},{k:'w',l:'Ancho %',t:'range'},{k:'score',l:'Score (texto)',t:'text'},{k:'variant',l:'Estilo',t:'swatch',opts:['mint','alt','warn']}]}],
 sample:{eyebrow:'Benchmark',num:'05',title:'Comparativa',source:'Datos de ejemplo',items:[{n:'Opción A',w:'81',score:'81%',variant:'mint'},{n:'Opción B',w:'76',score:'76%',variant:'mint'},{n:'Opción C',w:'71',score:'71%',variant:'alt'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="hbars">${d.items.map(it=>`<div class="hbar reveal"><span class="hn">${esc(it.n)}</span><div class="track"><div class="fill ${it.variant==='alt'?'alt':it.variant==='warn'?'warn':''}" style="--w:${esc(it.w)}%"></div></div><span class="score">${esc(it.score)}</span></div>`).join('')}</div>${d.source?`<div class="source">${esc(d.source)}</div>`:''}</section>`},

timeline:{label:'Roadmap (timeline)',group:'Diagramas',desc:'Hitos en raíl',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'progress',l:'% completado',t:'range'},{k:'items',l:'Hitos',t:'items',sub:[{k:'tag',l:'Etiqueta',t:'text'},{k:'h',l:'Título',t:'text'},{k:'d',l:'Desc',t:'area'},{k:'off',l:'Futuro',t:'sel',opts:['no','sí']}]}],
 sample:{eyebrow:'Plan',num:'06',title:'El roadmap',progress:'38',items:[{tag:'Q1 · Hecho',h:'Piloto',d:'40 personas.',off:'no'},{tag:'Q2 · En curso',h:'2ª Fase',d:'Directores.',off:'no'},{tag:'Q3',h:'Escala',d:'~100 personas.',off:'sí'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="tline reveal"><div class="rail"><i style="--p:${esc(d.progress)}%"></i></div><div class="marks">${d.items.map(it=>`<div class="mk${it.off==='sí'?' off':''}"><span class="mt">${esc(it.tag)}</span><div class="mh">${esc(it.h)}</div><div class="md">${esc(it.d)}</div></div>`).join('')}</div></div></section>`},

funnel:{label:'Embudo (funnel)',group:'Diagramas',desc:'Conversión por etapas',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'items',l:'Etapas',t:'items',sub:[{k:'t',l:'Etapa',t:'text'},{k:'w',l:'Ancho %',t:'range'},{k:'v',l:'Valor',t:'text'}]}],
 sample:{eyebrow:'Adopción',num:'03',title:'De formados a workflows',items:[{t:'Formados',w:'100',v:'250'},{t:'Activos',w:'72',v:'180'},{t:'Semanal',w:'46',v:'115'},{t:'Workflows',w:'26',v:'65'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="funnel">${d.items.map(it=>`<div class="frow reveal"><div class="fbwrap" style="width:100%"><div class="fb" style="--w:${esc(it.w)}%">${esc(it.t)}</div></div><span class="fv">${esc(it.v)}</span></div>`).join('')}</div></section>`},

stack:{label:'Arquitectura (stack)',group:'Diagramas',desc:'Capas apiladas',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'items',l:'Capas (arriba→abajo)',t:'items',sub:[{k:'t',l:'Título',t:'text'},{k:'d',l:'Desc',t:'text'},{k:'r',l:'Etiqueta dcha',t:'text'},{k:'color',l:'Color',t:'swatch',opts:['mint','hot','blue','coral']}]}],
 sample:{eyebrow:'Arquitectura',num:'04',title:'Las tres capas',items:[{t:'Interfaz',d:'Chat, Copilot, Portal',r:'CAPA 03',color:'mint'},{t:'Orquestación',d:'Agentes, MCP',r:'CAPA 02',color:'hot'},{t:'Datos',d:'Documentos, memoria',r:'CAPA 01',color:'mint'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="stack">${d.items.map(it=>`<div class="slayer ${it.color==='mint'?'':it.color} reveal"><div><div class="lt">${esc(it.t)}</div><div class="ld">${esc(it.d)}</div></div><span class="lr">${esc(it.r)}</span></div>`).join('')}</div></section>`},

venn:{label:'Venn (2 conjuntos)',group:'Diagramas',desc:'Intersección de dos mundos',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'aLab',l:'Izq · título',t:'text'},{k:'aSub',l:'Izq · sub',t:'text'},{k:'bLab',l:'Dcha · título',t:'text'},{k:'bSub',l:'Dcha · sub',t:'text'},{k:'mid',l:'Centro · título',t:'text'},{k:'midSub',l:'Centro · sub',t:'text'}],
 sample:{eyebrow:'El cruce',num:'03',aLab:'Negocio',aSub:'conoce el proceso',bLab:'IA',bSub:'conoce la herramienta',mid:'Adopción',midSub:'real'},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><div class="venn reveal"><svg viewBox="0 0 100 70" class="drawin"><circle class="va" cx="36" cy="34" r="24"/><circle class="vb" cx="64" cy="34" r="24"/><text class="vlab" x="24" y="33" text-anchor="middle">${esc(d.aLab)}</text><text class="vsub" x="24" y="39" text-anchor="middle">${esc(d.aSub)}</text><text class="vlab" x="76" y="33" text-anchor="middle">${esc(d.bLab)}</text><text class="vsub" x="76" y="39" text-anchor="middle">${esc(d.bSub)}</text><text class="vmid" x="50" y="33" text-anchor="middle">${esc(d.mid)}</text><text class="vsub" x="50" y="39" text-anchor="middle">${esc(d.midSub)}</text></svg></div></section>`},

matrix:{label:'Matriz 2×2',group:'Diagramas',desc:'Priorización en dos ejes',
 fields:[{k:'axX',l:'Eje X',t:'text'},{k:'axY',l:'Eje Y',t:'text'},{k:'c1t',l:'Arriba-izq · título',t:'text'},{k:'c1d',l:'Arriba-izq · desc',t:'text'},{k:'c2t',l:'Arriba-dcha · título',t:'text'},{k:'c2d',l:'Arriba-dcha · desc',t:'text'},{k:'c3t',l:'Abajo-izq · título',t:'text'},{k:'c3d',l:'Abajo-izq · desc',t:'text'},{k:'c4t',l:'Abajo-dcha · título',t:'text'},{k:'c4d',l:'Abajo-dcha · desc',t:'text'}],
 sample:{axX:'Madurez',axY:'Valor',c1t:'Explorar',c1d:'Alto valor, baja madurez.',c2t:'Escalar ya',c2d:'Alto valor, alta madurez.',c3t:'Descartar',c3d:'',c4t:'Automatizar',c4d:'Bajo valor, alta madurez.'},
 render:d=>`<section class="scene"><div class="matrix reveal"><div class="grid"><div class="cell"><div class="mt">${esc(d.c1t)}</div><div class="md">${esc(d.c1d)}</div></div><div class="cell hot"><div class="mt">${esc(d.c2t)}</div><div class="md">${esc(d.c2d)}</div></div><div class="cell"><div class="mt">${esc(d.c3t)}</div><div class="md">${esc(d.c3d)}</div></div><div class="cell"><div class="mt">${esc(d.c4t)}</div><div class="md">${esc(d.c4d)}</div></div></div><span class="ax x">${esc(d.axX)} <b>→</b></span><span class="ax y">${esc(d.axY)} <b>→</b></span></div></section>`},

/* ---------- MEDIA ---------- */
imagefull:{label:'Imagen a sangre',group:'Media',desc:'Foto full + título overlay',
 fields:[{k:'media',l:'Imagen',t:'media',kind:'image'},{k:'anim',l:'Animación',t:'sel',opts:['estática','ken']},{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'pos',l:'Posición texto',t:'sel',opts:['abajo','centro']},{k:'credit',l:'Crédito',t:'text'},{k:'wm',l:'Watermark',t:'text'}],
 sample:{media:{kind:'image',src:''},anim:'ken',eyebrow:'Sección',title:'Titular sobre la imagen',pos:'abajo',credit:'',wm:''},
 render:d=>`<section class="scene bleed"${d.wm?` data-wm="${esc(d.wm)}"`:''}><div class="media-full">${mediaTag(d.media||{kind:'image'},{anim:d.anim==='ken'?'ken':''})}<div class="ov"></div><div class="cap${d.pos==='centro'?' mid':''}">${d.eyebrow?`<div class="eyebrow reveal"${d.pos==='centro'?' style="justify-content:center"':''}><span>${esc(d.eyebrow)}</span></div>`:''}<h2 class="reveal" style="font-size:6cqh;margin-top:2.4cqh;max-width:80cqw;line-height:1.05">${esc(d.title)}</h2></div>${d.credit?`<div class="media-credit">${esc(d.credit)}</div>`:''}</div></section>`},

imagesplit:{label:'Imagen + texto',group:'Media',desc:'Mitad foto, mitad texto',
 fields:[{k:'media',l:'Imagen',t:'media',kind:'image'},{k:'anim',l:'Animación',t:'sel',opts:['estática','ken']},{k:'side',l:'Imagen a la',t:'sel',opts:['derecha','izquierda']},{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'body',l:'Texto',t:'area'}],
 sample:{media:{kind:'image',src:''},anim:'ken',side:'derecha',eyebrow:'Sección',num:'01',title:'Un titular fuerte',body:'El texto de apoyo a la izquierda y la imagen a la derecha.'},
 render:d=>{const text=`<div class="mtext"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><p class="body reveal" style="margin-top:2.4cqh">${esc(d.body)}</p></div>`;const vis=`<div class="mvis">${mediaTag(d.media||{kind:'image'},{anim:d.anim==='ken'?'ken':''})}</div>`;return `<section class="scene bleed"><div class="media-split${d.side==='izquierda'?' rev':''}">${d.side==='izquierda'?vis+text:text+vis}</div></section>`}},

video:{label:'Vídeo',group:'Media',desc:'YouTube, Vimeo o MP4',
 fields:[{k:'media',l:'Vídeo (URL)',t:'media',kind:'video'},{k:'mode',l:'Modo',t:'sel',opts:['reproductor','fondo']},{k:'eyebrow',l:'Eyebrow (overlay)',t:'text'},{k:'title',l:'Titular (overlay)',t:'area'}],
 sample:{media:{kind:'video',src:'https://vimeo.com/76979871'},mode:'reproductor',eyebrow:'',title:''},
 render:d=>`<section class="scene bleed">${mediaTag(d.media||{kind:'video'},{bg:d.mode==='fondo'})}${d.mode==='fondo'?'<div class="ov"></div>':''}${(d.title||d.eyebrow)?`<div class="cap" style="z-index:4">${d.eyebrow?`<div class="eyebrow reveal"><span>${esc(d.eyebrow)}</span></div>`:''}${d.title?`<h2 class="reveal" style="font-size:5cqh;margin-top:2cqh">${esc(d.title)}</h2>`:''}</div>`:''}</section>`},
/* ---------- VISUALES NUEVOS ---------- */
bignum:{label:'Número héroe',group:'Datos',desc:'Una cifra protagonista',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'fig',l:'Cifra (HTML ok)',t:'text'},{k:'ctx',l:'Contexto',t:'area'},{k:'note',l:'Nota/fuente',t:'text'},{k:'wm',l:'Watermark',t:'text'}],
 sample:{eyebrow:'El dato',num:'01',fig:'73<small>%</small>',ctx:'de las tareas de análisis ya pasan por un asistente de IA.',note:'Fuente: estudio interno · 2026',wm:''},
 render:d=>`<section class="scene"${d.wm?` data-wm="${esc(d.wm)}"`:''}><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><div class="bignum"><div class="bn reveal">${esc(d.fig)}</div><div class="bctx reveal">${esc(d.ctx)}</div>${d.note?`<div class="bnote reveal">${esc(d.note)}</div>`:''}</div></section>`},

bento:{label:'Rejilla bento',group:'Contenido',desc:'Mosaico asimétrico premium',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},
   {k:'items',l:'Celdas',t:'items',sub:[{k:'size',l:'Tamaño',t:'sel',opts:['normal','wide','tall','big']},{k:'style',l:'Estilo',t:'sel',opts:['normal','accent','dark']},{k:'icon',l:'Icono',t:'icon'},{k:'fig',l:'Cifra (opcional)',t:'text'},{k:'t',l:'Título',t:'text'},{k:'d',l:'Desc',t:'area'}]}],
 sample:{eyebrow:'De un vistazo',num:'01',title:'Todo el programa, en un mosaico',items:[
   {size:'big',style:'accent',icon:'i-rocket',fig:'',t:'7 semanas de capstone',d:'Un encargo real, defendido ante panel.',},
   {size:'normal',style:'normal',icon:'',fig:'250',t:'',d:'participantes'},
   {size:'normal',style:'dark',icon:'i-bolt',fig:'',t:'Copilot 365',d:'stack verificado'},
   {size:'wide',style:'normal',icon:'i-trophy',fig:'',t:'Habilidades & Camino',d:'oratoria, marca, vibe coding, arte generativo'}]},
 render:d=>`<section class="scene top"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:4.6cqh">${esc(d.title)}</h2><div class="bento reveal">${d.items.map(it=>`<div class="bc ${it.size==='normal'?'':it.size} ${it.style==='normal'?'':it.style}">${it.icon?`<div class="bi">${ic(it.icon)}</div>`:''}${it.fig?`<div class="bfig">${esc(it.fig)}</div>`:''}${it.t?`<div class="bt">${esc(it.t)}</div>`:''}${it.d?`<div class="bd">${esc(it.d)}</div>`:''}</div>`).join('')}</div></section>`},

barchart:{label:'Barras verticales',group:'Datos',desc:'Gráfico de barras',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'source',l:'Fuente',t:'text'},
   {k:'items',l:'Barras',t:'items',sub:[{k:'h',l:'Altura %',t:'range'},{k:'val',l:'Valor (texto)',t:'text'},{k:'lbl',l:'Etiqueta',t:'text'},{k:'color',l:'Color',t:'swatch',opts:['mint','alt','coral']}]}],
 sample:{eyebrow:'Evolución',num:'02',title:'Adopción por trimestre',source:'',items:[{h:'35',val:'35%',lbl:'Q1',color:'mint'},{h:'58',val:'58%',lbl:'Q2',color:'mint'},{h:'76',val:'76%',lbl:'Q3',color:'mint'},{h:'92',val:'92%',lbl:'Q4',color:'alt'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="barchart reveal">${d.items.map(it=>`<div class="bcol"><div class="bval">${esc(it.val)}</div><div class="bbar ${it.color==='mint'?'':it.color}" style="height:${esc(it.h)}%"></div><div class="blbl">${esc(it.lbl)}</div></div>`).join('')}</div>${d.source?`<div class="source">${esc(d.source)}</div>`:''}</section>`},

gallery:{label:'Galería de imágenes',group:'Media',desc:'2–4 fotos en rejilla',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},
   {k:'items',l:'Imágenes',t:'items',sub:[{k:'img',l:'Imagen',t:'img'},{k:'cap',l:'Pie',t:'text'}]}],
 sample:{eyebrow:'Galería',num:'03',title:'Momentos del programa',items:[{img:'',cap:'Sesión 1'},{img:'',cap:'Workshop'},{img:'',cap:'Panel final'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:4.6cqh">${esc(d.title)}</h2><div class="gallery g${Math.min(4,d.items.length)} reveal">${d.items.slice(0,4).map(it=>`<div class="gimg">${imgOr(it.img)}${it.cap?`<div class="gcap">${esc(it.cap)}</div>`:''}</div>`).join('')}</div></section>`},

profile:{label:'Equipo / personas',group:'Contenido',desc:'Foto + nombre + rol',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},
   {k:'items',l:'Personas',t:'items',sub:[{k:'img',l:'Foto',t:'img'},{k:'n',l:'Nombre',t:'text'},{k:'r',l:'Rol',t:'text'},{k:'d',l:'Nota',t:'area'}]}],
 sample:{eyebrow:'Quién imparte',num:'04',title:'Un experto dedicado + especialistas',items:[{img:'',n:'Nombre Apellido',r:'Director del programa',d:'IA aplicada y capstone.'},{img:'',n:'Nombre Apellido',r:'Oratoria',d:'Defensa ante panel.'},{img:'',n:'Nombre Apellido',r:'Vibe coding',d:'Prototipado con IA.'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:4.8cqh">${esc(d.title)}</h2><div class="profiles reveal" style="--n:${d.items.length}">${d.items.map(it=>`<div class="prof"><div class="pav">${it.img?`<img src="${esc(it.img)}" alt="">`:'<div class="ph"><svg class="ico lg"><use href="#i-people"/></svg></div>'}</div><div class="pn">${esc(it.n)}</div><div class="pr">${esc(it.r)}</div>${it.d?`<div class="pd">${esc(it.d)}</div>`:''}</div>`).join('')}</div></section>`},

fmatrix:{label:'Comparativa ✓/✗',group:'Datos',desc:'Tabla de funciones por opción',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},
   {k:'cols',l:'Columnas (una/línea, marca la destacada con *)',t:'list'},
   {k:'rows',l:'Filas (función | sí/no/texto | …)',t:'list'}],
 sample:{eyebrow:'Comparativa',num:'05',title:'Qué incluye cada opción',cols:['Función','Básico','*Completo'],rows:['Masterclasses IA | si | si','Capstone real | no | si','Habilidades & Camino | no | si','Evaluación por panel | no | si']},
 render:d=>{const cols=(d.cols||[]);const hiIdx=cols.findIndex(c=>c.startsWith('*'));const clean=cols.map(c=>c.replace(/^\*/,''));const grid='2fr '+Array(Math.max(0,clean.length-1)).fill('1fr').join(' ');
   const cell=v=>{const t=(v||'').trim().toLowerCase();if(t==='si'||t==='sí'||t==='yes')return '<span class="yes"><svg class="ico"><use href="#i-check"/></svg></span>';if(t==='no'||t===''||t==='-')return '<span class="no">—</span>';return esc(v.trim());};
   return `<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="fmx reveal" style="--cols:${grid}"><div class="fr fh">${clean.map((c,i)=>`<span class="${i===hiIdx?'hi':''}">${esc(c)}</span>`).join('')}</div>${(d.rows||[]).map(r=>{const p=r.split('|');return `<div class="fr">${p.map((c,i)=>`<div class="fcell ${i===0?'lab':''} ${i===hiIdx?'col-hi':''}">${i===0?esc(c.trim()):cell(c)}</div>`).join('')}</div>`}).join('')}</div></section>`}},

cycle:{label:'Proceso circular',group:'Diagramas',desc:'Ciclo de 3–5 nodos',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'mid',l:'Centro (texto)',t:'text'},
   {k:'items',l:'Nodos',t:'items',sub:[{k:'icon',l:'Icono',t:'icon'},{k:'t',l:'Título',t:'text'},{k:'d',l:'Desc',t:'text'}]}],
 sample:{eyebrow:'El ciclo',num:'06',mid:'Mejora continua',items:[{icon:'i-search',t:'Medir',d:'datos reales'},{icon:'i-bulb',t:'Aprender',d:'qué funciona'},{icon:'i-gear',t:'Ajustar',d:'el flujo'},{icon:'i-rocket',t:'Escalar',d:'lo que sirve'}]},
 render:d=>{const n=d.items.length;const R=42;const nodes=d.items.map((it,i)=>{const ang=(-90+i*360/n)*Math.PI/180;const x=50+R*Math.cos(ang),y=50+R*Math.sin(ang);return `<div class="cnode" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%">${it.icon?`<div class="ci">${ic(it.icon)}</div>`:''}<div class="cnt">${esc(it.t)}</div>${it.d?`<div class="cnd">${esc(it.d)}</div>`:''}</div>`}).join('');
   return `<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><div class="cycle reveal">${d.mid?`<div class="cmid"><div class="cmt">${esc(d.mid)}</div></div>`:''}${nodes}</div></section>`}},

quotecard:{label:'Cita con retrato',group:'Estructura',desc:'Testimonio con foto',
 fields:[{k:'img',l:'Retrato',t:'img'},{k:'text',l:'Cita',t:'area'},{k:'author',l:'Autor (negrita auto)',t:'text'},{k:'role',l:'Cargo',t:'text'}],
 sample:{img:'',text:'No le pidamos a nuestras mejores mentes que sean compiladores de datos.',author:'Nombre Apellido',role:'Director, Cliente'},
 render:d=>`<section class="scene"><div class="quotecard"><div class="qav reveal">${d.img?`<img src="${esc(d.img)}" alt="">`:'<div class="ph"><svg class="ico lg"><use href="#i-people"/></svg></div>'}</div><div class="qbody"><div class="qmk reveal">\u201c</div><div class="qtx reveal">${esc(d.text)}</div><div class="qau reveal"><b>${esc(d.author)}</b>${d.role?' · '+esc(d.role):''}</div></div></div></section>`},

/* ---------- MÁS TIPOS (v5) ---------- */
pricing:{label:'Tarifas / planes',group:'Datos',desc:'Tarjetas de precio comparables',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},
   {k:'items',l:'Planes',t:'items',sub:[{k:'tag',l:'Nombre del plan',t:'text'},{k:'price',l:'Precio (HTML ok)',t:'text'},{k:'feats',l:'Incluye (uno por línea)',t:'area'},{k:'hot',l:'Destacado',t:'sel',opts:['no','sí']}]}],
 sample:{eyebrow:'Modelo económico',num:'09',title:'Tres formas de empezar',items:[
   {tag:'Esencial',price:'58.000 €<small> fijos</small>',feats:'Bootcamp 2,5 días\nMasterclasses IA\nCapstone real',hot:'no'},
   {tag:'Completo',price:'89.200 €<small> · 120 pax</small>',feats:'Todo lo anterior\nHabilidades & Camino\nPanel de evaluación\n7 talleres con especialistas',hot:'sí'},
   {tag:'A medida',price:'Consultar',feats:'Volumen 80–120\nPersonalización por área\nMétricas de adopción',hot:'no'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:4.8cqh">${esc(d.title)}</h2><div class="pricing reveal" style="--n:${d.items.length}">${d.items.map(it=>`<div class="pcard ${it.hot==='sí'?'hot':''}"><span class="ptag">${esc(it.tag)}</span><div class="pprice">${esc(it.price)}</div><ul class="pfeats">${(it.feats||'').split('\n').filter(x=>x.trim()).map(f=>`<li><svg class="ico"><use href="#i-check"/></svg><span>${esc(f.trim())}</span></li>`).join('')}</ul></div>`).join('')}</div></section>`},

progress:{label:'Barras de progreso',group:'Datos',desc:'Métricas con % horizontal',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},
   {k:'items',l:'Métricas',t:'items',sub:[{k:'n',l:'Nombre',t:'text'},{k:'pct',l:'Porcentaje',t:'range'},{k:'v',l:'Valor (texto, opc.)',t:'text'}]}],
 sample:{eyebrow:'Adopción',num:'05',title:'Dónde estamos hoy',items:[{n:'Activación inicial',pct:'82',v:'82%'},{n:'Uso semanal',pct:'58',v:'58%'},{n:'Workflows propios',pct:'31',v:'31%'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="progress reveal">${d.items.map(it=>`<div class="pbar-row"><div class="pbh"><span class="pbn">${esc(it.n)}</span><span class="pbv">${esc(it.v||(it.pct+'%'))}</span></div><div class="pbtrack"><div class="pbfill" style="width:${esc(it.pct)}%"></div></div></div>`).join('')}</div></section>`},

linechart:{label:'Gráfico de línea',group:'Datos',desc:'Tendencia / evolución',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'source',l:'Fuente',t:'text'},
   {k:'items',l:'Puntos',t:'items',sub:[{k:'y',l:'Valor',t:'range'},{k:'lbl',l:'Etiqueta X',t:'text'}]}],
 sample:{eyebrow:'Evolución',num:'06',title:'Uso mensual del asistente',source:'',items:[{y:'20',lbl:'Ene'},{y:'34',lbl:'Feb'},{y:'45',lbl:'Mar'},{y:'62',lbl:'Abr'},{y:'78',lbl:'May'},{y:'90',lbl:'Jun'}]},
 render:d=>{const its=d.items||[];const pts=its.map(it=>parseFloat(it.y)||0);const n=pts.length;
   const W=100,H=40,pl=11,pr=3,pt=4,pb=8;const max=niceMax(Math.max(...pts,1));
   const X=i=>pl+(W-pl-pr)*(n>1?i/(n-1):0);const Y=v=>pt+(H-pt-pb)*(1-v/max);
   const grid=[0,.5,1].map(f=>{const tv=f*max,y=Y(tv).toFixed(1);return `<line class="lc-grid" x1="${pl}" y1="${y}" x2="${W-pr}" y2="${y}"/><text class="lc-axis" x="${pl-1.5}" y="${(+y+1).toFixed(1)}">${fmtNum(tv)}</text>`}).join('');
   const line=pts.map((v,i)=>`${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
   const dots=pts.map((v,i)=>`<circle class="lc-dot" cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="1"/><text class="lc-val" x="${X(i).toFixed(1)}" y="${(Y(v)-2.4).toFixed(1)}">${esc(its[i].y)}</text><text class="lc-lbl" x="${X(i).toFixed(1)}" y="${H-1}">${esc(its[i].lbl)}</text>`).join('');
   return `<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="linechart reveal"><svg viewBox="0 0 ${W} ${H}" class="drawin">${grid}<polyline class="lc-line" points="${line}"/>${dots}</svg></div>${d.source?`<div class="source">${esc(d.source)}</div>`:''}</section>`}},

vtimeline:{label:'Cronología vertical',group:'Diagramas',desc:'Hitos en columna',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},
   {k:'items',l:'Hitos',t:'items',sub:[{k:'t',l:'Fecha/etiqueta',t:'text'},{k:'h',l:'Título',t:'text'},{k:'d',l:'Desc',t:'area'},{k:'off',l:'Futuro',t:'sel',opts:['no','sí']}]}],
 sample:{eyebrow:'Plan',num:'06',title:'El recorrido, paso a paso',items:[{t:'Mes 1',h:'Diagnóstico',d:'Mapa de adopción por área.',off:'no'},{t:'Mes 2-3',h:'Despliegue',d:'Formación + casos reales.',off:'no'},{t:'Mes 4',h:'Medición',d:'Métricas de uso real.',off:'sí'},{t:'Mes 5+',h:'Escala',d:'Lo que funciona, a toda la org.',off:'sí'}]},
 render:d=>`<section class="scene top"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:4.8cqh">${esc(d.title)}</h2><div class="vtimeline reveal">${d.items.map(it=>`<div class="vt-item ${it.off==='sí'?'off':''}"><div class="vtt">${esc(it.t)}</div><div class="vth">${esc(it.h)}</div>${it.d?`<div class="vtd">${esc(it.d)}</div>`:''}</div>`).join('')}</div></section>`},

proscons:{label:'Pros y contras',group:'Contenido',desc:'Dos columnas ✓ / ✗',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'proTitle',l:'Título izq',t:'text'},{k:'pros',l:'A favor (uno/línea)',t:'list'},{k:'conTitle',l:'Título dcha',t:'text'},{k:'cons',l:'En contra (uno/línea)',t:'list'}],
 sample:{eyebrow:'Decisión',num:'04',title:'Construir vs. comprar',proTitle:'A favor',pros:['Control total del dato','Adaptado a nuestro proceso','Sin coste por licencia'],conTitle:'En contra',cons:['Mantenimiento interno','Tiempo de desarrollo','Riesgo de dependencia de personas']},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="proscons reveal"><div class="pcside pro"><h4><svg class="ico"><use href="#i-check"/></svg>${esc(d.proTitle)}</h4><ul>${(d.pros||[]).map(x=>`<li><svg class="ico"><use href="#i-check"/></svg><span>${esc(x)}</span></li>`).join('')}</ul></div><div class="pcside con"><h4><svg class="ico"><use href="#i-warn"/></svg>${esc(d.conTitle)}</h4><ul>${(d.cons||[]).map(x=>`<li><svg class="ico"><use href="#i-warn"/></svg><span>${esc(x)}</span></li>`).join('')}</ul></div></div></section>`},

checklist:{label:'Checklist',group:'Contenido',desc:'Lista de verificación',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},
   {k:'items',l:'Puntos',t:'items',sub:[{k:'t',l:'Texto (HTML ok)',t:'text'},{k:'done',l:'Marcado',t:'sel',opts:['sí','no']}]}],
 sample:{eyebrow:'Antes de empezar',num:'07',title:'Qué necesitamos de vosotros',items:[{t:'<b>Licencias Copilot</b> asignadas al grupo piloto',done:'sí'},{t:'<b>Sponsor</b> de negocio identificado',done:'sí'},{t:'<b>Casos reales</b> por área para el capstone',done:'no'},{t:'<b>Acceso</b> a los datos de ejemplo',done:'no'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="checklist reveal">${d.items.map(it=>`<div class="chk ${it.done==='no'?'off':''}"><span class="ck">${it.done!=='no'?'<svg class="ico"><use href="#i-check"/></svg>':''}</span><span>${esc(it.t)}</span></div>`).join('')}</div></section>`},

logos:{label:'Muro de logos',group:'Contenido',desc:'Clientes / partners',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},{k:'cols',l:'Columnas',t:'range',min:2,max:6,def:4},
   {k:'items',l:'Logos',t:'items',sub:[{k:'img',l:'Logo (imagen)',t:'img'},{k:'name',l:'Texto (si no hay imagen)',t:'text'}]}],
 sample:{eyebrow:'Confían en nosotros',num:'01',title:'Clientes',cols:'4',items:[{img:'',name:'KPMG'},{img:'',name:'EY'},{img:'',name:'Estrella Galicia'},{img:'',name:'Técnicas Reunidas'},{img:'',name:'MANUSA'},{img:'',name:'AXA'},{img:'',name:'FCC'},{img:'',name:'Mapfre'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="logowall reveal" style="--n:${d.cols||4}">${d.items.map(it=>`<div class="logo-cell">${it.img?`<img src="${esc(it.img)}" alt="">`:`<span>${esc(it.name)}</span>`}</div>`).join('')}</div></section>`},

cta:{label:'Cierre / llamada a la acción',group:'Estructura',desc:'Slide final con CTA',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'title',l:'Titular',t:'area',hint:'<span class="acc">…</span>'},{k:'sub',l:'Subtítulo',t:'area'},{k:'btn',l:'Texto del botón',t:'text'},{k:'meta',l:'Meta (contacto, etc.)',t:'text'},{k:'wm',l:'Watermark',t:'text'}],
 sample:{eyebrow:'',title:'Empecemos por <span class="acc">un piloto</span>.',sub:'40 personas, 6 semanas, un caso real. Medimos adopción, no asistencia.',btn:'Hablemos',meta:'alberto@thepower.education · thepower.education',wm:'thePower'},
 render:d=>`<section class="scene"${d.wm?` data-wm="${esc(d.wm)}"`:''}><div class="cta">${d.eyebrow?`<div class="eyebrow reveal" style="justify-content:center"><span>${esc(d.eyebrow)}</span></div>`:''}<div class="ctah reveal">${esc(d.title)}</div>${d.sub?`<div class="ctas reveal">${esc(d.sub)}</div>`:''}${d.btn?`<div class="ctabtn reveal">${esc(d.btn)}<svg class="ico"><use href="#i-arrow-r"/></svg></div>`:''}${d.meta?`<div class="ctameta reveal">${esc(d.meta)}</div>`:''}</div></section>`},

/* ---------- MÁS TIPOS (v7) ---------- */
threecol:{label:'Tres columnas',group:'Contenido',desc:'Tres bloques de texto',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'title',l:'Titular',t:'area'},
   {k:'items',l:'Columnas',t:'items',sub:[{k:'n',l:'Etiqueta',t:'text'},{k:'h',l:'Título',t:'text'},{k:'p',l:'Texto',t:'area'}]}],
 sample:{eyebrow:'Tres frentes',num:'02',title:'Cómo abordamos la adopción',items:[{n:'01',h:'Personas',p:'Segmentación por nivel y rol. Nadie se queda fuera.'},{n:'02',h:'Procesos',p:'Casos reales por área, no ejercicios de juguete.'},{n:'03',h:'Métricas',p:'Adopción real medida, no asistencia ni NPS.'}]},
 render:d=>`<section class="scene"><div class="eyebrow reveal">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h2 class="title reveal" style="font-size:5cqh">${esc(d.title)}</h2><div class="threecol reveal">${d.items.slice(0,3).map(it=>`<div class="tc3"><div class="tcn">${esc(it.n)}</div><div class="tch">${esc(it.h)}</div><p>${esc(it.p)}</p></div>`).join('')}</div></section>`},

splitstat:{label:'Dato + cuerpo',group:'Datos',desc:'Cifra grande junto a lista',
 fields:[{k:'eyebrow',l:'Eyebrow',t:'text'},{k:'num',l:'Nº',t:'text'},{k:'fig',l:'Cifra (HTML ok)',t:'text'},{k:'figlbl',l:'Etiqueta de la cifra',t:'area'},{k:'bodyTitle',l:'Título del cuerpo',t:'text'},{k:'points',l:'Puntos (uno/línea)',t:'list'}],
 sample:{eyebrow:'El impacto',num:'03',fig:'12<small>h/sem</small>',figlbl:'recuperadas por persona tras la adopción',bodyTitle:'De dónde sale ese tiempo',points:['Menos búsqueda manual de información','Borradores y síntesis automatizados','Análisis que antes tomaba días']},
 render:d=>`<section class="scene"><div class="splitstat"><div class="reveal"><div class="ssfig">${esc(d.fig)}</div><div class="sslbl">${esc(d.figlbl)}</div></div><div class="ssbody reveal"><div class="eyebrow" style="margin-bottom:1.6cqh">${d.num?`<span class="num">${esc(d.num)}</span>`:''}<span>${esc(d.eyebrow)}</span></div><h3>${esc(d.bodyTitle)}</h3><ul>${(d.points||[]).map(p=>`<li><svg class="ico"><use href="#i-check"/></svg><span>${esc(p)}</span></li>`).join('')}</ul></div></div></section>`},

banner:{label:'Capítulo / banda',group:'Estructura',desc:'Transición con número de fase',
 fields:[{k:'kicker',l:'Etiqueta (fase)',t:'text'},{k:'title',l:'Título',t:'area',hint:'<span class="acc">…</span>'},{k:'desc',l:'Descripción',t:'area'},{k:'wm',l:'Watermark',t:'text'}],
 sample:{kicker:'Fase 02 · Despliegue',title:'Ahora lo llevamos <span class="acc">a producción</span>.',desc:'De la formación al uso real, con casos de cada área.',wm:''},
 render:d=>`<section class="scene"${d.wm?` data-wm="${esc(d.wm)}"`:''}><div class="banner"><div class="bnk reveal">${esc(d.kicker)}</div><div class="bnt reveal">${esc(d.title)}</div>${d.desc?`<div class="bnd reveal">${esc(d.desc)}</div>`:''}</div></section>`}
};
const GROUPS=['Estructura','Contenido','Datos','Diagramas','Media'];

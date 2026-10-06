const englishPages={
  'help.html':{
    title:'Site help: OBS, consoles and tools | Mafia-tool.com',
    description:'Step-by-step Mafia-tool.com guides: connect OBS, upload player photos, use sports and urban consoles, manage game evenings, timers, music and saved data.',
  },
  'contacts.html':{
    title:'Contact and feedback | Mafia-tool.com',
    description:'How to contact the Mafia-tool.com team, report a bug, or suggest an improvement to tools for Mafia hosts and players.',
  },
  'dokumenty-mafii.html':{
    title:'Mafia rules documents and sources | Mafia-tool.com',
    description:'Where to find primary sources for Mafia rules: FSM, MediaGame and FIM catalogs, how to verify an edition and avoid mixing rule systems.',
  },
  'golosovanie-v-mafii.html':{
    title:'Voting in Mafia: candidates, ties, and revotes | Mafia-tool.com',
    description:'How to record and review voting in Mafia: nominations, votes, ties, revotes, and teaching examples without guessing roles.',
  },
  'kak-provesti-mafiyu.html':{
    title:'How to host a 10-player Mafia game | Mafia-tool.com',
    description:'A practical Mafia host checklist: table setup, roles, timer, journal, day, night, and the post-game review.',
  },
  'mafia-online.html':{
    title:'Online Mafia assistant - game tracker | Mafia-tool.com',
    description:'How to run an online Mafia game: record speeches, votes, Sheriff checks, and player connections. A free browser tracker with no registration.',
    howTo:{
      name:'How to track an online Mafia game with Mafia-tool.com',
      description:'Six steps for recording speeches, checks, and votes during an online game.',
      steps:[
        'Open the table and match seat numbers to players',
        'Record each speech and role read',
        'Mark Sheriff claims and checks',
        'Record the vote',
        'Compare observations across rounds',
        'Save and review the game',
      ],
    },
  },
  'pravila-sportivnoj-mafii.html':{
    title:'Sport Mafia rules for your first game | Mafia-tool.com',
    description:'A concise Sport Mafia outline: the table lineup, day, night, and questions a beginner should ask the host before the game.',
  },
  'privacy.html':{
    title:'Privacy and data | Mafia-tool.com',
    description:'How Mafia-tool.com stores games and settings in your browser, when analytics is enabled, and what data is sent through the feedback form.',
  },
  'spravochnik-mafii.html':{
    title:'Mafia guide: roles, terms, and tactics | Mafia-tool.com',
    description:"A beginner's Mafia guide: town, Mafia, Don and Sheriff, red and black checks, voting, and game analysis. Table setup and game flow.",
  },
  'terms.html':{
    title:'Terms of use | Mafia-tool.com',
    description:'Core terms for using the free Mafia-tool.com tools for hosts, observers, and players.',
  },
};

const homeMetadata={
  ru:{
    title:'Пульт ведущего мафии: таймер, роли и голоса | Mafia-tool',
    description:'Бесплатный пульт ведущего мафии: раздача ролей, таймер, фолы, голосование и ночные проверки. Сохраняйте партии, ведите заметки и сверяйтесь с правилами.',
    browserRequirements:'Требуется JavaScript; сохранения используют localStorage.',
    featureList:['Трекер голосований','Заметки и версии ролей','Проверки шерифа','Связи игроков','Таймеры речей и ночных фаз'],
  },
  en:{
    title:'Mafia-tool.com - Mafia host console and game tools',
    description:'Tools for hosting Mafia games: a host console, timers, fouls, voting, and night checks. Game history, observer notes, and a rules guide.',
    browserRequirements:'JavaScript is required; saved games use localStorage.',
    featureList:['Voting tracker','Notes and role reads','Sheriff checks','Player connections','Speech and night phase timers'],
  },
};
const homeStructuredData=new WeakMap();

function setMeta(documentRef,selector,value){
  const node=documentRef.querySelector(selector);
  if(node) node.content=value;
}

export function applyHomeMetadata(value,documentRef=globalThis.document){
  if(!documentRef) return;
  const lang=value==='en'?'en':'ru';
  const copy=homeMetadata[lang];
  documentRef.title=copy.title;
  setMeta(documentRef,'meta[name="description"]',copy.description);
  setMeta(documentRef,'meta[property="og:title"]',copy.title);
  setMeta(documentRef,'meta[property="og:description"]',copy.description);
  setMeta(documentRef,'meta[property="og:locale"]',lang==='en'?'en_US':'ru_RU');
  setMeta(documentRef,'meta[name="twitter:title"]',copy.title);
  setMeta(documentRef,'meta[name="twitter:description"]',copy.description);
  const structuredNode=documentRef.querySelector('script[type="application/ld+json"]');
  if(!structuredNode) return;
  if(!homeStructuredData.has(documentRef)) homeStructuredData.set(documentRef,JSON.parse(structuredNode.textContent));
  const data=structuredClone(homeStructuredData.get(documentRef));
  for(const item of data?.['@graph']||[]){
    if('inLanguage' in item) item.inLanguage=lang;
    if(item['@type']==='WebPage'){
      item.name=copy.title;
      item.description=copy.description;
    }
    if(item['@type']==='WebApplication'){
      item.description=copy.description;
      item.browserRequirements=copy.browserRequirements;
      item.featureList=copy.featureList;
    }
  }
  structuredNode.textContent=JSON.stringify(data);
}

const path=typeof location==='undefined'?'':location.pathname.split('/').pop()||'';
const embeddedEnglish=typeof document==='undefined'?null:document.getElementById('pageEnglishMetadata');
const english=englishPages[path]||(embeddedEnglish?JSON.parse(embeddedEnglish.textContent):null);
const button=typeof document==='undefined'?null:document.getElementById('pageLanguage');

if(english&&button){
  const replacement=button.cloneNode(true);
  button.replaceWith(replacement);
  const main=document.querySelector('main');
  const articles=[...(main?.querySelectorAll('[data-page-language]')||[])];
  const metadata={
    title:document.title,
    description:document.querySelector('meta[name="description"]')?.content||'',
  };
  const structuredNode=document.querySelector('script[type="application/ld+json"]');
  const structuredRussian=structuredNode?JSON.parse(structuredNode.textContent):null;
  const common={
    ru:{
      brand:'Mafia-tool.com, главная',
      navigation:'Основная навигация',
      libraryNavigation:'Статьи справочника',
      sidebar:'Навигация сайта',
      switcher:'Переключить страницу на английский',
      menu:'Открыть меню',
      closeMenu:'Закрыть меню',
      footer:'Разделы сайта',
      footerNote:'© 2026 Mafia-tool.com · Публичный e-mail появится после настройки доменной почты.',
    },
    en:{
      brand:'Mafia-tool.com, home',
      navigation:'Primary navigation',
      libraryNavigation:'Library articles',
      sidebar:'Site navigation',
      switcher:'Switch page to Russian',
      menu:'Open menu',
      closeMenu:'Close menu',
      footer:'Site sections',
      footerNote:'© 2026 Mafia-tool.com · A public email address will be added after domain email is configured.',
    },
  };

  function localizedStructuredData(lang){
    const data=structuredClone(structuredRussian);
    const graph=data?.['@graph']||[];
    for(const item of graph){
      if('inLanguage' in item) item.inLanguage=lang;
      if(lang==='en'&&item['@type']==='WebPage'){
        item.name=english.title;
        item.description=english.description;
      }
      if(lang==='en'&&item['@type']==='BreadcrumbList'){
        const current=item.itemListElement?.at(-1);
        if(current) current.name=english.title;
      }
      if(lang==='en'&&item['@type']==='HowTo'&&english.howTo){
        item.name=english.howTo.name;
        item.description=english.howTo.description;
        item.step?.forEach((step,index)=>{step.text=english.howTo.steps[index]||step.text;});
      }
    }
    return data;
  }

  // The help generator gives each language its own IDs. Keep shared links usable
  // when a saved language differs from the language encoded in the fragment.
  function syncHelpAnchor(lang){
    if(path!=='help.html'||!location.hash)return;
    let anchor;
    try{anchor=decodeURIComponent(location.hash.slice(1));}catch{return;}
    const section=anchor.replace(/^en-/,'');
    const targetId=(lang==='en'?'en-':'')+section;
    const target=document.getElementById(targetId);
    if(!target)return;
    if(anchor!==targetId)history.replaceState(null,'',location.pathname+location.search+'#'+targetId);
    requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
  }

  function apply(value){
    const lang=value==='en'?'en':'ru';
    const copy=common[lang];
    const page=lang==='en'?english:metadata;
    document.documentElement.lang=lang;
    articles.forEach(article=>{article.hidden=article.dataset.pageLanguage!==lang;});
    document.querySelectorAll('[data-label-ru]').forEach(element=>{
      element.textContent=lang==='en'?element.dataset.labelEn:element.dataset.labelRu;
    });
    document.title=page.title;
    setMeta(document,'meta[name="description"]',page.description);
    setMeta(document,'meta[property="og:title"]',page.title);
    setMeta(document,'meta[property="og:description"]',page.description);
    setMeta(document,'meta[property="og:locale"]',lang==='en'?'en_US':'ru_RU');
    setMeta(document,'meta[name="twitter:title"]',page.title);
    setMeta(document,'meta[name="twitter:description"]',page.description);
    document.querySelectorAll('.site-brand,.site-mobile-brand').forEach(brand=>brand.setAttribute('aria-label',copy.brand));
    document.querySelector('.site-nav[data-navigation="global"]')?.setAttribute('aria-label',copy.navigation);
    document.querySelector('.site-library-nav')?.setAttribute('aria-label',copy.libraryNavigation);
    document.getElementById('siteSidebar')?.setAttribute('aria-label',copy.sidebar);
    document.getElementById('siteMenuToggle')?.setAttribute('aria-label',copy.menu);
    document.querySelector('.site-sidebar-backdrop')?.setAttribute('aria-label',copy.closeMenu);
    document.querySelector('footer nav')?.setAttribute('aria-label',copy.footer);
    const footerNote=document.querySelector('.footer-note');
    if(footerNote) footerNote.textContent=copy.footerNote;
    replacement.textContent=lang==='ru'?'EN':'RU';
    replacement.setAttribute('aria-label',copy.switcher);
    if(structuredNode) structuredNode.textContent=JSON.stringify(localizedStructuredData(lang));
    document.dispatchEvent(new CustomEvent('protocol:language',{detail:lang}));
    syncHelpAnchor(lang);
  }

  let saved='ru';
  try{saved=localStorage.getItem('protocol-language')||'ru';}catch{}
  apply(saved);
  if(path==='help.html')window.addEventListener('hashchange',()=>syncHelpAnchor(document.documentElement.lang));
  replacement.addEventListener('click',()=>{
    const next=document.documentElement.lang==='ru'?'en':'ru';
    try{localStorage.setItem('protocol-language',next);}catch{}
    apply(next);
  });
}

const mobileQuery='(max-width: 980px)';

export function setSiteNavigationCurrent(currentId,root=globalThis.document){
  if(!root)return;
  root.querySelectorAll('#siteNav [aria-current="page"]').forEach(node=>node.removeAttribute('aria-current'));
  root.getElementById(currentId)?.setAttribute('aria-current','page');
}

export function setupSiteSidebar(root=globalThis.document){
  if(!root)return null;
  const sidebar=root.getElementById('siteSidebar');
  const toggle=root.getElementById('siteMenuToggle');
  if(!sidebar||!toggle)return null;
  if(sidebar.dataset.sidebarReady==='true')return sidebar._siteSidebarApi||null;

  const documentRef=root;
  const windowRef=documentRef.defaultView||globalThis.window;
  const backdrop=root.querySelector('.site-sidebar-backdrop');
  const media=windowRef.matchMedia(mobileQuery);
  const languageHome=sidebar.querySelector('.site-sidebar-foot');
  let returnFocus=null;

  const placeLanguageSwitch=()=>{
    const language=documentRef.getElementById('pageLanguage');
    if(!language)return;
    const target=media.matches?documentRef.querySelector('.site-mobile-bar'):languageHome;
    if(target&&language.parentElement!==target)target.append(language);
  };

  const focusable=()=>[...sidebar.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')]
    .filter(node=>!node.hidden&&node.getClientRects().length);

  const setToggleLabel=open=>{
    const english=documentRef.documentElement.lang==='en';
    toggle.setAttribute('aria-label',open
      ?(english?'Close menu':'Закрыть меню')
      :(english?'Open menu':'Открыть меню'));
  };

  const close=({restoreFocus=true}={})=>{
    sidebar.classList.remove('is-open');
    documentRef.body.classList.remove('site-sidebar-open');
    toggle.setAttribute('aria-expanded','false');
    if(media.matches)sidebar.setAttribute('aria-hidden','true');
    else sidebar.removeAttribute('aria-hidden');
    if(backdrop)backdrop.hidden=true;
    setToggleLabel(false);
    if(restoreFocus&&returnFocus&&typeof returnFocus.focus==='function')returnFocus.focus();
    returnFocus=null;
  };

  const open=()=>{
    if(!media.matches)return;
    returnFocus=documentRef.activeElement;
    sidebar.classList.add('is-open');
    documentRef.body.classList.add('site-sidebar-open');
    sidebar.removeAttribute('aria-hidden');
    toggle.setAttribute('aria-expanded','true');
    if(backdrop)backdrop.hidden=false;
    setToggleLabel(true);
    windowRef.requestAnimationFrame(()=>focusable()[0]?.focus());
  };

  const syncViewport=()=>{
    close({restoreFocus:false});
    if(media.matches)sidebar.setAttribute('aria-hidden','true');
    else sidebar.removeAttribute('aria-hidden');
    placeLanguageSwitch();
  };

  toggle.addEventListener('click',()=>sidebar.classList.contains('is-open')?close():open());
  backdrop?.addEventListener('click',()=>close());
  sidebar.addEventListener('click',event=>{
    if(!media.matches||!event.target.closest('a[href],[data-sidebar-close]'))return;
    const button=event.target.closest('button');
    close({restoreFocus:Boolean(button)&&sidebar.contains(documentRef.activeElement)});
  });
  documentRef.addEventListener('keydown',event=>{
    if(!media.matches||!sidebar.classList.contains('is-open'))return;
    if(event.key==='Escape'){
      event.preventDefault();
      close();
      return;
    }
    if(event.key!=='Tab')return;
    const nodes=focusable();
    if(!nodes.length)return;
    const first=nodes[0],last=nodes.at(-1);
    if(event.shiftKey&&documentRef.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&documentRef.activeElement===last){event.preventDefault();first.focus();}
  });
  media.addEventListener?.('change',syncViewport);
  documentRef.documentElement.classList.add('site-sidebar-ready');
  sidebar.dataset.sidebarReady='true';
  syncViewport();
  const api={open,close,syncViewport};
  sidebar._siteSidebarApi=api;
  return api;
}

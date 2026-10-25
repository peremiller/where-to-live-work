/* Compass 64-profile planning guide. Ratings and mappings are editorial heuristics. */
(() => {
  'use strict';
  const DIMS = ['focus','social','creative','technical','enterprise','routine','community','outdoors','autonomy'];
  const LABELS = {focus:'space for focused work',social:'access to social and professional networks',creative:'creative opportunities',technical:'technical and research opportunities',enterprise:'business and leadership opportunities',routine:'a structured daily routine',community:'community connections',outdoors:'access to outdoor activities',autonomy:'independent working options'};
  const SOURCES = {
    ayala:['Ayala Land: integrated estates','https://ir.ayalaland.com.ph/about-us/'],
    baguio:['UNESCO: Baguio crafts and folk art','https://www.unesco.org/en/creative-cities/baguio-city?hub=80094'],
    qc:['Quezon City: creative cities alliance','https://quezoncity.gov.ph/unesco-creative-cities-alliance-and-filmmakers-fellowship/'],
    sg:['JTC: Punggol Digital District','https://www.jtc.gov.sg/punggoldigitaldistrict'],
    amsterdam:['City of Amsterdam: startup ecosystem','https://www.iamsterdam.com/en/business/startupamsterdam'],
    zurich:['Zurich Tourism: technology ecosystem','https://www.zuerich.com/en/business/ict-companies-in-zurich'],
    copenhagen:['City of Copenhagen: cycling','https://international.kk.dk/live/transport-and-parking/cycling-in-copenhagen'],
    mbti:['Myers & Briggs Foundation: type and careers','https://www.myersbriggs.org/type-in-my-life/personality-type-and-careers/']
  };
  // 1–5 planning ratings for the named districts, not measured city statistics.
  // Separate live/work ratings prevent residential preferences becoming job-market claims.
  const PLACES = [
    {id:'bgc',name:'BGC, Taguig',country:'Philippines',region:'ph',live:'Residential streets near BGC parks; inspect building noise and the actual walk to work.',work:'BGC corporate offices, product teams and shared workspaces.',context:'A mixed-use base to investigate when keeping work and daily errands close together matters.',watch:'Compare rent, association dues, heat and peak-hour routes; a nearby office is useful only if your employer uses it.',source:'ayala',liveRatings:[3,5,3,4,5,4,3,3,4],workRatings:[3,5,3,4,5,4,3,2,4]},
    {id:'makati',name:'Makati',country:'Philippines',region:'ph',live:'Salcedo or Legazpi Village, with a route and noise check at the exact unit.',work:'Ayala CBD offices, professional services and client-facing teams.',context:'Explore an established mixed-use business district with a defined home-to-office routine.',watch:'Price the full housing cost and test traffic, street noise and the building at your actual work hours.',source:'ayala',liveRatings:[3,5,3,3,5,5,3,2,3],workRatings:[3,5,3,3,5,5,3,1,3]},
    {id:'alabang',name:'Alabang, Muntinlupa',country:'Philippines',region:'ph',live:'A residential base around Alabang, selected around your family and daily errands.',work:'Alabang offices or an employer-approved home office with occasional city meetings.',context:'A southern Metro Manila option when a residential routine matters alongside access to business estates.',watch:'Check transport options and door-to-door travel to the actual employer; cross-metro commutes can erase the benefit.',source:'ayala',liveRatings:[5,3,2,3,3,5,5,3,4],workRatings:[4,3,2,3,3,5,4,2,3]},
    {id:'nuvali',name:'Nuvali / Santa Rosa',country:'Philippines',region:'ph',live:'A Nuvali-area home with a daily route to services and recreation.',work:'A verified local employer or a reliable remote setup rather than an assumed daily BGC commute.',context:'Consider a planned mixed-use estate when home space and an outdoor routine are important.',watch:'Confirm internet and backup power at the property, transport dependence and the real commute before signing.',source:'ayala',liveRatings:[5,2,2,3,3,4,4,5,4],workRatings:[4,2,2,3,3,4,3,3,4]},
    {id:'cebu',name:'Cebu City',country:'Philippines',region:'ph',live:'A residential street near Cebu IT Park or Cebu Business Park, after a noise and route test.',work:'Cebu Park District offices, technology services and shared workspaces.',context:'Investigate a regional mixed-use work base with room to build a local professional network.',watch:'Validate the exact employer, work schedule, flood exposure and internet service at the chosen address.',source:'ayala',liveRatings:[3,4,3,4,4,3,4,3,4],workRatings:[3,4,3,4,4,4,4,2,4]},
    {id:'baguio',name:'Baguio City',country:'Philippines',region:'ph',live:'A residential street away from visitor bottlenecks, near your regular services.',work:'Craft and creative collaborations, education-related work, or an approved remote role.',context:'UNESCO documents a local crafts and folk-art ecosystem; explore its relevance to your own work.',watch:'Confirm real openings, internet, accessibility and the commute during busy periods; arts activity does not guarantee employment.',source:'baguio',liveRatings:[5,3,5,2,2,3,4,4,5],workRatings:[4,3,5,2,2,3,4,3,5]},
    {id:'qc',name:'Quezon City',country:'Philippines',region:'ph',live:'Diliman or another neighborhood near your chosen work, school or community activities.',work:'Creative and film collaborations, education-oriented organizations or a verified local office.',context:'The city government documents a creative-city alliance around film and cultural collaboration.',watch:'Quezon City covers a large area: inspect the specific street for transport, noise, flooding and access to essentials.',source:'qc',liveRatings:[4,4,5,3,3,3,5,3,4],workRatings:[3,4,5,3,3,3,5,2,4]},
    {id:'singapore',name:'Singapore',country:'Singapore',region:'international',live:'A residential neighborhood chosen around your actual office and transit route.',work:'Punggol Digital District or another verified technology and business employer.',context:'JTC describes an innovation, education and business ecosystem at Punggol Digital District.',watch:'Establish work authorization and a real offer first, then compare take-home income against housing and other recurring costs.',source:'sg',liveRatings:[4,4,3,5,5,5,3,3,3],workRatings:[4,5,3,5,5,5,4,2,3]},
    {id:'amsterdam',name:'Amsterdam',country:'Netherlands',region:'international',live:'A residential neighborhood matched to the office route and your preferred social schedule.',work:'Startups, innovation teams and coworking communities in the StartupAmsterdam network.',context:'The city-backed startup initiative connects founders, workspaces, investors and mentors.',watch:'Secure housing, work authorization and a realistic offer; a startup ecosystem does not establish vacancy or visa eligibility.',source:'amsterdam',liveRatings:[3,5,5,4,4,3,4,3,5],workRatings:[3,5,5,4,4,3,4,2,5]},
    {id:'zurich',name:'Zurich',country:'Switzerland',region:'international',live:'A residential district selected around the actual employer and a manageable daily routine.',work:'ICT, engineering, research or other employers in Zurich’s documented technology ecosystem.',context:'Zurich Tourism describes a network of technology firms, startups and university spin-offs.',watch:'Confirm work authorization, language requirements and an offer before comparing housing, insurance and total living costs.',source:'zurich',liveRatings:[5,3,3,5,4,5,3,4,3],workRatings:[5,3,3,5,4,5,3,3,3]},
    {id:'copenhagen',name:'Copenhagen',country:'Denmark',region:'international',live:'A home with an everyday cycling or transit route that you can test in different weather.',work:'An employer-approved remote role or a separately verified local opportunity.',context:'The city describes cycling as part of everyday transport; use this to explore a routine with outdoor travel.',watch:'Verify work authorization, the local role or remote-work permission, housing and winter routines. Cycling access is not job-market evidence.',source:'copenhagen',liveRatings:[4,4,3,3,3,5,4,5,4],workRatings:[4,3,3,3,3,4,4,3,4]}
  ];
  const TYPES = [
    ['INTJ','Strategic planner','Analysts','Systems design, long-range strategy and independent problem solving.','architecture, strategy or quality engineering',[5,1,2,5,3,3,1,2,4],[5,1,2,5,4,3,1,1,4]],
    ['INTP','Analytical explorer','Analysts','Time to investigate ideas, question assumptions and build original models.','research, data analysis or software development',[5,1,4,5,1,1,1,2,5],[5,2,4,5,1,1,2,1,5]],
    ['ENTJ','Organizing leader','Analysts','Leading decisions, mobilizing resources and making progress visible.','program leadership, operations or business strategy',[2,4,2,3,5,4,2,2,3],[2,5,2,4,5,4,2,1,3]],
    ['ENTP','Idea challenger','Analysts','Exchanging ideas, experimenting and connecting emerging opportunities.','product innovation, entrepreneurship or consulting',[2,5,5,4,4,1,2,2,5],[2,5,5,4,4,1,2,1,5]],
    ['INFJ','Purposeful guide','Diplomats','Meaningful work, reflection and sustained relationships with a clear purpose.','counseling, service design or organizational development',[5,1,3,1,1,3,5,4,3],[4,3,3,2,1,3,5,1,3]],
    ['INFP','Values-led creator','Diplomats','Creative independence, personal meaning and a supportive community.','writing, design or mission-driven project work',[5,1,5,1,1,1,4,4,5],[4,2,5,1,1,1,5,2,5]],
    ['ENFJ','Community builder','Diplomats','Bringing people together, coaching and helping a team grow.','learning and development, community programs or people leadership',[2,5,3,1,2,3,5,3,2],[2,5,3,1,3,3,5,1,2]],
    ['ENFP','Possibility connector','Diplomats','Variety, creative collaboration and people-centered experimentation.','communications, creative strategy or community entrepreneurship',[2,5,5,2,2,1,5,3,4],[2,5,5,2,3,1,5,1,4]],
    ['ISTJ','Reliable organizer','Sentinels','Clear expectations, consistent routines and careful delivery.','quality assurance, compliance, accounting or operations',[5,1,1,3,2,5,3,2,2],[5,1,1,4,3,5,3,1,2]],
    ['ISFJ','Practical supporter','Sentinels','Stable daily routines, useful service and close community ties.','healthcare administration, client support or service operations',[5,1,1,1,1,5,5,3,2],[4,2,1,2,2,5,5,1,2]],
    ['ESTJ','Delivery leader','Sentinels','Organized teams, explicit responsibilities and measurable execution.','operations management, delivery leadership or administration',[2,4,1,2,5,5,3,2,2],[2,4,1,3,5,5,3,1,2]],
    ['ESFJ','People coordinator','Sentinels','Regular social contact, practical teamwork and visible community contribution.','customer success, event operations or people services',[2,5,1,1,2,5,5,2,1],[2,5,1,1,3,5,5,1,1]],
    ['ISTP','Hands-on solver','Explorers','Practical troubleshooting, technical autonomy and room to explore.','engineering, cybersecurity, technical repair or field work',[5,1,2,5,1,2,1,5,5],[5,1,2,5,2,2,1,3,5]],
    ['ISFP','Independent maker','Explorers','Creative practice, flexible routines and an environment with outdoor options.','design, craft, visual production or hands-on services',[5,1,5,1,1,1,3,5,5],[4,2,5,2,1,1,3,3,5]],
    ['ESTP','Action-oriented operator','Explorers','Fast feedback, hands-on activity and direct contact with people.','sales, field operations, logistics or entrepreneurship',[1,5,2,3,5,1,2,4,4],[1,5,2,3,5,1,2,3,4]],
    ['ESFP','Experience maker','Explorers','Active social settings, variety and creating useful experiences for others.','hospitality, events, performance or customer experience',[1,5,5,1,2,1,4,4,4],[1,5,5,1,3,1,4,2,4]]
  ].map(([code,name,group,summary,roles,liveWeights,workWeights])=>({code,name,group,summary,roles,liveWeights,workWeights}));
  const VARIANTS = [
    {code:'AC',name:'Assertive · Cooperative',note:'Explore visible collaboration and team ownership; keep a place to recharge.',add:{social:1,enterprise:1,community:2}},
    {code:'AS',name:'Assertive · Self-directed',note:'Explore project ownership, flexible work settings and a home that supports independent goals.',add:{enterprise:1,autonomy:3,focus:1}},
    {code:'TC',name:'Turbulent · Cooperative',note:'If this description fits you, prioritize predictable routines, supportive feedback and a reliable local network.',add:{routine:2,community:3,focus:1}},
    {code:'TS',name:'Turbulent · Self-directed',note:'If this description fits you, prioritize protected focus time, control over your schedule and a dependable daily routine.',add:{routine:2,focus:3,autonomy:2}}
  ];
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const profiles=TYPES.flatMap(type=>VARIANTS.map(variant=>({id:`${type.code}-${variant.code}`,type,variant})));
  let saved=null;
  try {saved=JSON.parse(localStorage.getItem('compass.personality.v1'));} catch {}
  const params=new URLSearchParams(location.search);
  let selected=profiles.find(p=>p.id===params.get('profile')) || profiles.find(p=>p.id===saved?.profile) || profiles[0];
  let scope=['all','ph','international'].includes(params.get('scope'))?params.get('scope'):(['all','ph','international'].includes(saved?.scope)?saved.scope:'all');
  let mode=['any','onsite','remote'].includes(params.get('mode'))?params.get('mode'):(['any','onsite','remote'].includes(saved?.mode)?saved.mode:'any');
  function weights(p,kind){return p.type[`${kind}Weights`].map((w,i)=>w+(p.variant.add[DIMS[i]]||0));}
  function effectiveWeights(p,kind){return weights(p,kind).map((v,i)=>kind==='work'&&mode==='remote'&&['technical','enterprise'].includes(DIMS[i])?Math.max(1,v-3):v);}
  function rate(place,p,kind){
    const w=effectiveWeights(p,kind);
    const ratings=kind==='work'&&mode==='remote'?place.liveRatings:place[`${kind}Ratings`];
    // Remote suitability considers the environment, not assumed local vacancies.
    const adjusted=w;
    return adjusted.reduce((sum,v,i)=>sum+v*ratings[i],0)/adjusted.reduce((a,b)=>a+b,0);
  }
  function recommendations(p,kind){
    return PLACES.filter(c=>(scope==='all'||scope===c.region)&&!(kind==='work'&&mode==='onsite'&&['nuvali','copenhagen'].includes(c.id)))
      .map(place=>({place,value:rate(place,p,kind)})).sort((a,b)=>b.value-a.value||a.place.name.localeCompare(b.place.name)).slice(0,3);
  }
  function reasons(place,p,kind){
    const w=effectiveWeights(p,kind),ratings=kind==='work'&&mode==='remote'?place.liveRatings:place[`${kind}Ratings`];
    return DIMS.map((d,i)=>({d,value:w[i]*ratings[i],rating:ratings[i]})).filter(x=>x.rating>=3)
      .sort((a,b)=>b.value-a.value).slice(0,2).map(x=>LABELS[x.d]);
  }
  function sourceLink(key){const [label,url]=SOURCES[key];return `<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;}
  function placeCard(entry,index,p,kind){
    const c=entry.place,why=reasons(c,p,kind);
    const remote=kind==='work'&&mode==='remote';
    const search=remote?'remote '+p.type.roles:c.name+' '+p.type.roles;
    return `<article class="p-place"><div class="p-place-heading"><span class="p-rank">${index+1}</span><div><h4>${esc(c.name)}</h4><small>${esc(c.country)} · ${index===0?'Leading suggestion':'Alternative to investigate'}</small></div></div>
      <p><b>${kind==='live'?'Living setup':'Working setup'}</b><br>${esc(remote?'Employer-approved remote work from a verified home office or coworking space.':c[kind])}</p>
      <div class="p-why"><b>Why it may fit ${esc(p.id)}</b><span>${esc(why.join(' + '))}.</span></div>
      <p>${esc(c.context)}${kind==='work'?` <b>Explore:</b> ${esc(p.type.roles)}. These are role ideas, not verified vacancies.`:''}</p>
      <p><b>Check first</b><br>${esc(c.watch)}${remote?' Confirm broadband, backup power, time zones and employer permission for this exact location.':''}</p>
      <div class="p-links">${sourceLink(c.source)}<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name)}" target="_blank" rel="noopener noreferrer">Explore area ↗</a>${kind==='work'?`<a href="https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(search)}&location=${encodeURIComponent(c.name)}" target="_blank" rel="noopener noreferrer">Search roles ↗</a>`:''}</div></article>`;
  }
  function updateURL(){
    if(location.pathname!=='/personality')return;
    const url=new URL(location.href);url.searchParams.set('profile',selected.id);url.searchParams.set('scope',scope);url.searchParams.set('mode',mode);
    history.replaceState({...history.state},'',url.pathname+url.search);
  }
  function persist(){try{localStorage.setItem('compass.personality.v1',JSON.stringify({profile:selected.id,scope,mode}));}catch{}updateURL();}
  function renderSelected(){
    const p=selected;
    $('p-profile-summary').innerHTML=`<div class="p-eyebrow">Your selected profile</div><h2>${esc(p.id)} · ${esc(p.type.name)}</h2><p>${esc(p.variant.name)} · ${esc(p.type.group)}</p><p>${esc(p.type.summary)}</p><p>${esc(p.variant.note)}</p><div class="p-chips">${[...new Set([...reasons(recommendations(p,'live')[0].place,p,'live'),...reasons(recommendations(p,'work')[0].place,p,'work')])].map(x=>`<span class="p-chip">${esc(x)}</span>`).join('')}</div>`;
    $('p-live-results').innerHTML=recommendations(p,'live').map((c,i)=>placeCard(c,i,p,'live')).join('');
    $('p-work-results').innerHTML=recommendations(p,'work').map((c,i)=>placeCard(c,i,p,'work')).join('');
    $('p-active-context').textContent=`${scope==='all'?'Philippine and international':scope==='ph'?'Philippine':'International'} candidates · ${mode==='remote'?'remote work from a verified base':mode==='onsite'?'local workplace options to investigate':'local workplace and remote-base options'}. Suggestions compare ${PLACES.filter(x=>scope==='all'||x.region===scope).length} curated places, not every city in the world. Personality fit does not establish affordability, safety, job availability or permission to live and work there.`;
    renderDirectory();
  }
  function renderDirectory(){
    const query=$('p-search').value.trim().toLowerCase(),group=$('p-group').value;
    const list=profiles.filter(p=>{
      if(group!=='all'&&p.type.group!==group)return false;
      const entries=[...recommendations(p,'live'),...recommendations(p,'work')];
      return [p.id,p.type.name,p.variant.name,p.type.group,p.type.roles,...entries.map(x=>x.place.name)].join(' ').toLowerCase().includes(query);
    });
    $('p-directory-count').textContent=`${list.length} of 64 profiles shown`;
    $('p-directory-grid').innerHTML=list.length?list.map(p=>{
      const live=recommendations(p,'live')[0].place,work=recommendations(p,'work')[0].place;
      return `<article class="p-directory-card" data-selected="${p.id===selected.id}"><h3>${esc(p.id)} <span style="color:var(--txt);font-weight:500">${esc(p.type.name)}</span></h3><p>${esc(p.variant.name)}</p><p><b>Live:</b> ${esc(live.name)}<br><b>${mode==='remote'?'Work remotely from':'Work'}:</b> ${esc(work.name)}</p><button type="button" class="btn sm" data-profile="${p.id}" aria-label="View ${p.id} place recommendations">View profile →</button></article>`;
    }).join(''):'<div class="p-empty">No profiles match. Try a base type such as INTJ, a variant such as Cooperative, or a suggested place.</div>';
  }
  function exportCSV(){
    const rows=[['Profile','Base type','Variant','Scope','Work mode','Leading live suggestion','Leading work suggestion','Role ideas','Basis'],...profiles.map(p=>[p.id,p.type.name,p.variant.name,scope,mode,recommendations(p,'live')[0].place.name,recommendations(p,'work')[0].place.name,p.type.roles,'Editorial planning heuristic; not validated city-personality matching'])];
    const csv='\uFEFF'+rows.map(row=>row.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='compass-64-personality-places.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    $('p-feedback').textContent='Exported all 64 profiles using your current region and work-mode filters.';
  }
  function init(){
    $('p-type').innerHTML=TYPES.map(t=>`<option value="${t.code}">${t.code} · ${esc(t.name)}</option>`).join('');
    $('p-variant').innerHTML=VARIANTS.map(v=>`<option value="${v.code}">${v.code} · ${esc(v.name)}</option>`).join('');
    $('p-type').value=selected.type.code;$('p-variant').value=selected.variant.code;$('p-scope').value=scope;$('p-mode').value=mode;
    $('p-ratings').innerHTML=`<div class="p-rating-wrap" tabindex="0" role="region" aria-label="Scrollable editorial planning ratings"><table><caption>Living / working ratings, 1–5. Subjective planning assumptions.</caption><thead><tr><th scope="col">Place</th>${DIMS.map(d=>`<th scope="col">${esc(d)}</th>`).join('')}</tr></thead><tbody>${PLACES.map(c=>`<tr><th scope="row">${esc(c.name)}</th>${c.liveRatings.map((n,i)=>`<td>${n} / ${c.workRatings[i]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    $('p-sources').innerHTML=Object.keys(SOURCES).map(k=>`<li>${sourceLink(k)}</li>`).join('');
    ['p-type','p-variant'].forEach(id=>$(id).addEventListener('change',()=>{selected=profiles.find(p=>p.id===`${$('p-type').value}-${$('p-variant').value}`);persist();renderSelected();}));
    $('p-scope').addEventListener('change',()=>{scope=$('p-scope').value;persist();renderSelected();});
    $('p-mode').addEventListener('change',()=>{mode=$('p-mode').value;persist();renderSelected();});
    $('p-search').addEventListener('input',renderDirectory);$('p-group').addEventListener('change',renderDirectory);
    $('p-directory-grid').addEventListener('click',event=>{const button=event.target.closest('button[data-profile]');if(!button)return;selected=profiles.find(p=>p.id===button.dataset.profile);$('p-type').value=selected.type.code;$('p-variant').value=selected.variant.code;persist();renderSelected();$('p-profile-summary').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});$('p-profile-summary').focus({preventScroll:true});});
    $('p-export').addEventListener('click',exportCSV);
    $('p-copy').addEventListener('click',async()=>{const url=new URL('/personality',location.origin);url.searchParams.set('profile',selected.id);url.searchParams.set('scope',scope);url.searchParams.set('mode',mode);try{await navigator.clipboard.writeText(url.href);$('p-feedback').textContent='Link copied for '+selected.id;}catch{$('p-feedback').textContent='Share this address: '+url.href;}});
    addEventListener('popstate',()=>{const q=new URLSearchParams(location.search),p=profiles.find(p=>p.id===q.get('profile'));if(p){selected=p;$('p-type').value=p.type.code;$('p-variant').value=p.variant.code;}if(['all','ph','international'].includes(q.get('scope')))scope=q.get('scope');if(['any','onsite','remote'].includes(q.get('mode')))mode=q.get('mode');$('p-scope').value=scope;$('p-mode').value=mode;renderSelected();});
    renderSelected();
  }
  init();
})();

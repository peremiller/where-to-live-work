/* Compass 64-profile planning guide. Ratings and mappings are editorial heuristics. */
(() => {
  'use strict';
  const DIMS = ['focus','social','creative','technical','enterprise','routine','community','outdoors','autonomy'];
  const STRENGTH_DOMAINS = {
    'Executing':['Achiever','Arranger','Belief','Consistency','Deliberative','Discipline','Focus','Responsibility','Restorative'],
    'Influencing':['Activator','Command','Communication','Competition','Maximizer','Self-Assurance','Significance','Woo'],
    'Relationship Building':['Adaptability','Connectedness','Developer','Empathy','Harmony','Includer','Individualization','Positivity','Relator'],
    'Strategic Thinking':['Analytical','Context','Futuristic','Ideation','Input','Intellection','Learner','Strategic']
  };
  const THEMES=Object.values(STRENGTH_DOMAINS).flat();
  const THEME_ACTIVITIES={
    Achiever:'Plan regular goals and visible progress.',Arranger:'Coordinate people, spaces and resources.',Belief:'Make room for personally meaningful activities.',Consistency:'Look for clear shared rules and dependable routines.',Deliberative:'Compare options carefully before committing.',Discipline:'Build an organized daily structure.',Focus:'Protect time for the priorities you choose.',Responsibility:'Find work with clear ownership and follow-through.',Restorative:'Explore troubleshooting and improvement projects.',
    Activator:'Find opportunities to start practical experiments.',Command:'Explore settings where you can clarify decisions.',Communication:'Look for opportunities to explain ideas and share stories.',Competition:'Choose meaningful benchmarks for your own goals.',Maximizer:'Seek opportunities to improve work that is already strong.','Self-Assurance':'Make room to exercise independent judgment.',Significance:'Look for work whose contribution you value.',Woo:'Find opportunities to meet new people.',
    Adaptability:'Leave room for changing plans and new experiences.',Connectedness:'Explore how your work connects to a wider purpose.',Developer:'Look for mentoring and development activities.',Empathy:'Make space to listen to individual experiences.',Harmony:'Explore cooperative ways to resolve differences.',Includer:'Look for activities that welcome participation.',Individualization:'Adapt support and collaboration to the individual.',Positivity:'Find opportunities to encourage progress.',Relator:'Make time for sustained working relationships.',
    Analytical:'Investigate evidence and compare explanations.',Context:'Learn from history and earlier decisions.',Futuristic:'Explore possibilities and longer-term plans.',Ideation:'Make room to develop and connect ideas.',Input:'Find useful resources and collect what informs your work.',Intellection:'Protect time to think and reflect.',Learner:'Build regular opportunities to study and practise.',Strategic:'Compare alternative routes toward a goal.'
  };
  // Editorial activity tags for living and working setups; not Gallup city ratings.
  const STRENGTH_TAGS={
    bgc:{live:['Achiever','Activator','Competition','Focus','Significance','Woo'],work:['Achiever','Activator','Command','Communication','Competition','Futuristic','Maximizer','Significance','Strategic','Woo']},
    makati:{live:['Achiever','Consistency','Deliberative','Discipline','Focus','Responsibility'],work:['Arranger','Command','Communication','Competition','Consistency','Maximizer','Responsibility','Self-Assurance','Woo']},
    alabang:{live:['Belief','Consistency','Discipline','Empathy','Harmony','Relator','Responsibility'],work:['Arranger','Developer','Empathy','Harmony','Individualization','Relator','Responsibility']},
    nuvali:{live:['Connectedness','Deliberative','Discipline','Focus','Futuristic','Intellection','Relator'],work:['Analytical','Discipline','Focus','Futuristic','Responsibility','Restorative']},
    cebu:{live:['Adaptability','Connectedness','Includer','Positivity','Relator','Woo'],work:['Achiever','Adaptability','Arranger','Communication','Developer','Includer','Restorative','Woo']},
    baguio:{live:['Belief','Connectedness','Context','Empathy','Ideation','Input','Intellection','Learner'],work:['Belief','Context','Developer','Ideation','Individualization','Input','Intellection','Learner']},
    qc:{live:['Connectedness','Context','Includer','Input','Learner','Positivity','Relator'],work:['Communication','Context','Developer','Empathy','Ideation','Includer','Individualization','Positivity']},
    singapore:{live:['Achiever','Consistency','Deliberative','Discipline','Focus'],work:['Achiever','Analytical','Arranger','Command','Competition','Futuristic','Learner','Maximizer','Restorative','Strategic']},
    amsterdam:{live:['Adaptability','Communication','Ideation','Includer','Input','Positivity','Woo'],work:['Activator','Adaptability','Communication','Futuristic','Ideation','Individualization','Self-Assurance','Strategic','Woo']},
    zurich:{live:['Analytical','Deliberative','Discipline','Focus','Intellection','Learner'],work:['Analytical','Deliberative','Focus','Input','Intellection','Learner','Maximizer','Responsibility','Restorative','Strategic']},
    copenhagen:{live:['Adaptability','Belief','Connectedness','Consistency','Harmony','Relator','Responsibility'],work:['Belief','Connectedness','Discipline','Focus','Harmony','Responsibility']}
  };
  const LABELS = {focus:'space for focused work',social:'access to social and professional networks',creative:'creative opportunities',technical:'technical and research opportunities',enterprise:'business and leadership opportunities',routine:'a structured daily routine',community:'community connections',outdoors:'access to outdoor activities',autonomy:'independent working options'};
  const SOURCES = {
    ayala:['Ayala Land: integrated estates','https://ir.ayalaland.com.ph/about-us/'],
    baguio:['UNESCO: Baguio crafts and folk art','https://www.unesco.org/en/creative-cities/baguio-city?hub=80094'],
    qc:['Quezon City: creative cities alliance','https://quezoncity.gov.ph/unesco-creative-cities-alliance-and-filmmakers-fellowship/'],
    sg:['JTC: Punggol Digital District','https://www.jtc.gov.sg/punggoldigitaldistrict'],
    amsterdam:['City of Amsterdam: startup ecosystem','https://www.iamsterdam.com/en/business/startupamsterdam'],
    zurich:['Zurich Tourism: technology ecosystem','https://www.zuerich.com/en/business/ict-companies-in-zurich'],
    copenhagen:['City of Copenhagen: cycling','https://international.kk.dk/live/transport-and-parking/cycling-in-copenhagen'],
    mbti:['Myers & Briggs Foundation: type and careers','https://www.myersbriggs.org/type-in-my-life/personality-type-and-careers/'],
    gallup:['Gallup: all 34 CliftonStrengths themes','https://www.gallup.com/cliftonstrengths/en/253715/34-cliftonstrengths-themes.aspx'],
    domains:['Gallup: the four CliftonStrengths domains','https://www.gallup.com/cliftonstrengths/en/253736/cliftonstrengths-domains.aspx']
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
  let selectedStrengths=[...new Set((params.has('strengths')?(params.get('strengths')||'').split(','):(Array.isArray(saved?.strengths)?saved.strengths:[])).filter(t=>THEMES.includes(t)))];
  let strengthMatch=(params.get('match')||saved?.strengthMatch)==='all'?'all':'any';
  const initialStrengthDomain=params.has('domain')?params.get('domain'):saved?.strengthDomain;
  let strengthDomain=Object.hasOwn(STRENGTH_DOMAINS,initialStrengthDomain)?initialStrengthDomain:'all';
  function strengthTags(place,kind){return STRENGTH_TAGS[place.id]?.[kind]||[];}
  function matchesStrengths(place,kind){
    const tags=strengthTags(place,kind);
    if(strengthDomain!=='all'&&!tags.some(t=>STRENGTH_DOMAINS[strengthDomain].includes(t)))return false;
    return !selectedStrengths.length||(strengthMatch==='all'?selectedStrengths.every(t=>tags.includes(t)):selectedStrengths.some(t=>tags.includes(t)));
  }
  function strengthClass(theme){return ['Executing','Influencing','Relationship Building','Strategic Thinking'].indexOf(Object.keys(STRENGTH_DOMAINS).find(d=>STRENGTH_DOMAINS[d].includes(theme)));}
  function strengthButtons(tags){return tags.map(t=>`<button type="button" class="p-strength-tag p-domain-${strengthClass(t)}" data-strength="${esc(t)}" aria-pressed="${selectedStrengths.includes(t)}" title="${esc(THEME_ACTIVITIES[t])}">${esc(t)}</button>`).join('');}
  function setStrengthParams(url){url.searchParams.set('strengths',selectedStrengths.join(','));url.searchParams.set('match',strengthMatch);url.searchParams.set('domain',strengthDomain);}
  function renderStrengthFilters(){
    $('p-strength-selected').innerHTML=selectedStrengths.length?strengthButtons(selectedStrengths):'<span class="muted">No themes selected · all tagged places are eligible</span>';
    $('p-strength-count').textContent=`${selectedStrengths.length} theme${selectedStrengths.length===1?'':'s'} selected`;
    $('p-strength-options').querySelectorAll('input').forEach(input=>{input.checked=selectedStrengths.includes(input.value);});
    $('p-strength-match').value=strengthMatch;$('p-strength-domain').value=strengthDomain;
    $('p-strength-activities').innerHTML=selectedStrengths.map(t=>`<li><b>${esc(t)}:</b> ${esc(THEME_ACTIVITIES[t])}</li>`).join('');
  }
  function toggleStrength(theme){if(!THEMES.includes(theme))return;selectedStrengths=selectedStrengths.includes(theme)?selectedStrengths.filter(t=>t!==theme):[...selectedStrengths,theme];persist();renderSelected();}
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
    return PLACES.filter(c=>(scope==='all'||scope===c.region)&&!(kind==='work'&&mode==='onsite'&&['nuvali','copenhagen'].includes(c.id))&&matchesStrengths(c,kind))
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
      <div class="p-place-strengths"><b>CliftonStrengths activity tags</b><div class="p-strength-tags">${strengthButtons(strengthTags(c,kind))}</div>${selectedStrengths.length?`<small>${strengthTags(c,kind).filter(t=>selectedStrengths.includes(t)).length} of ${selectedStrengths.length} selected themes tagged</small>`:''}</div>
      <p>${esc(c.context)}${kind==='work'?` <b>Explore:</b> ${esc(p.type.roles)}. These are role ideas, not verified vacancies.`:''}</p>
      <p><b>Check first</b><br>${esc(c.watch)}${remote?' Confirm broadband, backup power, time zones and employer permission for this exact location.':''}</p>
      <div class="p-links">${sourceLink(c.source)}<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name)}" target="_blank" rel="noopener noreferrer">Explore area ↗</a>${kind==='work'?`<a href="https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(search)}&location=${encodeURIComponent(c.name)}" target="_blank" rel="noopener noreferrer">Search roles ↗</a>`:''}</div></article>`;
  }
  function updateURL(){
    if(location.pathname!=='/personality')return;
    const url=new URL(location.href);url.searchParams.set('profile',selected.id);url.searchParams.set('scope',scope);url.searchParams.set('mode',mode);
    setStrengthParams(url);
    history.replaceState({...history.state},'',url.pathname+url.search);
  }
  function persist(){try{localStorage.setItem('compass.personality.v1',JSON.stringify({profile:selected.id,scope,mode,strengths:selectedStrengths,strengthMatch,strengthDomain}));}catch{}updateURL();}
  function renderSelected(){
    const p=selected,live=recommendations(p,'live'),work=recommendations(p,'work');
    const factors=[...new Set([...(live.length?reasons(live[0].place,p,'live'):[]),...(work.length?reasons(work[0].place,p,'work'):[])])];
    $('p-profile-summary').innerHTML=`<div class="p-eyebrow">Your selected profile</div><h2>${esc(p.id)} · ${esc(p.type.name)}</h2><p>${esc(p.variant.name)} · ${esc(p.type.group)}</p><p>${esc(p.type.summary)}</p><p>${esc(p.variant.note)}</p><div class="p-chips">${factors.map(x=>`<span class="p-chip">${esc(x)}</span>`).join('')}</div>`;
    const empty='<div class="p-empty">No place matches these filters. Try Match any, another region, or fewer themes. Clear CliftonStrengths filters to restore the full shortlist.</div>';
    $('p-live-results').innerHTML=live.length?live.map((c,i)=>placeCard(c,i,p,'live')).join(''):empty;
    $('p-work-results').innerHTML=work.length?work.map((c,i)=>placeCard(c,i,p,'work')).join(''):empty;
    $('p-active-context').textContent=`${scope==='all'?'Philippine and international':scope==='ph'?'Philippine':'International'} candidates · ${mode==='remote'?'remote work from a verified base':mode==='onsite'?'local workplace options to investigate':'local workplace and remote-base options'}. ${selectedStrengths.length?`Matching ${strengthMatch} of ${selectedStrengths.length} selected CliftonStrengths themes. `:''}${strengthDomain!=='all'?`${strengthDomain} domain required. `:''}Suggestions compare ${PLACES.filter(x=>scope==='all'||x.region===scope).length} curated places, not every city in the world. Personality fit does not establish affordability, safety, job availability or permission to live and work there.`;
    renderStrengthFilters();
    renderDirectory();
  }
  function renderDirectory(){
    const query=$('p-search').value.trim().toLowerCase(),group=$('p-group').value;
    const list=profiles.filter(p=>{
      if(group!=='all'&&p.type.group!==group)return false;
      const entries=[...recommendations(p,'live'),...recommendations(p,'work')];
      return [p.id,p.type.name,p.variant.name,p.type.group,p.type.roles,...entries.map(x=>x.place.name),...entries.flatMap(x=>[...strengthTags(x.place,'live'),...strengthTags(x.place,'work')])].join(' ').toLowerCase().includes(query);
    });
    $('p-directory-count').textContent=`${list.length} of 64 profiles shown`;
    $('p-directory-grid').innerHTML=list.length?list.map(p=>{
      const live=recommendations(p,'live')[0]?.place,work=recommendations(p,'work')[0]?.place;
      return `<article class="p-directory-card" data-selected="${p.id===selected.id}"><h3>${esc(p.id)} <span style="color:var(--txt);font-weight:500">${esc(p.type.name)}</span></h3><p>${esc(p.variant.name)}</p><p><b>Live:</b> ${esc(live?.name||'No place matches')}<br><b>${mode==='remote'?'Work remotely from':'Work'}:</b> ${esc(work?.name||'No place matches')}</p><button type="button" class="btn sm" data-profile="${p.id}" aria-label="View ${p.id} place recommendations">View profile →</button></article>`;
    }).join(''):'<div class="p-empty">No profiles match. Try a base type such as INTJ, a variant such as Cooperative, or a suggested place.</div>';
  }
  function exportCSV(){
    const rows=[['Profile','Base type','Variant','Scope','Work mode','Selected CliftonStrengths themes','Strengths match mode','Strengths domain','Leading live suggestion','Live activity tags','Leading work suggestion','Work activity tags','Role ideas','Basis'],...profiles.map(p=>{const live=recommendations(p,'live')[0]?.place,work=recommendations(p,'work')[0]?.place;return [p.id,p.type.name,p.variant.name,scope,mode,selectedStrengths.join('; '),strengthMatch,strengthDomain,live?.name||'No place matches',live?strengthTags(live,'live').join('; '):'',work?.name||'No place matches',work?strengthTags(work,'work').join('; '):'',p.type.roles,'Editorial planning heuristic; not validated city-personality or CliftonStrengths matching'];})];
    const csv='\uFEFF'+rows.map(row=>row.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='compass-64-personality-places.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    $('p-feedback').textContent='Exported all 64 profiles, activity tags and your current personality, location and CliftonStrengths filters.';
  }
  function init(){
    $('p-strength-options').innerHTML=Object.entries(STRENGTH_DOMAINS).map(([domain,themes],index)=>`<fieldset class="p-strength-group p-domain-${index}"><legend>${esc(domain)}</legend>${themes.map(t=>`<label><input type="checkbox" value="${esc(t)}" /> <span>${esc(t)}</span></label>`).join('')}</fieldset>`).join('');
    $('p-strength-domain').innerHTML='<option value="all">All domains</option>'+Object.keys(STRENGTH_DOMAINS).map(d=>`<option>${esc(d)}</option>`).join('');
    $('p-type').innerHTML=TYPES.map(t=>`<option value="${t.code}">${t.code} · ${esc(t.name)}</option>`).join('');
    $('p-variant').innerHTML=VARIANTS.map(v=>`<option value="${v.code}">${v.code} · ${esc(v.name)}</option>`).join('');
    $('p-type').value=selected.type.code;$('p-variant').value=selected.variant.code;$('p-scope').value=scope;$('p-mode').value=mode;
    $('p-ratings').innerHTML=`<div class="p-rating-wrap" tabindex="0" role="region" aria-label="Scrollable editorial planning ratings"><table><caption>Living / working ratings, 1–5. Subjective planning assumptions.</caption><thead><tr><th scope="col">Place</th>${DIMS.map(d=>`<th scope="col">${esc(d)}</th>`).join('')}</tr></thead><tbody>${PLACES.map(c=>`<tr><th scope="row">${esc(c.name)}</th>${c.liveRatings.map((n,i)=>`<td>${n} / ${c.workRatings[i]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    $('p-sources').innerHTML=Object.keys(SOURCES).map(k=>`<li>${sourceLink(k)}</li>`).join('');
    ['p-type','p-variant'].forEach(id=>$(id).addEventListener('change',()=>{selected=profiles.find(p=>p.id===`${$('p-type').value}-${$('p-variant').value}`);persist();renderSelected();}));
    $('p-scope').addEventListener('change',()=>{scope=$('p-scope').value;persist();renderSelected();});
    $('p-mode').addEventListener('change',()=>{mode=$('p-mode').value;persist();renderSelected();});
    $('p-search').addEventListener('input',renderDirectory);$('p-group').addEventListener('change',renderDirectory);
    $('p-strength-options').addEventListener('change',event=>{if(event.target.matches('input[type="checkbox"]'))toggleStrength(event.target.value);});
    $('p-strength-match').addEventListener('change',()=>{strengthMatch=$('p-strength-match').value;persist();renderSelected();});
    $('p-strength-domain').addEventListener('change',()=>{strengthDomain=$('p-strength-domain').value;persist();renderSelected();});
    $('p-strength-clear').addEventListener('click',()=>{selectedStrengths=[];strengthDomain='all';strengthMatch='any';persist();renderSelected();$('p-feedback').textContent='CliftonStrengths filters cleared.';});
    document.querySelector('[data-v="personality"]').addEventListener('click',event=>{const b=event.target.closest('button[data-strength]');if(b)toggleStrength(b.dataset.strength);});
    $('p-directory-grid').addEventListener('click',event=>{const button=event.target.closest('button[data-profile]');if(!button)return;selected=profiles.find(p=>p.id===button.dataset.profile);$('p-type').value=selected.type.code;$('p-variant').value=selected.variant.code;persist();renderSelected();$('p-profile-summary').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});$('p-profile-summary').focus({preventScroll:true});});
    $('p-export').addEventListener('click',exportCSV);
    $('p-copy').addEventListener('click',async()=>{const url=new URL('/personality',location.origin);url.searchParams.set('profile',selected.id);url.searchParams.set('scope',scope);url.searchParams.set('mode',mode);setStrengthParams(url);try{await navigator.clipboard.writeText(url.href);$('p-feedback').textContent='Link copied for '+selected.id+' with your CliftonStrengths filters.';}catch{$('p-feedback').textContent='Share this address: '+url.href;}});
    addEventListener('popstate',()=>{const q=new URLSearchParams(location.search),p=profiles.find(p=>p.id===q.get('profile'));if(p){selected=p;$('p-type').value=p.type.code;$('p-variant').value=p.variant.code;}if(['all','ph','international'].includes(q.get('scope')))scope=q.get('scope');if(['any','onsite','remote'].includes(q.get('mode')))mode=q.get('mode');if(q.has('strengths'))selectedStrengths=[...new Set((q.get('strengths')||'').split(',').filter(t=>THEMES.includes(t)))];if(q.has('match'))strengthMatch=q.get('match')==='all'?'all':'any';if(q.has('domain'))strengthDomain=Object.hasOwn(STRENGTH_DOMAINS,q.get('domain'))?q.get('domain'):'all';$('p-scope').value=scope;$('p-mode').value=mode;renderSelected();});
    renderSelected();
  }
  init();
})();

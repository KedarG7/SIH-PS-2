import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import indiaMapData from './data/india-state-paths.json';
import './styles.css';

const stateCoordinates = {
  'Jammu and Kashmir':[74.7973,34.0837], 'Ladakh':[77.5771,34.1526], 'Himachal Pradesh':[77.1734,31.1048],
  'Punjab':[75.8573,30.9000], 'Chandigarh':[76.7794,30.7333], 'Haryana':[76.0856,29.0588], 'Delhi':[77.2090,28.6139],
  'Uttarakhand':[78.0322,30.3165], 'Rajasthan':[75.7873,26.9124], 'Uttar Pradesh':[80.9462,26.8467],
  'Sikkim':[88.6065,27.3389], 'Arunachal Pradesh':[93.6053,27.0844], 'Nagaland':[94.1086,25.6751],
  'Manipur':[93.9368,24.8170], 'Mizoram':[92.7176,23.7271], 'Tripura':[91.2868,23.8315],
  'Meghalaya':[91.8933,25.5788], 'Assam':[91.7362,26.1445], 'West Bengal':[88.3639,22.5726],
  'Bihar':[85.1376,25.5941], 'Jharkhand':[85.3096,23.3441], 'Odisha':[85.8245,20.2961],
  'Chhattisgarh':[81.6296,21.2514], 'Madhya Pradesh':[77.4126,23.2599], 'Gujarat':[72.5714,23.0225],
  'Dadra and Nagar Haveli and Daman and Diu':[73.0081,20.2766], 'Maharashtra':[72.8777,19.0760],
  'Goa':[73.8278,15.4909], 'Telangana':[78.4867,17.3850], 'Andhra Pradesh':[83.2185,17.6868],
  'Karnataka':[77.5946,12.9716], 'Kerala':[76.9366,8.5241], 'Tamil Nadu':[80.2707,13.0827],
  'Puducherry':[79.8083,11.9416], 'Andaman and Nicobar Islands':[92.7265,11.6234], 'Lakshadweep':[72.6417,10.5667],
};

const stateRows = [
  ['Jammu and Kashmir','JAMMU & KASHMIR',171,101,'Srinagar','28°','Rain bands',64,'Elevated'],
  ['Ladakh','LADAKH',235,68,'Leh','18°','Clear skies',18,'Normal'],
  ['Himachal Pradesh','HIMACHAL PRADESH',204,140,'Shimla','21°','Light rain',46,'Watch'],
  ['Punjab','PUNJAB',165,147,'Chandigarh','30°','Partly cloudy',38,'Normal'],
  ['Chandigarh','CHANDIGARH',177,157,'Chandigarh','30°','Partly cloudy',38,'Normal'],
  ['Haryana','HARYANA',183,179,'Gurugram','32°','Hazy sunshine',24,'Normal'],
  ['Delhi','DELHI',200,187,'New Delhi','34°','Haze advisory',22,'Elevated'],
  ['Uttarakhand','UTTARAKHAND',235,167,'Dehradun','24°','Showers',58,'Watch'],
  ['Rajasthan','RAJASTHAN',139,229,'Jaipur','39°','Heat advisory',11,'Critical'],
  ['Uttar Pradesh','UTTAR PRADESH',260,218,'Lucknow','33°','Thunderstorms',72,'Elevated'],
  ['Sikkim','SIKKIM',483,207,'Gangtok','19°','Mountain rain',81,'Watch'],
  ['Arunachal Pradesh','ARUNACHAL PRADESH',558,181,'Itanagar','26°','Heavy rain',91,'Critical'],
  ['Nagaland','NAGALAND',572,224,'Kohima','24°','Showers',78,'Watch'],
  ['Manipur','MANIPUR',558,260,'Imphal','25°','Showers',74,'Watch'],
  ['Mizoram','MIZORAM',549,296,'Aizawl','24°','Monsoon rain',87,'Elevated'],
  ['Tripura','TRIPURA',530,270,'Agartala','27°','Thunderstorms',83,'Elevated'],
  ['Meghalaya','MEGHALAYA',512,231,'Shillong','22°','Heavy rain',94,'Critical'],
  ['Assam','ASSAM',532,211,'Guwahati','28°','Monsoon rain',86,'Elevated'],
  ['West Bengal','WEST BENGAL',478,266,'Kolkata','31°','Humid & cloudy',79,'Watch'],
  ['Bihar','BIHAR',422,245,'Patna','32°','Thunderstorms',74,'Elevated'],
  ['Jharkhand','JHARKHAND',417,292,'Ranchi','27°','Light rain',62,'Watch'],
  ['Odisha','ODISHA',446,343,'Bhubaneswar','29°','Coastal rain',82,'Elevated'],
  ['Chhattisgarh','CHHATTISGARH',360,309,'Raipur','30°','Thunderstorms',70,'Watch'],
  ['Madhya Pradesh','MADHYA PRADESH',286,287,'Bhopal','31°','Warm & cloudy',53,'Normal'],
  ['Gujarat','GUJARAT',135,338,'Ahmedabad','36°','Dry heat',19,'Elevated'],
  ['Dadra and Nagar Haveli and Daman and Diu','DADRA & NAGAR HAVELI',171,351,'Silvassa','31°','Coastal clouds',67,'Watch'],
  ['Maharashtra','MAHARASHTRA',262,376,'Mumbai','29°','Monsoon rain',88,'Elevated'],
  ['Goa','GOA',190,420,'Panaji','28°','Coastal showers',84,'Watch'],
  ['Telangana','TELANGANA',326,382,'Hyderabad','29°','Cloud build-up',57,'Normal'],
  ['Andhra Pradesh','ANDHRA PRADESH',377,424,'Visakhapatnam','30°','Coastal showers',76,'Watch'],
  ['Karnataka','KARNATAKA',253,450,'Bengaluru','26°','Scattered rain',68,'Normal'],
  ['Kerala','KERALA',278,526,'Thiruvananthapuram','27°','Heavy showers',92,'Critical'],
  ['Tamil Nadu','TAMIL NADU',333,535,'Chennai','32°','Coastal humidity',71,'Watch'],
  ['Puducherry','PUDUCHERRY',351,550,'Puducherry','31°','Coastal clouds',73,'Normal'],
  ['Andaman and Nicobar Islands','ANDAMAN & NICOBAR',612,561,'Port Blair','29°','Marine squall',81,'Elevated'],
  ['Lakshadweep','LAKSHADWEEP',67,454,'Kavaratti','28°','Sea breeze',77,'Normal'],
].map(([name,label,_mapX,_mapY,city,temp,condition,rain,risk], index) => {
  const [longitude,latitude] = stateCoordinates[name];
  return {
    name, label, longitude, latitude, city, temp, condition, rain, risk,
    wind: [12,18,9,21,14,25,16,19,8,23,17,28,14,11,18,22,31,20,24,16,13,29,18,10,27,17,22,15,26,14,20,32,19,13,24,16][index],
    pressure: [1008,1013,1007,1009,1009,1006,1005,1007,996,1004,1008,1001,1003,1005,1004,1002,1000,1002,1004,1005,1007,1001,1004,1006,1007,1008,1005,1004,1003,1007,1006,1002,1004,1008,1006,1009][index],
  };
});

const stations = [
  { name:'SRINAGAR', state:'Jammu and Kashmir', status:'live' },
  { name:'JAIPUR', state:'Rajasthan', status:'storm' },
  { name:'DELHI NCR', state:'Delhi', status:'live' },
  { name:'LUCKNOW', state:'Uttar Pradesh', status:'live' },
  { name:'GUWAHATI', state:'Assam', status:'storm' },
  { name:'MUMBAI', state:'Maharashtra', status:'storm' },
  { name:'HYDERABAD', state:'Telangana', status:'live' },
  { name:'BENGALURU', state:'Karnataka', status:'live' },
  { name:'CHENNAI', state:'Tamil Nadu', status:'live' },
  { name:'KOLKATA', state:'West Bengal', status:'storm' },
  { name:'PORT BLAIR', state:'Andaman and Nicobar Islands', status:'live' },
  { name:'KAVARATTI', state:'Lakshadweep', status:'live' },
];

const indiaStatePaths = indiaMapData.features;
const indiaOutlinePath = indiaMapData.outline;
const projectPoint = (longitude,latitude) => {
  const {minLongitude,maxLatitude,longitudeScale,scale,offsetX,offsetY} = indiaMapData.projection;
  return [offsetX + (longitude-minLongitude)*longitudeScale*scale, offsetY + (maxLatitude-latitude)*scale];
};

function Icon({ name, size=19, stroke=1.7 }) {
  const p = {
    radar:<><circle cx="12" cy="12" r="9"/><path d="M12 3v9l6.5 6.5M12 7a5 5 0 0 1 5 5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></>,
    grid:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    activity:<><path d="M2 12h4l2-7 4 14 3-7h7"/></>,
    map:<><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15m6-12v15"/></>,
    pulse:<><path d="M2 12h4l3-8 5 16 3-8h5"/></>,
    chart:<><path d="M3 3v18h18"/><path d="m7 14 4-4 4 3 6-7"/></>,
    bell:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    cloud:<><path d="M7.2 18.5a5 5 0 1 1 1.5-9.8 6 6 0 0 1 11.2 2.1 4 4 0 0 1-1.3 7.7z"/><path d="m9 21 1-2m4 2 1-2m4 2 1-2"/></>,
    wind:<><path d="M3 8h12a3 3 0 1 0-3-3M2 12h17M4 16h11a3 3 0 1 1-3 3"/></>,
    sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    arrow:<><path d="M5 12h14m-6-6 6 6-6 6"/></>,
    cross:<><path d="m18 6-12 12M6 6l12 12"/></>,
    layers:<><path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5"/></>,
    plus:<path d="M12 5v14m-7-7h14"/>,
    minus:<path d="M5 12h14"/>,
    signal:<><path d="M2 8a15 15 0 0 1 20 0M5 11a10 10 0 0 1 14 0m-11 4a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/></>,
  }[name];
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{p}</svg>;
}

const layers = [['temperature','Thermal'],['rainfall','Precipitation'],['wind','Wind field']];

function Sidebar({active,setActive}) {
  const nav = [['Overview','grid'],['Live radar','radar'],['State map','map'],['Forecast','chart']];
  const navigate = (label) => {
    setActive(label);
    const target = { 'Live radar':'live-radar', 'State map':'state-map', 'Forecast':'forecast-outlook' }[label];
    if (target) document.getElementById(target)?.scrollIntoView({behavior:'smooth',block:'center'});
    else window.scrollTo({top:0,behavior:'smooth'});
  };
  return <aside className="rail">
    <div className="rail-brand" title="SkyGuard"><span className="orbit-mark"><i/><i/><i/></span></div>
    <div className="rail-rule"/>
    {nav.map(([label,icon])=><button key={label} title={label} aria-label={label} className={`rail-btn ${active===label?'selected':''}`} onClick={()=>navigate(label)}><Icon name={icon}/></button>)}
    <div className="rail-bottom"><button className="rail-btn" title="System signal" aria-label="System signal"><Icon name="signal"/></button><div className="rail-avatar">KG</div></div>
  </aside>;
}

function IndiaMap({selected,hovered,setSelected,setHovered,mode,setMode,radarOn,zoom}) {
  const cells = useMemo(() => indiaStatePaths.map((feature) => ({
    ...stateRows.find((state) => state.name === feature.name),
    ...feature,
  })), []);
  const displayState = hovered || selected;
  const selectedPoint = displayState ? projectPoint(displayState.longitude,displayState.latitude) : null;
  const heatPoint = projectPoint(75.8,26.9);
  const rainPoint = projectPoint(91.7,26.1);
  const southPoint = projectPoint(77.6,12.9);
  const nodes = useMemo(() => stations.map((node) => {
    const state = stateRows.find((entry) => entry.name === node.state);
    return {...node,stateData:state,point:projectPoint(state.longitude,state.latitude)};
  }), []);
  const arcs = [
    [[77.2,28.6],[85.5,36.6],[91.7,26.1]],
    [[77.2,28.6],[91.8,30.5],[78.5,17.4]],
    [[75.8,26.9],[72.8,17.5],[77.6,12.9]],
  ].map(([start,control,end])=>{
    const [x1,y1]=projectPoint(...start),[cx,cy]=projectPoint(...control),[x2,y2]=projectPoint(...end);
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  });
  const compactRegions = new Set(['Chandigarh','Delhi','Goa','Dadra and Nagar Haveli and Daman and Diu','Puducherry','Sikkim','Andaman and Nicobar Islands','Lakshadweep']);
  return <div className={`map-stage ${radarOn?'radar-on':'radar-paused'}`}>
    <div className="map-grid"/>
    <div className="map-halo halo-one"/><div className="map-halo halo-two"/>
    <div className="map-coord coord-a">36 STATES &amp; UNION TERRITORIES</div>
    <div className="map-coord coord-b">LIVE SATELLITE COMPOSITE · {radarOn?'RADAR ON':'RADAR PAUSED'}</div>
    <div className="map-key"><i/><span>ACTIVE PRECIPITATION</span><b>NOWCAST / 06H</b></div>
    <div className="map-tools">
      <button onClick={()=>setMode(current=>layers[(layers.findIndex(([key])=>key===current)+1)%layers.length][0])} aria-label="Cycle map layers" title="Cycle map layer"><Icon name="layers" size={17}/></button>
      <span/>
      <button onClick={()=>window.dispatchEvent(new CustomEvent('skyguard-zoom',{detail:1}))} aria-label="Zoom in"><Icon name="plus" size={16}/></button>
      <button onClick={()=>window.dispatchEvent(new CustomEvent('skyguard-zoom',{detail:-1}))} aria-label="Zoom out"><Icon name="minus" size={16}/></button>
    </div>
    <svg className="india-map" viewBox="0 0 720 690" role="group" aria-label="Interactive India state weather map">
      <defs>
        <linearGradient id="landBase" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#17243b"/><stop offset=".54" stopColor="#111a31"/><stop offset="1" stopColor="#12283a"/></linearGradient>
        <linearGradient id="landGlint" x1="0" y1="0" x2="0.9" y2="1"><stop stopColor="#52e2d0" stopOpacity=".16"/><stop offset=".55" stopColor="#5e8dff" stopOpacity=".04"/><stop offset="1" stopColor="#fa7d6b" stopOpacity=".17"/></linearGradient>
        <radialGradient id="heatGlow"><stop stopColor="#ff8760" stopOpacity=".75"/><stop offset="1" stopColor="#ff8760" stopOpacity="0"/></radialGradient>
        <radialGradient id="rainGlow"><stop stopColor="#50c9ff" stopOpacity=".72"/><stop offset="1" stopColor="#50c9ff" stopOpacity="0"/></radialGradient>
        <radialGradient id="violetGlow"><stop stopColor="#b591ff" stopOpacity=".68"/><stop offset="1" stopColor="#b591ff" stopOpacity="0"/></radialGradient>
        <filter id="stateGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="14"/></filter>
        <clipPath id="indiaLand"><path d={indiaOutlinePath} fillRule="evenodd"/></clipPath>
      </defs>
      <g className="map-zoom" transform={`translate(360 345) scale(${zoom}) translate(-360 -345)`}>
        <path d={indiaOutlinePath} fill="url(#landBase)" stroke="#6bdacb" strokeOpacity=".78" strokeWidth="2" className="land-aura" fillRule="evenodd"/>
        <g clipPath="url(#indiaLand)" className="weather-glows">
          <ellipse className="weather-blob heat" cx={heatPoint[0]} cy={heatPoint[1]} rx="112" ry="118" fill="url(#heatGlow)"/>
          <ellipse className="weather-blob rain" cx={rainPoint[0]} cy={rainPoint[1]} rx="105" ry="108" fill="url(#rainGlow)"/>
          <ellipse className="weather-blob south" cx={southPoint[0]} cy={southPoint[1]} rx="108" ry="132" fill="url(#violetGlow)"/>
          <g className={`state-cells ${mode}`}>{cells.map((state) => {
            const active = displayState?.name === state.name;
            const severity = state.risk === 'Critical' ? 'critical' : state.risk === 'Elevated' ? 'elevated' : 'calm';
            return <path key={state.name} d={state.d} aria-label={`${state.name} · ${state.condition}`} role="button" tabIndex="0" className={`state-cell ${severity} ${active?'is-active':''}`} vectorEffect="non-scaling-stroke" fillRule="evenodd"
              onMouseEnter={()=>setHovered(state)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(state)} onBlur={()=>setHovered(null)} onClick={()=>setSelected(state)}
              onKeyDown={(event)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setSelected(state);}}}><title>{state.name} · {state.condition} · {state.temp}</title></path>;
          })}</g>
          <path d={indiaOutlinePath} fill="url(#landGlint)" fillRule="evenodd" pointerEvents="none"/>
        </g>
        <path d={indiaOutlinePath} fill="none" stroke="#8bfff0" strokeOpacity=".55" strokeWidth="1.5" className="country-outline" pointerEvents="none" fillRule="evenodd"/>
        <g className="state-hit-targets">{cells.filter((state)=>compactRegions.has(state.name)).map((state)=>{
          const [x,y]=projectPoint(state.longitude,state.latitude);
          const radius=state.name==='Andaman and Nicobar Islands'||state.name==='Lakshadweep'?12:state.name==='Sikkim'?7:8;
          return <circle key={state.name} cx={x} cy={y} r={radius} className="state-hit-target" role="button" tabIndex="0" aria-label={`Select ${state.name}`} onMouseEnter={()=>setHovered(state)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(state)} onBlur={()=>setHovered(null)} onClick={()=>setSelected(state)} onKeyDown={(event)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setSelected(state);}}}/>;
        })}</g>
        <g className="radar-arcs" clipPath="url(#indiaLand)">{arcs.map((path,i)=><path key={i} d={path}/>)}</g>
        <g className="station-nodes">{nodes.map((node) => {
          const active = displayState?.name === node.state;
          const [x,y]=node.point;
          return <g key={node.name} transform={`translate(${x} ${y})`} className={`station-node ${node.status} ${active?'focused':''}`} role="button" tabIndex="0" aria-label={`${node.name} station · ${node.state}`} onMouseEnter={()=>setHovered(node.stateData)} onMouseLeave={()=>setHovered(null)} onClick={()=>setSelected(node.stateData)}>
            <circle className="node-ping" r="13"/><circle className="node-halo" r="7"/><circle className="node-core" r="2.7"/><text x="9" y="-8">{node.name}</text>
          </g>;
        })}</g>
        {selectedPoint && <g className="selected-orbit" transform={`translate(${selectedPoint[0]} ${selectedPoint[1]})`} pointerEvents="none"><circle r="16"/><circle r="23"/><path d="M -31 0h-9m80 0h-9M0-31v-9m0 80v-9"/></g>}
      </g>
    </svg>
    <div className="map-tooltip"><span className={`weather-indicator ${displayState?.risk?.toLowerCase()||'normal'}`}/><span>{displayState?.name||'India'} <small>· {displayState?.condition||'Select a state'}</small></span><b>{displayState?.temp||'29°'}</b></div>
    <div className="map-scale"><span>LOW</span><i/><i/><i/><i/><i/><span>HIGH</span></div>
    <div className="map-corner north"><span>N</span><b>↑</b></div>
  </div>;
}

function WeatherIcon({kind='cloud'}) { return <span className={`weather-icon ${kind}`}><Icon name={kind==='sun'?'sun':kind==='wind'?'wind':'cloud'} size={25}/></span>; }

function App() {
  const [active,setActive] = useState('Overview');
  const [selected,setSelected] = useState(stateRows.find(s=>s.name==='Rajasthan'));
  const [hovered,setHovered] = useState(null);
  const [mode,setMode] = useState('temperature');
  const [radarOn,setRadarOn] = useState(true);
  const [zoom,setZoom] = useState(1);
  const [range,setRange] = useState('06H');
  const [alertOpen,setAlertOpen] = useState(false);
  const [muted,setMuted] = useState(false);
  const [minute,setMinute] = useState('14:32:08');
  React.useEffect(()=>{
    const timer=window.setInterval(()=>setMinute(new Intl.DateTimeFormat('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false,timeZone:'Asia/Kolkata'}).format(new Date())),1000);
    const zoomEvent=(event)=>setZoom(current=>Math.max(.84,Math.min(1.22,current+event.detail*.08)));
    window.addEventListener('skyguard-zoom',zoomEvent);
    return ()=>{window.clearInterval(timer);window.removeEventListener('skyguard-zoom',zoomEvent);};
  },[]);
  const summary = hovered || selected;
  const riskClass = summary?.risk.toLowerCase() || 'normal';
  const layerCopy = mode==='temperature' ? 'SURFACE TEMPERATURE' : mode==='rainfall' ? 'PRECIPITATION PROBABILITY' : 'WIND VELOCITY';
  return <div className="sky-app">
    <div className="starfield starfield-a"/><div className="starfield starfield-b"/><div className="nebula nebula-one"/><div className="nebula nebula-two"/>
    <Sidebar active={active} setActive={setActive}/>
    <main className="command-shell">
      <header className="topbar">
        <div className="wordmark"><div className="wordmark-icon"><Icon name="radar" size={20}/></div><div><b>SKYGUARD<span>·</span>AI</b><small>INDIA WEATHER INTELLIGENCE</small></div></div>
        <div className="mission-tag"><span className="mission-dot"/> NATIONAL FORECAST GRID <span className="tag-divider"/> <b>IND-01</b></div>
        <div className="top-actions"><div className="local-time"><span>IST</span><b>{minute}</b></div><button className={`icon-button ${alertOpen?'pressed':''}`} onClick={()=>setAlertOpen(!alertOpen)} title="Show active advisories" aria-label="Show active advisories"><Icon name="bell" size={18}/><i/></button><div className="top-avatar">KG</div></div>
      </header>
      {alertOpen&&<div className="alert-popover"><div><i className="alert-pulse"/>3 advisories need review</div><span>RAJASTHAN HEAT · ASSAM RAIN · ARUNACHAL FLOOD WATCH</span><button onClick={()=>setAlertOpen(false)} aria-label="Close alerts"><Icon name="cross" size={15}/></button></div>}

      <section className="intro-row">
        <div className="intro-copy"><div className="eyebrow"><span className="eyebrow-line"/> NATIONAL ATMOSPHERIC INTELLIGENCE <span> / </span> <b>LIVE OPERATIONS</b></div><h1>Weather, <em>in motion.</em></h1><p>One living map. Every signal. A safer India.</p></div>
        <div className="sync-status"><div className="sync-icon"><Icon name="signal" size={18}/></div><div><small>OBSERVATION NETWORK</small><b>128 <span>/ 128</span> ONLINE</b></div><div className="sync-bars"><i/><i/><i/><i/><i/></div></div>
      </section>

      <section className="signal-strip" aria-label="National weather summary">
        <div className="signal-card"><div className="signal-icon temperature"><Icon name="sun" size={17}/></div><div><small>NATIONAL MEAN</small><b>29.4<span>°C</span></b></div><span className="signal-change up">+0.8°</span><div className="sparkline"><i/><i/><i/><i/><i/><i/><i/></div></div>
        <div className="signal-card"><div className="signal-icon humidity"><Icon name="cloud" size={17}/></div><div><small>AVG. HUMIDITY</small><b>72<span>%</span></b></div><span className="signal-change">−2.1%</span><div className="sparkline blue"><i/><i/><i/><i/><i/><i/><i/></div></div>
        <div className="signal-card"><div className="signal-icon rainfall"><Icon name="wind" size={17}/></div><div><small>RAIN OUTLOOK</small><b>64<span>%</span></b></div><span className="signal-change blue-copy">+12%</span><div className="sparkline violet"><i/><i/><i/><i/><i/><i/><i/></div></div>
        <div className="signal-card advisories-card"><div className="signal-icon warning"><Icon name="pulse" size={17}/></div><div><small>ACTIVE ADVISORIES</small><b>06<span> zones</span></b></div><span className="advisory-pulse"><i/> MONITORING</span></div>
      </section>

      <section className="workspace-grid">
        <article className="map-card" id="state-map">
          <div className="map-card-top"><div className="map-title"><div className="title-icon"><Icon name="radar" size={18}/></div><div><div className="eyebrow small">NATIONAL NOWCAST <span>·</span> <b>{layerCopy}</b></div><h2>India <span>weather field</span></h2></div></div>
            <div className="map-top-controls"><div className="forecast-tabs" role="group" aria-label="Forecast range">{['03H','06H','24H'].map(tab=><button key={tab} className={range===tab?'active':''} onClick={()=>setRange(tab)}>{tab}</button>)}</div><button className={`radar-toggle ${radarOn?'on':''}`} onClick={()=>setRadarOn(!radarOn)}><span className="radar-led"/>{radarOn?'Radar live':'Radar paused'}</button></div>
          </div>
          <div className="map-content" id="live-radar">
            <div className="map-mode-tabs" role="group" aria-label="Weather layer">{layers.map(([value,label])=><button key={value} className={mode===value?'active':''} onClick={()=>setMode(value)}><i className={`layer-swatch ${value}`}/>{label}</button>)}</div>
            <IndiaMap selected={selected} hovered={hovered} setSelected={setSelected} setHovered={setHovered} mode={mode} setMode={setMode} radarOn={radarOn} zoom={zoom}/>
            <div className="map-footer"><div className="legend-items"><span><i className="legend-dot clear"/> CLEAR</span><span><i className="legend-dot watch"/> WATCH</span><span><i className="legend-dot warning"/> ADVISORY</span></div><span className="map-source">MODEL RUN&nbsp; 14:30 IST <b>·</b> 2.4 KM RESOLUTION</span><a className="map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a></div>
          </div>
        </article>

        <aside className="insight-column">
          <article className="state-card">
            <div className="state-card-top"><span className="eyebrow small">STATE INTELLIGENCE</span><button className="dots-button" aria-label="More state actions">···</button></div>
            <div className="state-location"><div className={`state-emblem ${riskClass}`}><WeatherIcon kind={riskClass==='critical'?'sun':summary.rain>70?'cloud':'wind'}/><span className="emblem-ring ring-a"/><span className="emblem-ring ring-b"/></div><div><span className="state-cap">SELECTED REGION <i/></span><h3>{summary?.name||'India'}</h3><div className="state-city"><span className="pin-dot"/>{summary?.city||'National outlook'}, India</div></div></div>
            <div className="state-temperature"><b>{summary?.temp||'29°'}</b><div><span>{summary?.condition||'Cloudy intervals'}</span><small>FEELS LIKE {parseInt(summary?.temp||'29',10)+2}° <i>·</i> HUMIDITY 68%</small></div></div>
            <div className="state-divider"/>
            <div className="state-stats"><div><span><Icon name="cloud" size={15}/> RAIN CHANCE</span><b>{summary?.rain||64}<small>%</small></b><div className="mini-meter"><i style={{width:`${summary?.rain||64}%`}}/></div></div><div><span><Icon name="wind" size={15}/> WIND SPEED</span><b>{summary?.wind||18}<small> km/h</small></b><div className="mini-meter wind-meter"><i style={{width:`${Math.min(100,(summary?.wind||18)*2.2)}%`}}/></div></div></div>
            <div className={`risk-banner ${riskClass}`}><div><span className="risk-icon">{riskClass==='critical'?'!':riskClass==='elevated'?'⌁':'✓'}</span><span><b>{riskClass==='critical'?'Weather advisory active':riskClass==='elevated'?'Conditions elevated':'No active warning'}</b><small>{riskClass==='critical'?'Review response plan · 12 min ago':riskClass==='elevated'?'Forecast confidence 87% · updated now':'All clear · forecast confidence 94%'}</small></span></div><Icon name="arrow" size={17}/></div>
          </article>

          <article className="forecast-card">
            <div className="forecast-head" id="forecast-outlook"><div><span className="eyebrow small">OUTLOOK</span><h3>{range==='03H'?'Next 3 hours':range==='24H'?'Next 24 hours':'Next 6 hours'}</h3></div><button className="tiny-arrow" aria-label="Extend forecast range" onClick={()=>setRange(current=>current==='06H'?'24H':current==='24H'?'03H':'06H')}><Icon name="arrow" size={16}/></button></div>
            <div className="forecast-line"><span/><span/><span/><span/><span/></div>
            <div className="forecast-points">{[['15:00','☀','31°'],['16:00','☀','30°'],['17:00','☁','28°'],['18:00','☁','27°'],['19:00','☾','25°']].map(([time,icon,temp])=><div className="forecast-point" key={time}><small>{time}</small><b>{icon}</b><strong>{temp}</strong></div>)}</div>
          </article>

          <article className="event-card"><div className="event-icon"><span/><Icon name="pulse" size={17}/></div><div><span className="eyebrow small">AI EARLY WARNING</span><b>Pre-monsoon cell forming</b><small>Western Rajasthan <i>·</i> 42 min to impact</small></div><button title="Acknowledge alert" aria-label="Acknowledge alert" onClick={()=>setMuted(!muted)} className={muted?'acknowledged':''}>{muted?'✓':'→'}</button></article>
        </aside>
      </section>

      <section className="bottom-bar"><div className="bottom-label"><div className="bottom-icon"><Icon name="activity"/></div><span><b>THE ATMOSPHERIC PULSE</b><small>National sensor network · heartbeat</small></span></div><div className="pulse-wave" aria-hidden="true">{Array.from({length:56},(_,i)=><i key={i} style={{'--h':`${10+((i*19+Math.sin(i*1.8)*25)%48)}px`,'--delay':`${i*18}ms`}}/>)}</div><div className="bottom-live"><span className="live-light"/>TRANSMITTING</div><div className="ticker">NORTH <b>29.4°</b><i/> WEST <b>36.8°</b><i/> SOUTH <b>27.2°</b><i/> EAST <b>30.1°</b></div></section>
      <footer className="footer-note"><span>SKYGUARD AI <i>×</i> INDIA’S CLIMATE RESILIENCE NETWORK</span><span>SIMULATED DEMO FEED <b>·</b> MODEL CONFIDENCE 94.8%</span></footer>
    </main>
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);

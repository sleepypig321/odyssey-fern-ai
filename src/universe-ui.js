export const UNIVERSE_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#04070e"><title>The Creative Universe — Prototype</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#03060d;color:#f2eee7;font-family:system-ui,-apple-system,sans-serif;overflow:hidden}
canvas{position:fixed;inset:0;width:100%;height:100%;display:block}body:before{content:'';position:fixed;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse at 50% 45%,transparent 25%,#010307b8 100%)}
.top{position:fixed;z-index:3;top:0;left:0;right:0;padding:23px clamp(18px,5vw,80px);display:flex;align-items:center;justify-content:space-between;gap:16px;pointer-events:none}
.brand{font:400 clamp(16px,2vw,24px) Georgia,serif;letter-spacing:.15em}.tag{font-size:10px;letter-spacing:.2em;color:#b7b7bc;text-transform:uppercase}
.top button,.actions button,.dialog button{pointer-events:auto;border:1px solid #a89b7f88;background:#131b2cbd;color:#f3ebdb;padding:11px 15px;border-radius:22px;cursor:pointer}
.intro{position:fixed;z-index:2;left:50%;top:34%;transform:translate(-50%,-50%);text-align:center;width:min(90vw,700px);pointer-events:none}
.intro h1{font:400 clamp(35px,6vw,77px)/1.05 Georgia,serif;letter-spacing:-.03em;margin:12px 0}.intro p{color:#c1c4ce;font-size:clamp(12px,1.7vw,16px)}
.actions{position:fixed;z-index:4;bottom:32px;left:50%;transform:translateX(-50%);display:flex;gap:10px;white-space:nowrap}.actions button:first-child{background:#d2bd91;color:#10151e;border-color:#d2bd91}
.idea-list{position:fixed;z-index:4;top:90px;right:clamp(12px,3vw,45px);width:min(260px,35vw);max-height:55vh;overflow:auto}.idea{display:block;width:100%;text-align:left;background:#121b2bb8;color:#eee6dc;border:1px solid #76819450;border-radius:10px;padding:9px 12px;margin-bottom:8px;cursor:pointer;font-size:12px}.idea small{display:block;color:#a9b5c1}.idea.discarded{opacity:.65;border-color:#9a8b7860}.empty{color:#acb5c5;font-size:12px}
.dialog-backdrop{position:fixed;z-index:10;inset:0;background:#000a;display:grid;place-items:center;padding:20px}.dialog{width:min(460px,100%);background:#111a29;border:1px solid #a69d815c;border-radius:18px;padding:24px;box-shadow:0 25px 90px #000}.dialog h2{font:30px Georgia,serif;margin:0 0 13px}.dialog input,.dialog textarea{display:block;width:100%;border:1px solid #68758d;background:#060e1b;color:white;border-radius:9px;padding:12px;margin:12px 0;font:inherit}.dialog textarea{min-height:105px}.dialog .controls{display:flex;flex-wrap:wrap;gap:8px}.dialog button.primary{background:#d2bd91;color:#10151e}.notice{font-size:11px;color:#abb8c8;line-height:1.5}
.auth-wall{position:fixed;z-index:20;inset:0;display:grid;place-items:center;padding:20px;background:radial-gradient(ellipse at center,#14243bf2,#02050b 75%)}.auth-wall[hidden]{display:none}.auth-card{width:min(430px,100%);padding:30px;background:#101a2bf0;border:1px solid #c9b68b77;border-radius:20px}.auth-card h2{font:35px Georgia,serif;margin:8px 0 10px}.auth-card p{color:#b6c2d0;font-size:13px}.auth-card input{display:block;width:100%;padding:13px;margin:11px 0;background:#07101f;color:#fff;border:1px solid #617089;border-radius:10px;font:inherit}.auth-buttons{display:flex;gap:8px;flex-wrap:wrap}.auth-buttons button{cursor:pointer;padding:12px;border-radius:12px;border:1px solid #b9a783;background:#d2bd91;color:#10151e}.auth-buttons button.secondary{background:#19283d;color:#f2e9da}.auth-error{min-height:20px;color:#f4b3a9!important}

/* Keep authenticated workspace completely hidden while the entry portal is visible. */
body:has(#auth-wall:not([hidden])) .top,
body:has(#auth-wall:not([hidden])) .intro,
body:has(#auth-wall:not([hidden])) .idea-list,
body:has(#auth-wall:not([hidden])) .actions,
body:has(#auth-wall:not([hidden])) #modal {visibility:hidden;pointer-events:none}
/* The entrance is a navigable star, suspended above the actual WebGL galaxy. */
#space{transition:transform 1.4s cubic-bezier(.15,.72,.16,1),filter 1.4s ease;transform-origin:50% 48%}
body.entering-universe #space{transform:scale(3.7);filter:brightness(1.8) blur(2px)}
.auth-wall{display:block;overflow:hidden;padding:0;background:radial-gradient(circle at 50% 47%,#080c1b10 0%,#02050a45 42%,#01020ab8 100%);isolation:isolate}
.auth-wall:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,#7f9fe212 0%,transparent 33%),linear-gradient(90deg,#02040a75,transparent 28%,transparent 72%,#02040a75);z-index:-1}
.auth-wall:after{content:"";position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(#d8e6ff80 .6px,transparent 1px);background-size:87px 93px;opacity:.32}
.cosmic-eyebrow{position:absolute;z-index:2;top:clamp(35px,7vh,95px);left:0;right:0;text-align:center;text-transform:uppercase;letter-spacing:.42em;color:#c6bda7;font-size:clamp(9px,1vw,12px);text-shadow:0 1px 12px #000}
.cosmic-headline{position:absolute;z-index:2;top:clamp(76px,14vh,160px);left:5%;right:5%;text-align:center;font:400 clamp(36px,6vw,82px)/1 Georgia,serif;letter-spacing:-.045em;color:#f5f2ed;text-shadow:0 4px 45px #020511,0 0 35px #9c98bd4d;pointer-events:none}
.cosmic-headline em{font-weight:400;color:#ebce9e}
.star-entry{position:absolute;z-index:4;left:50%;top:53%;transform:translate(-50%,-50%);width:clamp(170px,25vw,300px);height:clamp(170px,25vw,300px);border:none;border-radius:50%;background:transparent;color:white;cursor:pointer;display:grid;place-items:center;transition:transform .6s ease,opacity .4s ease}
.star-entry:focus-visible{outline:2px solid #f3d8a3;outline-offset:22px}
.star-entry:before{content:"";position:absolute;inset:16%;border-radius:50%;background:radial-gradient(circle,#fff 0%,#fff9d5 4%,#ffc783 12%,#9878d9 21%,#6855aa55 40%,transparent 70%);filter:blur(2px);box-shadow:0 0 35px 8px #e7b9e567,0 0 115px 35px #8c68c666;animation:star-breathe 4s ease-in-out infinite}
.star-entry:after{content:"";position:absolute;width:12px;height:12px;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg);background:#fff;box-shadow:0 0 30px 12px #fff0d3;filter:blur(1px)}
.star-orbit{position:absolute;inset:3%;border:1px solid #d3acdd60;border-radius:50%;transform:rotate(-26deg) scaleY(.4);box-shadow:0 0 32px #af94e680;pointer-events:none}
.star-orbit.second{inset:0;transform:rotate(35deg) scaleY(.55);opacity:.45}
.star-label{position:absolute;top:calc(100% - 4px);left:50%;transform:translateX(-50%);white-space:nowrap;letter-spacing:.26em;text-transform:uppercase;font-size:11px;color:#f5e0c0;text-shadow:0 3px 20px #000}
.star-label small{display:block;letter-spacing:.14em;color:#b5bed1;margin-top:11px;font-size:10px}
.star-entry:hover{transform:translate(-50%,-50%) scale(1.12)}
.cosmic-footer{position:absolute;bottom:29px;left:15px;right:15px;text-align:center;color:#a8b2c6;font-size:11px;letter-spacing:.18em;pointer-events:none}
.auth-card{position:absolute;z-index:5;top:50%;left:50%;transform:translate(-50%,-46%) scale(.9);opacity:0;visibility:hidden;pointer-events:none;width:min(430px,calc(100vw - 34px));padding:34px;background:linear-gradient(145deg,#0b1429f5,#10162ae8 55%,#201529ed);border:1px solid #d1b88d91;border-radius:24px;box-shadow:0 0 0 1px #f0d29c12,0 30px 100px #000d,0 0 100px #7e5e9755;backdrop-filter:blur(16px);transition:transform .6s ease,opacity .6s ease,visibility .6s}
.auth-card:before{content:"✦";position:absolute;right:30px;top:23px;color:#ebce9e;font-size:29px;text-shadow:0 0 30px #f5c991}
.auth-card h2{font-size:clamp(33px,4vw,47px);letter-spacing:-.035em}
.auth-card .tag{display:block;color:#d2bd91}
.auth-card input{border-color:#a19bb86e;background:#070d20de;outline-offset:3px}
.auth-card input:focus{outline:2px solid #e5c78d}
.auth-wall.portal-open .auth-card{opacity:1;visibility:visible;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}
.auth-wall.portal-open .star-entry,.auth-wall.portal-open .cosmic-headline,.auth-wall.portal-open .cosmic-eyebrow,.auth-wall.portal-open .cosmic-footer{opacity:0;pointer-events:none}
.portal-back{float:right;position:relative;z-index:2;background:transparent;border:0;color:#d6c3a9;cursor:pointer;font-size:12px;letter-spacing:.1em}
.portal-back:hover{text-decoration:underline}
.auth-buttons button:hover{filter:brightness(1.14)}
@keyframes star-breathe{50%{filter:brightness(1.6) blur(1px);box-shadow:0 0 60px 14px #edcae688,0 0 150px 50px #ac83de7a}}
body.entering-universe .auth-wall{background:radial-gradient(circle at 50% 50%,#eacbce77,#0a0713bc 50%,#000b)}
body.entering-universe .star-entry{transform:translate(-50%,-50%) scale(3.3);opacity:0;pointer-events:none}

/* Black-hole gateway: layered event horizon, accretion disk, and lensing glow. */
.cosmic-headline{top:clamp(86px,15vh,166px);font-size:clamp(35px,5.5vw,76px)}
.star-entry{top:54%;width:clamp(210px,31vw,390px);height:clamp(210px,31vw,390px);overflow:visible}
.star-entry:before{inset:17%;background:radial-gradient(circle at 50% 50%,#000 0 43%,#040407 54%,#bd8c505c 66%,#f8d6a6b0 69%,transparent 75%);filter:none;box-shadow:0 0 48px 9px #e8a56345,0 0 135px 32px #a96d6930;animation:none;z-index:3}
.star-entry:after{display:none}
.star-orbit,.star-orbit.second{display:none}
.hole-disk{position:absolute;inset:8%;border-radius:50%;transform:rotate(-29deg) scaleY(.38);background:conic-gradient(from 45deg,#fdf0d0,#ecab5f 14%,#7e3d32 27%,#f8b86e 41%,#fff2c9 55%,#ab663d 73%,#2f2c40 85%,#fdf0d0);box-shadow:0 0 22px 5px #ffcc8b80,0 0 70px 16px #a66b6a55;filter:blur(3px);animation:accrete 17s linear infinite;z-index:2;pointer-events:none}
.hole-disk:before{content:"";position:absolute;inset:17%;border-radius:50%;background:#040508;box-shadow:inset 0 0 20px #000}
.hole-lens{position:absolute;inset:10%;border:2px solid #e8c19b8c;transform:rotate(22deg) scaleY(.76);border-radius:50%;box-shadow:0 0 26px #f6dcaa91,0 0 80px #5a7eb044;z-index:1;pointer-events:none}
.hole-arcs{position:absolute;inset:14%;border-radius:50%;border:2px solid transparent;border-top-color:#fff3d9;border-bottom-color:#b76f47;filter:blur(2px);transform:rotate(22deg);box-shadow:0 0 25px #f5ad659c;z-index:4;pointer-events:none}
.star-label{top:calc(100% + 12px);z-index:5}
.star-label small{letter-spacing:.1em}
.star-entry:hover:before{box-shadow:0 0 68px 18px #eab87966,0 0 160px 50px #a96d6944}
body.entering-universe .star-entry{transform:translate(-50%,-50%) scale(7);opacity:1;filter:brightness(.5);transition:transform 1.25s cubic-bezier(.53,.08,.8,.21),filter 1.2s,opacity .2s 1.1s}
body.entering-universe .star-label{opacity:0}
body.entering-universe #space{transform:scale(5);filter:blur(6px) brightness(.35)}
body.entering-universe .auth-wall{background:radial-gradient(circle,#000 17%,#130c16de 70%,#010205 100%)}
body.white-emergence #space{transform:scale(.65);filter:brightness(2.8) blur(3px)}
.white-flash{position:fixed;z-index:100;inset:0;opacity:0;visibility:hidden;pointer-events:none;background:radial-gradient(circle at center,#fff 0%,#fffff4 28%,#d7e8ff 55%,#5b7da5 90%);transition:opacity .5s ease}
body.white-emergence .white-flash{visibility:visible;animation:white-birth 1.65s ease-in-out forwards}
@keyframes accrete{to{transform:rotate(331deg) scaleY(.38)}}
@keyframes white-birth{0%{opacity:0}25%{opacity:1}65%{opacity:1}100%{opacity:0}}
@media(prefers-reduced-motion:reduce){.hole-disk{animation:none!important}body.entering-universe .star-entry,body.entering-universe #space{transition:none!important}body.white-emergence .white-flash{animation:none!important;display:none!important}}


/* V2: a single GPU-rendered environment replaces the layered CSS illustration. */
#blackhole-space{position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none;display:block}
.has-blackhole-webgl .star-entry:before,.has-blackhole-webgl .star-entry:after,
.has-blackhole-webgl .hole-lens,.has-blackhole-webgl .hole-disk,.has-blackhole-webgl .hole-arcs{display:none!important}
.has-blackhole-webgl .star-entry{border:0;outline-offset:15px;filter:none!important}
.has-blackhole-webgl .star-entry:hover{transform:translate(-50%,-50%) scale(1.04)}
.has-blackhole-webgl body.entering-universe .star-entry{transform:translate(-50%,-50%);opacity:0;transition:opacity .4s ease}
.has-blackhole-webgl body.entering-universe #space{transform:scale(1.5);filter:blur(2px) brightness(.4)}
.has-blackhole-webgl .auth-wall{background:radial-gradient(ellipse at center,#03070b00 0%,#01020891 72%,#000e 100%)}
.has-blackhole-webgl .auth-wall:before{background:linear-gradient(90deg,#0009,transparent 30%,transparent 70%,#0009)}
.has-blackhole-webgl .auth-wall:after{opacity:.12}
.cosmic-eyebrow{top:38px;left:clamp(20px,5vw,88px);right:auto;letter-spacing:.28em;text-align:left}
.cosmic-headline{top:17%;left:clamp(20px,6vw,100px);right:auto;width:min(340px,34vw);text-align:left;font:400 clamp(32px,3.6vw,57px)/1.07 Georgia,serif;text-shadow:0 3px 38px #000}
.cosmic-headline em{display:block;font-style:italic;color:#f2d2a2}
.star-entry{top:52%;width:min(36vw,470px);height:min(36vw,470px)}
.star-label{top:calc(100% + 8px);letter-spacing:.22em}
.cosmic-footer{bottom:30px;font-size:10px;letter-spacing:.23em}
.auth-card{z-index:7}
@media(max-width:800px){.cosmic-headline{top:13%;left:6%;width:88%;text-align:center;font-size:clamp(34px,7vw,51px)}.cosmic-eyebrow{left:0;right:0;text-align:center;font-size:9px;top:22px}.star-entry{top:50%;width:70vw;height:70vw}.star-label{top:calc(100% + 35px);font-size:10px}.cosmic-footer{bottom:18px;font-size:9px}}
@media(max-width:480px){.star-entry{width:84vw;height:84vw}.star-label{top:calc(100% + 8px)}}

@media(max-width:650px){.cosmic-headline{top:15%;font-size:clamp(35px,10vw,55px)}.star-entry{top:49%}.star-label{font-size:10px}.auth-card{padding:26px}.cosmic-footer{font-size:9px}}
@media(prefers-reduced-motion:reduce){#space,.auth-card,.star-entry{transition:none!important}.star-entry:before{animation:none!important}}

@media(max-width:650px){.top{padding:17px}.tag{display:none}.intro{top:30%}.idea-list{top:auto;bottom:95px;left:18px;right:18px;width:auto;max-height:28vh}.actions{bottom:20px}.actions button{padding:10px;font-size:12px}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
</style></head><body>
<canvas id="space" aria-label="Three-dimensional starfield and spiral galaxies"></canvas>
<header class="top"><div><div class="brand">THE CREATIVE UNIVERSE</div><div class="tag">Fern &amp; Lyra · early prototype</div></div><div><button id="belt">Asteroid Belt</button> <button id="signout" hidden>Sign out</button></div></header>
<section class="intro"><div class="tag">Every idea begins somewhere</div><h1>Your imagination<br>has a universe.</h1><p>Start a thought. Watch it become a constellation.</p></section>
<aside class="idea-list" id="ideas" aria-label="Saved ideas"></aside>
<nav class="actions"><button id="add">+ Create an idea</button><button id="all">View all stars</button></nav>
<div id="modal"></div><div class="white-flash" aria-hidden="true"></div>
<section class="auth-wall" id="auth-wall"><canvas id="blackhole-space" aria-hidden="true"></canvas><div class="cosmic-eyebrow">THE CREATIVE UNIVERSE &nbsp; · &nbsp; FERN & LYRA</div><div class="cosmic-headline">Beyond the <em>event horizon.</em></div><button type="button" class="star-entry" id="portal-star" aria-label="Enter the black hole to sign in"><span class="hole-lens"></span><span class="hole-disk"></span><span class="hole-arcs"></span><span class="star-label">Cross the event horizon<small>✦ Click the black hole to enter ✦</small></span></button><div class="cosmic-footer">EVERY UNIVERSE BEGINS WITH A LEAP INTO THE UNKNOWN</div><form class="auth-card" id="auth-form"><button class="portal-back" type="button" id="portal-back" aria-label="Return to galaxy">← Back to galaxy</button><div class="tag">A private universe for every mind</div><h2>Enter your universe.</h2><p>Sign in or create an account to save your stars across devices.</p><input id="email" type="email" autocomplete="email" placeholder="Email address" required><input id="password" type="password" autocomplete="current-password" placeholder="Password" minlength="6" required><div class="auth-buttons"><button type="submit">Sign in</button><button class="secondary" type="button" id="signup">Create account</button></div><p class="auth-error" id="auth-error" role="status"></p></form></section>
<script src="/blackhole.js" defer></script>
<script type="module">
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.95.0/+esm';
const db=createClient('https://gzsxyjysdrqzqeeqadbu.supabase.co','sb_publishable_wPJwCUJl6ytV8XzfmjTX0g_Nm8D2kax');
let ideas=[],currentUser=null;const list=document.getElementById('ideas');let belt=false;
const errText=e=>e?.message||'Something went wrong. Please try again.';
async function loadIdeas(){if(!currentUser){ideas=[];renderList();return}const {data,error}=await db.from('creative_universe_ideas').select('id,title,description,status,created_at').order('created_at',{ascending:false});if(error){alert(errText(error));return}ideas=data||[];renderList()}
function setUser(user){const entering=!!user&&!currentUser&&document.getElementById('auth-wall').classList.contains('portal-open');currentUser=user;document.getElementById('signout').hidden=!user;if(entering){document.body.classList.add('white-emergence');setTimeout(()=>{document.getElementById('auth-wall').hidden=true;document.getElementById('auth-wall').classList.remove('portal-open');document.body.classList.remove('white-emergence');loadIdeas()},matchMedia('(prefers-reduced-motion: reduce)').matches?0:1650)}else{document.getElementById('auth-wall').hidden=!!user;loadIdeas()}}
const portalWall=document.getElementById('auth-wall');let portalTimer=null;
document.getElementById('portal-star').onclick=()=>{if(portalWall.classList.contains('portal-open'))return;document.body.classList.add('entering-universe');clearTimeout(portalTimer);portalTimer=setTimeout(()=>{document.body.classList.remove('entering-universe');portalWall.classList.add('portal-open');document.getElementById('email').focus()},matchMedia('(prefers-reduced-motion: reduce)').matches?0:1100)};
document.getElementById('portal-back').onclick=()=>{clearTimeout(portalTimer);document.body.classList.remove('entering-universe');portalWall.classList.remove('portal-open');document.getElementById('portal-star').focus()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!portalWall.hidden&&portalWall.classList.contains('portal-open'))document.getElementById('portal-back').click()});
const authError=document.getElementById('auth-error');document.getElementById('auth-form').onsubmit=async e=>{e.preventDefault();authError.textContent='Signing in…';const {error}=await db.auth.signInWithPassword({email:document.getElementById('email').value,password:document.getElementById('password').value});authError.textContent=error?errText(error):''};
document.getElementById('signup').onclick=async()=>{authError.textContent='Creating your account…';const {data,error}=await db.auth.signUp({email:document.getElementById('email').value,password:document.getElementById('password').value,options:{emailRedirectTo:location.origin+'/'}});authError.textContent=error?errText(error):(data.session?'Welcome to your universe.':'Check your email to confirm your account, then sign in.')};
document.getElementById('signout').onclick=async()=>{await db.auth.signOut()};
db.auth.onAuthStateChange((_event,session)=>{setUser(session?.user||null)});
db.auth.getUser().then(({data})=>{if(!currentUser)setUser(data.user||null)});
function renderList(){const visible=ideas.filter(x=>belt?x.status==='asteroid':x.status==='active');list.innerHTML=visible.length?'':'<p class="empty">'+(belt?'No discarded ideas yet.':'Your first idea is waiting to become a star.')+'</p>';visible.forEach(x=>{const b=document.createElement('button');b.className='idea'+(x.status==='asteroid'?' discarded':'');b.textContent=x.title;const s=document.createElement('small');s.textContent=x.status==='asteroid'?'Asteroid · tap to restore':'Idea · tap to explore';b.appendChild(s);b.onclick=()=>showIdea(x.id);list.appendChild(b)})}
const modal=document.getElementById('modal');function close(){modal.innerHTML=''};
function openDialog(title,body){modal.innerHTML='<div class="dialog-backdrop"><div class="dialog" role="dialog" aria-modal="true"><h2></h2><div class="content"></div></div></div>';modal.querySelector('h2').textContent=title;modal.querySelector('.content').appendChild(body);modal.querySelector('.dialog-backdrop').onclick=e=>{if(e.target.className==='dialog-backdrop')close()}}
function el(tag,text){const n=document.createElement(tag);if(text)n.textContent=text;return n}
document.getElementById('add').onclick=()=>{if(!currentUser)return;const wrap=el('div'),title=el('input'),note=el('textarea'),buttons=el('div');title.placeholder='Name your idea';title.maxLength=90;note.placeholder='What are you imagining?';note.maxLength=1200;buttons.className='controls';const create=el('button','Bring it to life'),cancel=el('button','Cancel');create.className='primary';create.onclick=async()=>{if(!title.value.trim())return title.focus();create.disabled=true;const {error}=await db.from('creative_universe_ideas').insert({title:title.value.trim(),description:note.value.trim(),status:'active'});create.disabled=false;if(error)return alert(errText(error));close();belt=false;await loadIdeas()};cancel.onclick=close;buttons.append(create,cancel);wrap.append(title,note,buttons,el('p','Your idea is saved privately to your account.'));openDialog('A new star',wrap);title.focus()};
function showIdea(id){const idea=ideas.find(x=>x.id===id);if(!idea)return;const wrap=el('div');wrap.append(el('p',idea.description||'A spark waiting for its first brainstorm.'));const buttons=el('div');buttons.className='controls';const change=el('button',idea.status==='asteroid'?'Reignite idea':'Turn into asteroid');change.className='primary';change.onclick=async()=>{const {error}=await db.from('creative_universe_ideas').update({status:idea.status==='asteroid'?'active':'asteroid',updated_at:new Date().toISOString()}).eq('id',id);if(error)return alert(errText(error));close();await loadIdeas()};const remove=el('button','Permanently delete');remove.onclick=async()=>{if(!confirm('Permanently erase this idea and its brainstorming history?'))return;const {error}=await db.from('creative_universe_ideas').delete().eq('id',id);if(error)return alert(errText(error));close();await loadIdeas()};const cancel=el('button','Close');cancel.onclick=close;buttons.append(change,remove,cancel);wrap.append(buttons);openDialog(idea.title,wrap)}
document.getElementById('belt').onclick=()=>{belt=!belt;document.getElementById('belt').textContent=belt?'Return to Stars':'Asteroid Belt';renderList()};document.getElementById('all').onclick=()=>{belt=false;document.getElementById('belt').textContent='Asteroid Belt';renderList()};renderList();
// A true perspective 3D point cloud rendered in WebGL (not a video or static image).
const canvas=document.getElementById('space'),gl=canvas.getContext('webgl',{antialias:true,alpha:false});
if(gl){const vs='attribute vec3 p;attribute vec3 col;uniform float time;uniform float ratio;varying vec3 vcol;void main(){float a=time*.012;mat2 rot=mat2(cos(a),-sin(a),sin(a),cos(a));vec3 q=p;q.xz=rot*q.xz;float z=q.z+32.;float scale=20./max(3.,z);gl_Position=vec4(q.x*scale/ratio,q.y*scale,0.,1.);gl_PointSize=clamp(1.5+40./z,1.,4.5);vcol=col;}';const fs='precision mediump float;varying vec3 vcol;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.05,d);gl_FragColor=vec4(vcol*a,1.);}';const shader=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s};const prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,vs));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);gl.useProgram(prog);
const positions=[],colors=[];let seed=19;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};function point(x,y,z,r,g,b){positions.push(x,y,z);colors.push(r,g,b)};
for(let i=0;i<4200;i++){const theta=rand()*Math.PI*2;const rr=Math.pow(rand(),.55)*50;const y=(rand()-.5)*38;point(Math.cos(theta)*rr,(rand()-.5)*42,Math.sin(theta)*rr, .35+rand()*.45,.45+rand()*.45,.6+rand()*.4)}
for(const galaxy of [{x:-9,y:1,z:1,s:1},{x:13,y:-5,z:10,s:.5}])for(let i=0;i<8500;i++){const arm=i%4,r=Math.pow(rand(),.75)*7*galaxy.s,theta=arm*Math.PI/2+r*.85+(rand()-.5)*(.2+r*.06),spread=(rand()-.5)*(.12+r*.035);let x=galaxy.x+Math.cos(theta)*r+spread,z=galaxy.z+Math.sin(theta)*r+spread,y=galaxy.y+(rand()-.5)*(.1+r*.08);const warm=rand()>.65;point(x,y,z,warm?.95:.65,warm?.72:.75,warm?.48:1.)}
const verts=new Float32Array(positions),cols=new Float32Array(colors);function buffer(name,data){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);const loc=gl.getAttribLocation(prog,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0)}buffer('p',verts);buffer('col',cols);const tloc=gl.getUniformLocation(prog,'time'),rloc=gl.getUniformLocation(prog,'ratio');const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;function frame(t){const w=canvas.clientWidth,h=canvas.clientHeight;const d=Math.min(devicePixelRatio||1,1.5);if(canvas.width!==Math.floor(w*d)||canvas.height!==Math.floor(h*d)){canvas.width=w*d;canvas.height=h*d;gl.viewport(0,0,canvas.width,canvas.height)}gl.clearColor(.006,.012,.03,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(tloc,reduced?0:t*.001);gl.uniform1f(rloc,w/h);gl.drawArrays(gl.POINTS,0,verts.length/3);if(!reduced)requestAnimationFrame(frame)}frame(0)}
</script></body></html>`;

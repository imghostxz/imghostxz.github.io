(function(){
var $=function(s){return document.querySelector(s)},$$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
document.getElementById('y').textContent=new Date().getFullYear();
var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;

/* code rain */
var cv=document.getElementById('rain'),cx=cv.getContext('2d'),cols,drops,fs=16,ch='01{}[]();=<>/\\#$%&+-local function end then if nil self Luau'.split('');
function size(){cv.width=innerWidth;cv.height=innerHeight;cols=Math.ceil(cv.width/fs);drops=Array.from({length:cols},function(){return Math.random()*-50})}
size();addEventListener('resize',size);
function draw(){cx.fillStyle='rgba(7,6,7,.12)';cx.fillRect(0,0,cv.width,cv.height);cx.font=fs+'px monospace';
for(var i=0;i<cols;i++){var t=ch[Math.floor(Math.random()*ch.length)];cx.fillStyle=Math.random()>.97?'#ffffff':(i%7===0?'#3a5bff':'#ff2638');cx.fillText(t,i*fs,drops[i]*fs);
if(drops[i]*fs>cv.height&&Math.random()>.975)drops[i]=0;drops[i]+=.5}}
var last=0;function loop(t){if(!document.hidden&&t-last>50){draw();last=t}requestAnimationFrame(loop)}
if(rm){for(var k=0;k<60;k++)draw()}else requestAnimationFrame(loop);

/* glow follows cursor */
var g=document.getElementById('glow');addEventListener('pointermove',function(e){g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'});

/* typed roles */
var roles=['Roblox Developer','Systems Scripter','Gameplay Programmer','UI Developer','Game Creator','Dreamer'],ri=0,ci=0,del=false,ty=document.getElementById('typed');
function type(){var w=roles[ri];ty.textContent=w.slice(0,ci);
if(!del&&ci===w.length){del=true;return setTimeout(type,1400)}
if(del&&ci===0){del=false;ri=(ri+1)%roles.length}
ci+=del?-1:1;setTimeout(type,del?35:75)}
if(rm)ty.textContent=roles[0];else type();

/* tilt */
function tilt(card,host,amt){host.addEventListener('pointermove',function(e){if(rm)return;var r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform='rotateY('+x*amt+'deg) rotateX('+-y*amt+'deg)'});
host.addEventListener('pointerleave',function(){card.style.transform=''})}
var pc=document.getElementById('pcard');tilt(pc,pc.parentNode,12);

/* card spotlight */
$$('.card').forEach(function(c){c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--x',(e.clientX-r.left)+'px');c.style.setProperty('--y',(e.clientY-r.top)+'px')})});

/* mobile menu */
var menu=$('#menu'),links=$('#links');
function setMenu(o){menu.setAttribute('aria-expanded',String(o));menu.setAttribute('aria-label',o?'Close menu':'Open menu');links.classList.toggle('open',o)}
menu.addEventListener('click',function(){setMenu(menu.getAttribute('aria-expanded')!=='true')});
$$('#links a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

/* code highlight + tabs */
var kw=/^(local|function|end|if|then|not|return|for|in|do|true|false|nil|def|async|await|const|else|elseif|from|import|let|and|or|while|repeat|until|break|continue|type|export|class|self)$/;
function hl(src,l){var cm=l==='py'?'(#[^\n]*)':l==='js'?'(\/\/[^\n]*)':'(--[^\n]*)';
return src.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(new RegExp(cm+'|("[^"\n]*"|`[^`\n]*`)|([A-Za-z_]\\w*)(?=\\()|([A-Za-z_]\\w*)|(\\b\\d+(?:\\.\\d+)?\\b)','g'),function(m,c,s,f,w,n){
if(c)return'<span class="c">'+c+'</span>';if(s)return'<span class="s">'+s+'</span>';if(f)return kw.test(f)?'<span class="k">'+f+'</span>':'<span class="f">'+f+'</span>';if(w)return kw.test(w)?'<span class="k">'+w+'</span>':w;if(n)return'<span class="nm">'+n+'</span>';return m})}
$$('pre.hl').forEach(function(p){p.innerHTML=hl(p.textContent,p.dataset.l)});
var T=[
['Combat','Hitbox.server.luau','lua','-- Server-side melee hit with validation\nlocal params = RaycastParams.new()\nparams.FilterType = Enum.RaycastFilterType.Exclude\n\nRemotes.Swing.OnServerEvent:Connect(function(player, aim: Vector3)\n\tlocal char = player.Character\n\tlocal root = char and char:FindFirstChild("HumanoidRootPart")\n\tif not root or not Cooldown.ready(player, "swing", 0.45) then return end\n\n\tparams.FilterDescendantsInstances = { char }\n\tlocal dir = (aim - root.Position).Unit * Weapon.RANGE\n\tlocal hit = workspace:Raycast(root.Position, dir, params)\n\n\tlocal hum = hit and hit.Instance.Parent:FindFirstChildOfClass("Humanoid")\n\tif hum and hum.Health > 0 then\n\t\thum:TakeDamage(Combo.damage(player))\n\t\tVFX.hit(hit.Position)\n\tend\nend)'],
['NPC AI','EnemyBrain.server.luau','lua','-- Simple state machine with pathfinding\nlocal PathfindingService = game:GetService("PathfindingService")\n\nlocal function think(npc)\n\tlocal target = Targets.closest(npc, AGGRO_RANGE)\n\tif not target then\n\t\treturn State.set(npc, "Patrol")\n\tend\n\n\tif (target.Position - npc.Root.Position).Magnitude < ATTACK_RANGE then\n\t\treturn State.set(npc, "Attack", target)\n\tend\n\n\tlocal path = PathfindingService:CreatePath({ AgentCanJump = true })\n\tpath:ComputeAsync(npc.Root.Position, target.Position)\n\tif path.Status == Enum.PathStatus.Success then\n\t\tState.set(npc, "Chase", path:GetWaypoints())\n\tend\nend'],
['Abilities','AbilityService.luau','lua','--!strict\nexport type Ability = {\n\tname: string,\n\tcooldown: number,\n\tcost: number,\n\tcast: (player: Player) -> (),\n}\n\nlocal used: { [Player]: { [string]: number } } = {}\n\nlocal function tryCast(player: Player, ability: Ability): boolean\n\tlocal t = used[player] or {}\n\tused[player] = t\n\tif os.clock() - (t[ability.name] or 0) < ability.cooldown then\n\t\treturn false\n\tend\n\tif not Energy.spend(player, ability.cost) then return false end\n\n\tt[ability.name] = os.clock()\n\tability.cast(player)\n\treturn true\nend'],
['Movement','Dash.client.luau','lua','-- Dash with LinearVelocity\nlocal UserInputService = game:GetService("UserInputService")\n\nUserInputService.InputBegan:Connect(function(input, typing)\n\tif typing or input.KeyCode ~= Enum.KeyCode.Q then return end\n\tif not Cooldown.ready("dash", 1) then return end\n\n\tlocal lv = Instance.new("LinearVelocity")\n\tlv.Attachment0 = root.RootAttachment\n\tlv.MaxForce = math.huge\n\tlv.VectorVelocity = root.CFrame.LookVector * 70\n\tlv.Parent = root\n\n\tAnim.play("Dash")\n\ttask.delay(0.18, function() lv:Destroy() end)\nend)'],
['Animation','AttackAnim.luau','lua','-- Sync damage and VFX to keyframe markers\nlocal track = animator:LoadAnimation(Anims.Slash)\ntrack.Priority = Enum.AnimationPriority.Action\n\ntrack:GetMarkerReachedSignal("Hit"):Connect(function()\n\tHitbox.fire(character)\nend)\n\ntrack:GetMarkerReachedSignal("Trail"):Connect(function(on)\n\tweapon.Trail.Enabled = on == "1"\nend)\n\ntrack:Play(0.1, 1, 1.15)'],
['Luau shop','OutfitShop.server.luau','lua','-- Server-side outfit purchase (validated)\nRemotes.BuyOutfit.OnServerEvent:Connect(function(player, outfitId)\n\tlocal outfit = Catalog.get(outfitId)\n\tif not outfit then return end\n\n\tlocal missing, total = {}, 0\n\tfor _, item in outfit.items do\n\t\tif not Inventory.owns(player, item.id) then\n\t\t\ttable.insert(missing, item)\n\t\t\ttotal += item.price\n\t\tend\n\tend\n\n\tCart.checkout(player, missing, total)\n\tUI.notify(player, "Outfit added: " .. #missing .. " items")\nend)'],
['UI animation','CardHover.client.luau','lua','-- Hover and press feedback for shop cards\nlocal TweenService = game:GetService("TweenService")\nlocal info = TweenInfo.new(0.25, Enum.EasingStyle.Quint)\n\ncard.MouseEnter:Connect(function()\n\tTweenService:Create(card, info, {Size = UDim2.fromScale(1.04, 1.04)}):Play()\n\tTweenService:Create(stroke, info, {Transparency = 0}):Play()\nend)\n\ncard.MouseLeave:Connect(function()\n\tTweenService:Create(card, info, {Size = UDim2.fromScale(1, 1)}):Play()\n\tTweenService:Create(stroke, info, {Transparency = 0.6}):Play()\nend)'],
['VFX','PurchaseBurst.luau','lua','-- Burst effect when an outfit is bought\nlocal emitter = Instance.new("ParticleEmitter")\nemitter.Texture = "rbxassetid://" .. SPARK_ID\nemitter.Lifetime = NumberRange.new(0.4, 0.9)\nemitter.Speed = NumberRange.new(14, 22)\nemitter.SpreadAngle = Vector2.new(180, 180)\nemitter.Color = ColorSequence.new(Color3.fromRGB(255, 38, 56))\nemitter.Rate = 0\nemitter.Parent = player.Character.HumanoidRootPart\n\nemitter:Emit(40)\ntask.delay(1, function() emitter:Destroy() end)'],
['DataStore','Profile.server.luau','lua','-- Safe loading and saving\nlocal store = DataStoreService:GetDataStore("PlayerData_v1")\n\nPlayers.PlayerAdded:Connect(function(player)\n\tlocal ok, data = pcall(store.GetAsync, store, player.UserId)\n\tif ok and data then\n\t\tProfile.load(player, data)\n\telse\n\t\tProfile.new(player)\n\tend\nend)\n\nPlayers.PlayerRemoving:Connect(function(player)\n\tpcall(store.SetAsync, store, player.UserId, Profile.get(player))\nend)'],
['Receipts','Receipts.server.luau','lua','-- Developer Products: grant once, never twice\nMarketplaceService.ProcessReceipt = function(info)\n\tlocal profile = Profiles.get(info.PlayerId)\n\tif not profile then\n\t\treturn Enum.ProductPurchaseDecision.NotProcessedYet\n\tend\n\n\tif profile.Data.receipts[info.PurchaseId] then\n\t\treturn Enum.ProductPurchaseDecision.PurchaseGranted\n\tend\n\n\tProducts[info.ProductId].grant(profile)\n\tprofile.Data.receipts[info.PurchaseId] = os.time()\n\treturn Enum.ProductPurchaseDecision.PurchaseGranted\nend'],
['Optimization','Pool.luau','lua','-- Object pool: reuse parts instead of creating new ones\nlocal Pool = {}\nPool.__index = Pool\n\nfunction Pool.new(template: BasePart, size: number)\n\tlocal self = setmetatable({ free = {}, template = template }, Pool)\n\tfor i = 1, size do\n\t\tlocal p = template:Clone()\n\t\tp.Parent = nil\n\t\ttable.insert(self.free, p)\n\tend\n\treturn self\nend\n\nfunction Pool:get(): BasePart\n\treturn table.remove(self.free) or self.template:Clone()\nend\n\nfunction Pool:release(p: BasePart)\n\tp.Parent = nil\n\ttable.insert(self.free, p)\nend\n\nreturn Pool'],
['Python bot','sales_bot.py','py','# Discord sales ticket\n@bot.tree.command(name="order", description="Create a sale ticket")\nasync def order(ix, product: str):\n    item = await db.products.find(product)\n    if item.stock < 1:\n        return await ix.response.send_message("Out of stock", ephemeral=True)\n\n    ticket = await create_ticket(ix.user, item)\n    await log("order", ix.user, item)\n    await ix.response.send_message(f"Ticket: {ticket.mention}", ephemeral=True)'],
['TypeScript API','server.ts','js','// Roblox to API to Discord\napp.post("/roblox/purchase", async (req, res) => {\n  const { userId, outfitId } = req.body\n\n  await db.orders.insert({ userId, outfitId, status: "paid" })\n  await discord.log(`New purchase: ${outfitId}`)\n\n  res.json({ ok: true })\n})']
];
var tb=document.getElementById('tabs'),sn=document.getElementById('snip'),fn=document.getElementById('fname');
function show(i,focus){sn.innerHTML=hl(T[i][3],T[i][2]);fn.textContent=T[i][1];Array.prototype.forEach.call(tb.children,function(b,j){var on=j===i;b.classList.toggle('on',on);b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1});sn.setAttribute('aria-labelledby','tab'+i);if(focus)tb.children[i].focus()}
T.forEach(function(t,i){var b=document.createElement('button');b.type='button';b.className='tab';b.id='tab'+i;b.setAttribute('role','tab');b.setAttribute('aria-controls','snip');b.textContent=t[0];b.onclick=function(){show(i)};
b.onkeydown=function(e){var n=e.key==='ArrowRight'?(i+1)%T.length:e.key==='ArrowLeft'?(i-1+T.length)%T.length:null;if(n!==null){e.preventDefault();show(n,true)}};tb.appendChild(b)});show(0);

/* letter scramble */
var sc='01<>/{}#$%&*';
function scr(el){var t=el.getAttribute('data-t')||el.textContent;el.setAttribute('data-t',t);if(rm)return;var i=0,iv=setInterval(function(){el.textContent=t.split('').map(function(c,j){return c===' '||j<i?c:sc[Math.floor(Math.random()*sc.length)]}).join('');i+=1.3;if(i>=t.length){el.textContent=t;clearInterval(iv)}},30)}
var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){scr(e.target);io2.unobserve(e.target)}})},{threshold:.6});
$$('.scr,.eyebrow').forEach(function(el){io2.observe(el)});

/* reveal */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{threshold:.06});
$$('.reveal').forEach(function(el){io.observe(el)});

/* ---------- work: player, filters, previews ---------- */
var V='assets/video/',P=V+'posters/';
var cards=$$('.vcard'),pv=$('#pVideo'),cur=0;
function load(i,play){
  cur=(i+cards.length)%cards.length;var c=cards[cur],d=c.dataset;
  pv.pause();pv.poster=P+d.v+'.webp';pv.querySelector('source').src=V+d.v+'.mp4';pv.load();
  $('#pFile').innerHTML='<b>'+d.v+'</b>.mp4';
  $('#pCat').innerHTML=d.cl;$('#pTitle').innerHTML=d.title;$('#pDesc').textContent=d.desc;
  $('#pTags').innerHTML=d.tags.split('|').map(function(t){return'<li>'+t+'</li>'}).join('');
  cards.forEach(function(x,j){x.classList.toggle('playing',j===cur);x.setAttribute('aria-pressed',String(j===cur))});
  if(play){var p=pv.play();if(p&&p.catch)p.catch(function(){})}
}
cards.forEach(function(c,i){
  c.setAttribute('aria-label','Play video: '+c.dataset.title.replace('&amp;','&'));
  c.addEventListener('click',function(){load(i,true);$('#work .feature').scrollIntoView({behavior:rm?'auto':'smooth',block:'center'})});
  if(fine&&!rm){var tv=null,th=c.querySelector('.thumb'),tm;
    c.addEventListener('pointerenter',function(){tm=setTimeout(function(){if(!tv){tv=document.createElement('video');tv.muted=true;tv.loop=true;tv.playsInline=true;tv.preload='none';tv.src=V+c.dataset.v+'.mp4#t=4';th.insertBefore(tv,th.children[1])}
      var p=tv.play();if(p&&p.catch)p.catch(function(){});c.classList.add('preview')},250)});
    c.addEventListener('pointerleave',function(){clearTimeout(tm);c.classList.remove('preview');if(tv)tv.pause()});
  }
});
cards[0].classList.add('playing');
$('#pPrev').onclick=function(){load(cur-1,true)};$('#pNext').onclick=function(){load(cur+1,true)};
/* autoplay the featured video (muted) when it scrolls into view on desktop */
var saveData=navigator.connection&&navigator.connection.saveData;
var autoplayed=false;
if(fine&&!rm&&!saveData){new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(!autoplayed&&pv.paused){autoplayed=true;var p=pv.play();if(p&&p.catch)p.catch(function(){})}}else if(!pv.paused)pv.pause()})},{threshold:.5}).observe(pv)}

$$('.filters .tab').forEach(function(f){f.addEventListener('click',function(){var k=f.dataset.f;
  $$('.filters .tab').forEach(function(x){x.classList.toggle('on',x===f);x.setAttribute('aria-pressed',String(x===f))});
  cards.forEach(function(c){c.classList.toggle('hide',k!=='all'&&(' '+c.dataset.cat+' ').indexOf(' '+k+' ')<0)})})});

/* playing state on the player frame */
var pl=$('#player');pv.addEventListener('play',function(){pl.classList.add('playing')});pv.addEventListener('pause',function(){pl.classList.remove('playing')});

/* commissions poster tilt */
var pb=$('#posterbox');if(pb&&fine)tilt($('#pcard2'),pb,10);

/* scroll progress */
var bar=$('#progress'),tick=false;
function prog(){var h=document.documentElement,max=h.scrollHeight-innerHeight;bar.style.transform='scaleX('+(max>0?Math.min(1,scrollY/max):0)+')';tick=false}
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(prog)}},{passive:true});prog();

/* staggered entrance for cards */
var pops=$$('.pop');
if(rm||!('IntersectionObserver' in window)){pops.forEach(function(el){el.classList.add('in')})}else{
  pops.forEach(function(el){var sib=Array.prototype.filter.call(el.parentNode.children,function(x){return x.classList.contains('pop')});el.style.setProperty('--i',Math.min(sib.indexOf(el)%6,5))});
  var io3=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io3.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -30px 0px'});
  pops.forEach(function(el){io3.observe(el)});
}

/* magnetic buttons */
if(fine&&!rm){$$('.mag').forEach(function(m){m.addEventListener('pointermove',function(e){var r=m.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;m.style.translate=(x*.18)+'px '+(y*.3)+'px'});m.addEventListener('pointerleave',function(){m.style.translate=''})})}

/* gallery lightbox */
var lb=$('#lightbox'),lbImg=$('#lbImg'),lbCap=$('#lbCap'),lastShot=null;
$$('.shot').forEach(function(s){s.setAttribute('aria-label','View larger: '+s.querySelector('b').textContent);s.addEventListener('click',function(){
  if(typeof lb.showModal!=='function'){window.open(s.dataset.full,'_blank','noopener');return}
  lastShot=s;lbImg.src=s.dataset.full;lbImg.alt=s.querySelector('img').alt;lbCap.innerHTML=s.dataset.cap;lb.showModal()})});
$('#lbClose').addEventListener('click',function(){lb.close()});
lb.addEventListener('click',function(e){if(e.target===lb)lb.close()});
lb.addEventListener('close',function(){if(lastShot)lastShot.focus()});

/* copy */
var b=document.getElementById('copy'),st=document.getElementById('copyStatus'),handle='imghostxz';
function copied(ok){b.textContent=ok?'Copied ✓':'imghostxz';b.classList.toggle('copy-ok',ok);st.textContent=ok?'Discord username copied.':'Copy failed. The username is imghostxz.';setTimeout(function(){b.textContent='Copy username';b.classList.remove('copy-ok')},2000)}
function legacy(){var ta=document.createElement('textarea');ta.value=handle;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();var ok=false;try{ok=document.execCommand('copy')}catch(e){}document.body.removeChild(ta);copied(ok)}
b.addEventListener('click',function(){if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(handle).then(function(){copied(true)},legacy)}else legacy()});
})();

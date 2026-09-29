/* ============================================================
   ЦУНДЕРЕ-КАЗИНО v7 — файловая таблица рекордов
   ============================================================ */

/* ---------- ЗВУК ---------- */
let actx=null,soundOn=true;
const audio=()=>actx||(actx=new(window.AudioContext||window.webkitAudioContext)());
function beep(f,d=.08,t='square',v=.04,w=0){
  if(!soundOn)return;
  try{const a=audio(),o=a.createOscillator(),g=a.createGain();
    o.type=t;o.frequency.value=f;
    g.gain.setValueAtTime(v,a.currentTime+w);
    g.gain.exponentialRampToValueAtTime(.001,a.currentTime+w+d);
    o.connect(g);g.connect(a.destination);
    o.start(a.currentTime+w);o.stop(a.currentTime+w+d);}catch(e){}
}
const sfxTick=()=>beep(600+Math.random()*200,.03,'square',.02);
const sfxLose=()=>{beep(220,.15,'sawtooth',.05);beep(160,.25,'sawtooth',.05,.12);};
const sfxWin=()=>[523,659,784,1047].forEach((f,i)=>beep(f,.12,'triangle',.06,i*.08));
const sfxJack=()=>[523,659,784,1047,1319,1568,2093].forEach((f,i)=>beep(f,.15,'triangle',.08,i*.07));
const sfxBonus=()=>[659,784,988,1175,1568].forEach((f,i)=>beep(f,.18,'sine',.07,i*.09));
const sfxClick=()=>beep(900,.03,'square',.03);
const sfxLevel=()=>[784,988,1175,1568].forEach((f,i)=>beep(f,.15,'sine',.07,i*.1));
const sfxGamble=()=>[440,554,659,880].forEach((f,i)=>beep(f,.07,'square',.04,i*.05));
const sfxAch=()=>[523,659,784,1047,1319].forEach((f,i)=>beep(f,.2,'sine',.08,i*.1));
const sfxEvent=()=>[392,494,587,784].forEach((f,i)=>beep(f,.2,'sine',.07,i*.12));
const sfxQuest=()=>[659,988,1319].forEach((f,i)=>beep(f,.13,'triangle',.06,i*.08));
const sfxBuy=()=>[784,1047,1319].forEach((f,i)=>beep(f,.1,'sine',.06,i*.05));
const sfxWheel=()=>[523,587,659,784,880,1047].forEach((f,i)=>beep(f,.08,'square',.05,i*.06));
const sfxLB=()=>[659,880,1175,1568].forEach((f,i)=>beep(f,.14,'triangle',.07,i*.1));
const sfxDaily=()=>[523,659,784,880,1047,1319].forEach((f,i)=>beep(f,.12,'sine',.06,i*.09));

/* ---------- СЕРДЕЧКИ ---------- */
(function(){const b=document.getElementById('hearts');const e=['💖','💗','💝','💕','🌸','✨','🎀'];
for(let i=0;i<16;i++){const h=document.createElement('div');h.className='heart';h.textContent=e[i%e.length];
h.style.left=Math.random()*100+'%';h.style.animationDuration=(7+Math.random()*9)+'s';
h.style.animationDelay=(Math.random()*12)+'s';h.style.fontSize=(12+Math.random()*14)+'px';b.appendChild(h);}})();

/* ---------- ТЕМЫ ---------- */
const THEMES={
  sakura:{name:'🌸 Сакура',accent:'#ff6b9d',symbols:[
    {e:'🌸',w:26,pay:6},{e:'🍒',w:22,pay:5},{e:'🍋',w:16,pay:8},{e:'⭐',w:10,pay:12},
    {e:'💎',w:8,pay:25},{e:'💖',w:4,pay:50},{e:'🌟',w:4,wild:1},{e:'🎀',w:3,scatter:1},
    {e:'💀',w:3,skull:1},{e:'🍀',w:2,lucky:1}]},
  moon:{name:'🌙 Кровавая луна',accent:'#c0392b',symbols:[
    {e:'🍒',w:22,pay:5},{e:'🌙',w:18,pay:9},{e:'⭐',w:14,pay:14},{e:'🔮',w:10,pay:22},
    {e:'💎',w:8,pay:32},{e:'🩸',w:4,pay:55},{e:'🌟',w:3,wild:1},{e:'🎀',w:3,scatter:1},
    {e:'💀',w:5,skull:1},{e:'🍀',w:1,lucky:1}]},
  neon:{name:'🎆 Неон',accent:'#00d9ff',symbols:[
    {e:'🎆',w:24,pay:6},{e:'🎇',w:20,pay:6},{e:'⚡',w:16,pay:10},{e:'💠',w:10,pay:18},
    {e:'🔷',w:8,pay:28},{e:'💖',w:4,pay:45},{e:'🌟',w:8,wild:1},{e:'🎀',w:4,scatter:1},
    {e:'💀',w:2,skull:1},{e:'🍀',w:2,lucky:1}]}
};

/* ---------- ФРАЗЫ ---------- */
const PHRASES={
  lose:["Ха! Я же говорила! Ты проиграл, идиот~ 💅","Не расстраивайся... то есть расстраивайся! Мне весело!",
    "Твои фишки теперь мои. Приятно держать их в руках... хмф!","Проиграл? Какой же ты невнимательный... ладно, держи пятюню на чай.",
    "М-может хватит? Я... не то чтобы переживаю! Просто скучно смотреть!","Опять?! Н-ну ты и неудачник... но я всё ещё здесь. Так и быть.",
    "Пф-ф! И это всё, на что ты способен? Слабак~","Х-хех... я специально тебе поддаюсь! Н-не наглей только!",
    "Ты думал, тебе повезёт? Со мной? Н-наивный!","М-м-м, вкусные фишки... твои, между прочим~"],
  win:["В-выиграл?! Это... это случайность! Не зазнавайся!","Ладно, ладно, неплохо... для такого идиота.",
    "П-получил свои фишки обратно... я не рада! Совсем не рада!","Только попробуй потратить это не на меня!",
    "Х-хмф! Повезло один раз. Не привыкай!","Н-не думай, что я горжусь тобой! Просто... удача, вот и всё!",
    "О-о... это было неплохо. Я... я чуть не улыбнулась! Не смотри!"],
  jack:["Д-ДЖЕКПОТ?! Т-ты... ты серьёзно?! Э-это нечестно! Я... я не рада! Н-но... поздравляю, дурак...",
    "💖💗💝 ДЖЕКПОТ! Л-ладно, ты выиграл по-крупному... н-но это ничего не значит! Ничего!"],
  bonus:["🎀🎀🎀 ФРИСПИНЫ! Н-ну держись... я тебе не поддамся! То есть... ой, всё!",
    "Б-бонус?! Х-хорошо, вот тебе спины! Н-но это НЕ значит, что я тебя люблю!"],
  freeWin:["И-и во фриспинах выиграл?! П-показушник!","Х-хех... ладно, неплохо для бесплатного спина. Н-но не зазнавайся!"],
  gambleWin:["У-УДВОИЛ?! С-сумасшедший! Я... я чуть не умерла от волнения! Д-дурак!",
    "В-везёт же... н-но не привыкай! В следующий раз проиграешь!"],
  gambleLose:["П-проиграл! Ха! Т-так тебе и надо! ...н-но мне немного тебя жалко. Совсем чуть-чуть!",
    "В-всё сгорело! Я же говорила — не рискуй! Н-но... не расстраивайся сильно, ладно?"],
  levelUp:["У-УРОВЕНЬ ВЫШЕ! Н-ну... ты растёшь. Я... я за тебя рада! Н-НЕ ДУМАЙ ЧТО ЭТО ЗНАЧИТ ЧТО-ТО!",
    "Новый уровень! +50 фишек! Н-на, подавись... но ты молодец. ОЙ. Н-не слышал!"],
  nearBust:["Эй... у тебя почти не осталось фишек. М-может... может хватит? Я н-не переживаю!",
    "Т-ты проигрываешь всё! Д-дурак! Я... я не смотрю! Но... держись там, ладно?"],
  comeback:["О-о-о! Отбился?! Н-невероятно! Я... я чуть не заплакала! ОТ РАДОСТИ! Т-то есть от злости!",
    "В-вернулся в игру! К-какой же ты упрямый... это... это мило. ОЙ. Н-не мило!"],
  idle:["Н-ну? Ты собираешься крутить или так и будешь на меня смотреть?","Х-хмф... я не скучаю по тебе. Я просто жду, когда ты нажмёшь кнопку!",
    "Т-ты... э-эй. Не отвлекайся. Крути давай!","М-может... может покажешь, на что способен? Н-не то чтобы мне интересно!"],
  combo:["Х-хмф! Комбо... н-неплохо для тебя!","О-о, серия пошла! Н-но не зазнавайся!","К-комбо?! Какой же ты... везучий. Н-не то чтобы я впечатлена!"],
  allin:["В-ВА-БАНК?! Т-ты сумасшедший! Я... я не смотрю! Н-но... удачи. Н-ЕМУ! Не тебе!",
    "💥 Всё на кон?! Д-дурак! Если проиграешь — я... я расстроюсь! Н-НЕ РАССТРОЮСЬ!"],
  event:["О-о?! Что это... событие! Н-ну, посмотрим!","Х-хмф! Событие! Н-не думай, что я рада... но интересно!"],
  questDone:["К-квест выполнен! Н-на, держи награду... н-не думай, что я рада!","О-о, задание сделал? Н-ну... молодец. Н-немного!"],
  relicBuy:["К-купил реликвию?! Н-ну... надеюсь, не зря потратил!","Р-реликвия твоя... н-не думай, что я подбирала специально для тебя!"],
  wheel:["К-колесо! Крути уже, не тяни! Н-не то чтобы мне интересно...","Х-хмф! Колесо фортуны... удача или позор, дурак?"],
  lbSave:["З-записался в таблицу?! Н-ну... посмотрим, надолго ли тебя хватит!","О-о, рекорд! Н-не зазнавайся, другие тоже играют!"],
  lbShare:["Ш-шаришь рекорд? Х-хех... пусть все видят, какой ты... на самом деле. Н-не то чтобы я гордилась!","Д-делись! Но не думай, что я хвастаюсь тобой! Я... я вообще тут ни при чём!"],
  daily:["Е-ежедневный бонус! Н-на, забирай! Н-не то чтобы я ждала тебя каждый день!","О-о, ты вернулся... вот, бонус. П-просто так! Не благодари!"],
};
const phrase=c=>{const a=PHRASES[c];return a[Math.floor(Math.random()*a.length)];};

/* ---------- РЕЛИКВИИ ---------- */
const RELICS=[
  {id:'charm',icon:'🍀',name:'Талисман удачи',desc:'Каждые 5 спинов гарантирует пару при проигрыше',price:250},
  {id:'gem',icon:'💎',name:'Огранщик',desc:'Выплаты за дорогие символы x1.5',price:400},
  {id:'clock',icon:'⏳',name:'Часы цундере',desc:'+2 к фриспинам при бонусе',price:350},
  {id:'shield',icon:'🛡️',name:'Щит',desc:'Первый проигрыш возвращает ставку',price:300},
  {id:'investor',icon:'📈',name:'Инвестор',desc:'+10% фишек при старте события',price:500},
  {id:'target',icon:'🎯',name:'Метитель',desc:'Wild падает чаще (+50%)',price:450},
  {id:'comboboost',icon:'🔥',name:'Комбо-усилитель',desc:'Комбо +0.35 вместо +0.25',price:600},
  {id:'heart',icon:'💖',name:'Сердце цундере',desc:'Ва-банк 65% вместо 50%',price:800},
];

/* ---------- КВЕСТЫ ---------- */
const QUEST_POOL=[
  {id:'spins10',text:'Сделай 10 спинов',target:10,reward:150,stat:'qSpins'},
  {id:'spins25',text:'Сделай 25 спинов',target:25,reward:400,stat:'qSpins'},
  {id:'wins5',text:'Выиграй 5 раз',target:5,reward:250,stat:'qWins'},
  {id:'wins10',text:'Выиграй 10 раз',target:10,reward:500,stat:'qWins'},
  {id:'combo3',text:'Поймай комбо x3',target:3,reward:300,stat:'qMaxCombo'},
  {id:'bonus',text:'Запусти бонус 🎀',target:1,reward:300,stat:'qBonus'},
  {id:'jack',text:'Поймай джекпот',target:1,reward:600,stat:'qJack'},
  {id:'allin',text:'Сделай ALL-IN',target:1,reward:200,stat:'qAllin'},
  {id:'gamblewin',text:'Выиграй в ва-банке',target:1,reward:250,stat:'qGambleWin'},
  {id:'wheel',text:'Крути колесо',target:1,reward:200,stat:'qWheel'},
  {id:'lucky',text:'Поймай 🍀',target:1,reward:200,stat:'qLucky'},
];

/* ---------- СОБЫТИЯ ---------- */
const EVENTS=[
  {id:'sakura',name:'🌸 Дождь сакуры',desc:'+15 фишек за спин',spins:5,color:'#ff6b9d'},
  {id:'curse',name:'💀 Проклятие',desc:'Больше 💀, но выигрыши x2',spins:4,color:'#c0392b'},
  {id:'luck',name:'🍀 Полоса удачи',desc:'Гарантированная пара',spins:3,color:'#2ecc71'},
  {id:'diamond',name:'💎 Алмазный дождь',desc:'💎 в 3 раза чаще',spins:5,color:'#00d9ff'},
  {id:'wild',name:'🌟 Дикий шторм',desc:'Wild в 3 раза чаще',spins:4,color:'#9d4edd'},
  {id:'gold',name:'💰 Золотая лихорадка',desc:'Все выплаты +25%',spins:4,color:'#ffd166'},
];

/* ---------- КОЛЕСО ---------- */
const WHEEL=[
  {prize:'+100 💰',action:()=>{S.chips+=100;bump(chipsEl,true);}},
  {prize:'+300 💰',action:()=>{S.chips+=300;bump(chipsEl,true);}},
  {prize:'+600 💰',action:()=>{S.chips+=600;bump(chipsEl,true);}},
  {prize:'+5 XP',action:()=>{addXP(5);}},
  {prize:'1 фриспин',action:()=>{S.freeSpins+=1;}},
  {prize:'Ничего 😢',action:()=>{}},
  {prize:'Случайная реликвия',action:()=>{
    const avail=RELICS.filter(r=>!S.relics[r.id]);
    if(avail.length){const r=avail[Math.floor(Math.random()*avail.length)];S.relics[r.id]=true;toast('🎁 Реликвия!',r.icon+' '+r.name,true);}
    else {S.chips+=200;bump(chipsEl,true);toast('🎁 Всё собрано!','+200 💰');}
  }},
  {prize:'💥 ДЖЕКПОТ x10 ставки!',action:()=>{const w=S.bet*10;S.chips+=w;bump(chipsEl,true);toast('💥 ДЖЕКПОТ!','+'+w+' 💰',true);}},
];

/* ---------- ДОСТИЖЕНИЯ ---------- */
const ACHIEVEMENTS=[
  {id:'first_win',name:'Первая победа',desc:'Выиграй в первый раз',check:s=>s.wins>=1,reward:50},
  {id:'streak3',name:'Три подряд',desc:'3 победы подряд',check:s=>s.maxStreak>=3,reward:100},
  {id:'streak5',name:'Пять подряд',desc:'5 побед подряд',check:s=>s.maxStreak>=5,reward:300},
  {id:'jack',name:'Джекпот!',desc:'Поймай джекпот',check:s=>s.jackpots>=1,reward:500},
  {id:'bonus3',name:'Бонус-хантер',desc:'3 бонуса',check:s=>s.bonusCount>=3,reward:200},
  {id:'combo3',name:'Комбо-мастер',desc:'Комбо x3',check:s=>s.maxCombo>=3,reward:250},
  {id:'combo5',name:'Комбо-легенда',desc:'Комбо x5',check:s=>s.maxCombo>=5,reward:600},
  {id:'rich',name:'Богач',desc:'1000+ фишек',check:s=>s.chips>=1000,reward:100},
  {id:'whale',name:'Кит',desc:'5000+ фишек',check:s=>s.chips>=5000,reward:500},
  {id:'million',name:'Миллионер',desc:'10 000+ фишек',check:s=>s.chips>=10000,reward:2000},
  {id:'level5',name:'Опытный',desc:'Уровень 5',check:s=>s.level>=5,reward:200},
  {id:'level10',name:'Ветеран',desc:'Уровень 10',check:s=>s.level>=10,reward:500},
  {id:'level20',name:'Грандмастер',desc:'Уровень 20',check:s=>s.level>=20,reward:1500},
  {id:'spins50',name:'Полсотни',desc:'50 спинов',check:s=>s.totalSpins>=50,reward:150},
  {id:'spins200',name:'Двести!',desc:'200 спинов',check:s=>s.totalSpins>=200,reward:500},
  {id:'allin',name:'Смельчак',desc:'Сделай ALL-IN',check:s=>s.allinCount>=1,reward:100},
  {id:'allin_win',name:'Легенда',desc:'Победи в ALL-IN',check:s=>s.allinWins>=1,reward:1000},
  {id:'collector',name:'Коллекционер',desc:'3 реликвии',check:s=>Object.keys(s.relics).length>=3,reward:300},
  {id:'fullset',name:'Полный сет',desc:'Все 8 реликвий',check:s=>Object.keys(s.relics).length>=8,reward:3000},
  {id:'wheeler',name:'Крути-верти',desc:'Колесо 3 раза',check:s=>(s.qWheel||0)>=3,reward:300},
  {id:'daily5',name:'Верный игрок',desc:'5 ежедневных бонусов',check:s=>(s.dailyCount||0)>=5,reward:500},
  {id:'lbTop',name:'Чемпион',desc:'Запиши рекорд в таблицу',check:s=>s.lbSaved,reward:500},
];

/* ---------- СОСТОЯНИЕ ---------- */
const MAX_BET=1000,MIN_BET=5;
const SAVE_KEY='tsundere_casino_v7_save';
const NAME_KEY='tsundere_casino_v7_name';
const DAILY_KEY='tsundere_casino_v7_daily';
const LB_URL='./leaderboard.json';

const S={
  chips:500,bet:25,spinning:false,
  xp:0,level:1,
  freeSpins:0,freeMult:2,
  pendingWin:0,gamblesLeft:3,
  history:[],totalSpins:0,wins:0,best:0,
  streak:0,lossStreak:0,maxStreak:0,
  combo:0,maxCombo:0,
  theme:'sakura',
  jackpots:0,bonusCount:0,
  event:null,eventSpins:0,spinsUntilEvent:15+Math.floor(Math.random()*10),
  achievements:{},relics:{},diary:[],
  spinsSinceWheel:0,wheelActive:false,wheelSpinning:false,wheelRotation:0,
  quests:[],qSpins:0,qWins:0,qMaxCombo:0,qBonus:0,qJack:0,qAllin:0,qGambleWin:0,qWheel:0,qLucky:0,
  spinsSinceCharm:0,shieldReady:false,
  autoSpin:false,autoLeft:0,
  playerName:'',dailyCount:0,lbSaved:false,
};
S.allinCount=0;S.allinWins=0;

/* ---------- ТАБЛИЦА РЕКОРДОВ (файл) ---------- */
let LB_DATA=[];
let LB_DIRTY=false;

async function fetchLeaderboard(){
  try{
    const r=await fetch(LB_URL+'?_='+Date.now(),{cache:'no-store'});
    if(!r.ok) throw new Error('HTTP '+r.status);
    const d=await r.json();
    if(Array.isArray(d)) LB_DATA=d.filter(x=>x&&typeof x.c==='number');
    LB_DATA.sort((a,b)=>b.c-a.c);
    LB_DATA=LB_DATA.slice(0,10);
  }catch(e){
    // file:// или файл не найден — начинаем с пустой таблицы
    console.warn('Не удалось загрузить leaderboard.json:',e.message);
    LB_DATA=[];
  }
  renderLB();
}
function setLBDirty(on){
  LB_DIRTY=on;
  const el=document.getElementById('lbDirty');
  if(el) el.classList.toggle('on',on);
}
function addToLB(rec){
  LB_DATA.push(rec);
  LB_DATA.sort((a,b)=>b.c-a.c);
  LB_DATA=LB_DATA.slice(0,10);
  renderLB();
  setLBDirty(true);
}
function downloadLB(){
  const data=JSON.stringify(LB_DATA,null,2);
  const blob=new Blob([data],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='leaderboard.json';
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  setLBDirty(false);
  toast('⬇️ Скачано!','Залей файл в репозиторий',true);
}
function importLB(file){
  const reader=new FileReader();
  reader.onload=ev=>{
    try{
      const data=JSON.parse(ev.target.result);
      if(!Array.isArray(data)) throw new Error('Не массив');
      LB_DATA=data.filter(x=>x&&typeof x.c==='number').sort((a,b)=>b.c-a.c).slice(0,10);
      renderLB();
      setLBDirty(false);
      toast('⬆️ Импорт!','Таблица загружена',true);
      sfxLB();
    }catch(err){
      toast('⚠️ Ошибка','Не удалось прочитать файл');
    }
  };
  reader.readAsText(file);
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function renderLB(){
  const body=document.getElementById('lbBody');
  if(!body) return;
  body.innerHTML='';
  if(!LB_DATA.length){
    body.innerHTML='<tr><td colspan="4" class="lbEmpty">П-пусто... стань первым, дурак!</td></tr>';
    return;
  }
  LB_DATA.forEach((r,i)=>{
    const tr=document.createElement('tr');
    if(S.playerName && r.n===S.playerName && r.c<=S.chips) tr.className='me';
    const rankClass=i===0?'gold':i===1?'silver':i===2?'bronze':'';
    const medal=i===0?'🥇':i===1?'🥈':i===2?'🥉':'';
    tr.innerHTML='<td class="lbRank '+rankClass+'">'+(medal||('#'+(i+1)))+'</td>'+
      '<td class="lbName">'+escapeHtml(r.n||'Аноним')+'</td>'+
      '<td class="lbLvl">ур.'+(r.l||1)+'<br>'+(r.s||0)+' сп.</td>'+
      '<td class="lbChips">'+(r.c||0).toLocaleString('ru-RU')+'</td>';
    body.appendChild(tr);
  });
  checkAchievements();
}

/* ---------- ШАРИНГ ЧЕРЕЗ URL ---------- */
function encodeRecord(rec){
  try{
    const j=JSON.stringify(rec);
    return btoa(unescape(encodeURIComponent(j))).replace(/=+$/,'');
  }catch(e){return '';}
}
function decodeRecord(str){
  try{
    return JSON.parse(decodeURIComponent(escape(atob(str))));
  }catch(e){return null;}
}
function buildShareUrl(rec){
  return location.origin+location.pathname+'#rec='+encodeRecord(rec);
}
function checkIncomingRecord(){
  const m=location.hash.match(/#rec=([A-Za-z0-9+/_-]+)/);
  if(!m) return;
  const rec=decodeRecord(m[1]);
  if(!rec||typeof rec.c!=='number') return;
  document.getElementById('receiveInfo').innerHTML=
    '<b style="color:var(--gold);font-size:16px;">'+escapeHtml(rec.n||'Аноним')+'</b><br>'+
    '💰 Фишек: <b style="color:var(--green)">'+rec.c.toLocaleString('ru-RU')+'</b><br>'+
    '🏅 Уровень: '+(rec.l||1)+'<br>'+
    '🎰 Спинов: '+(rec.s||0)+'<br>'+
    '<span style="font-size:11px;color:#9b7fc4;">Прислали тебе свой рекорд. Добавить?</span>';
  document.getElementById('receiveModal').classList.add('on');
  document.getElementById('receiveAdd').onclick=()=>{
    addToLB({n:rec.n||'Аноним',c:rec.c,l:rec.l||1,s:rec.s||0,t:rec.t||'sakura',d:Date.now()});
    sfxLB();
    toast('🏅 Добавлено!',rec.n+' в таблице');
    document.getElementById('receiveModal').classList.remove('on');
    history.replaceState(null,'',location.pathname+location.search);
  };
  document.getElementById('receiveClose').onclick=()=>{
    document.getElementById('receiveModal').classList.remove('on');
    history.replaceState(null,'',location.pathname+location.search);
  };
}

/* ---------- DOM ---------- */
const $=id=>document.getElementById(id);
const reels=[0,1,2].map(i=>$('r'+i));
const msgEl=$('msg'),chipsEl=$('chips'),betEl=$('bet');
const winLine=$('winLine'),floatWin=$('floatWin'),coinFlip=$('coinFlip');
const gamblePanel=$('gamblePanel'),freeBadge=$('freeBadge');

const say=h=>msgEl.innerHTML=h;
const theme=()=>THEMES[S.theme];
const symbols=()=>theme().symbols;
function paymap(){const m={};symbols().forEach(s=>{if(s.pay)m[s.e]=s.pay;});return m;}

function pick(forceWild){
  let list=symbols();
  if(S.event){
    if(S.event.id==='curse') list=list.map(s=>s.skull?{...s,w:s.w*3}:s);
    if(S.event.id==='diamond') list=list.map(s=>s.e==='💎'?{...s,w:s.w*3}:s);
    if(S.event.id==='wild') list=list.map(s=>s.wild?{...s,w:s.w*3}:s);
  }
  if(S.relics.target) list=list.map(s=>s.wild?{...s,w:s.w*1.5|0}:s);
  if(forceWild){const w=list.find(s=>s.wild);if(w)return w.e;}
  const tot=list.reduce((s,x)=>s+x.w,0);
  let r=Math.random()*tot;
  for(const s of list){if((r-=s.w)<0)return s.e;}
  return list[0].e;
}
const setReel=(i,v)=>{reels[i].querySelector('.inner').textContent=v;};

function update(){
  chipsEl.textContent=S.chips;betEl.textContent=S.bet;
  $('stSpins').textContent=S.totalSpins;$('stWins').textContent=S.wins;
  $('stBest').textContent=S.best;$('stCombo').textContent=S.maxCombo;
  $('stRate').textContent=S.totalSpins?Math.round(S.wins/S.totalSpins*100)+'%':'0%';
  let st='';
  if(S.streak>=2)st='🔥 Серия: '+S.streak+'!';
  else if(S.lossStreak>=4)st='💔 Не везёт... держись!';
  if(S.combo>=1)st+='<span id="comboTag">💫 COMBO x'+comboMult().toFixed(2).replace(/\.?0+$/,'')+'</span>';
  $('streak').innerHTML=st;
  $('lvl').textContent=S.level;
  const need=S.level*10;
  $('xpFill').style.width=Math.min(100,S.xp/need*100)+'%';
  $('xpTxt').textContent=S.xp+'/'+need;
  if(S.freeSpins>0){freeBadge.classList.remove('hidden');$('fsCount').textContent=S.freeSpins;}
  else freeBadge.classList.add('hidden');
  if(S.event&&S.eventSpins>0){
    $('eventBanner').classList.add('on');
    $('eventBanner').tex

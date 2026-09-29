/* ============================================================
   ЦУНДЕРЕ-КАЗИНО v7 — основной игровой модуль
   ============================================================ */

import { initLeaderboard, fetchTop, submitScore, clearLocalCache, isCloudMode } from './leaderboard.js';

/* ==================== ЗВУК ==================== */
let actx = null, soundOn = true;
const audio = () => actx || (actx = new (window.AudioContext || window.webkitAudioContext)());
function beep(f, d = .08, t = 'square', v = .04, w = 0) {
  if (!soundOn) return;
  try {
    const a = audio(), o = a.createOscillator(), g = a.createGain();
    o.type = t; o.frequency.value = f;
    g.gain.setValueAtTime(v, a.currentTime + w);
    g.gain.exponentialRampToValueAtTime(.001, a.currentTime + w + d);
    o.connect(g); g.connect(a.destination);
    o.start(a.currentTime + w); o.stop(a.currentTime + w + d);
  } catch {}
}
const sfxTick  = () => beep(600 + Math.random() * 200, .03, 'square', .02);
const sfxLose  = () => { beep(220, .15, 'sawtooth', .05); beep(160, .25, 'sawtooth', .05, .12); };
const sfxWin   = () => [523, 659, 784, 1047].forEach((f, i) => beep(f, .12, 'triangle', .06, i * .08));
const sfxJack  = () => [523, 659, 784, 1047, 1319, 1568, 2093].forEach((f, i) => beep(f, .15, 'triangle', .08, i * .07));
const sfxBonus = () => [659, 784, 988, 1175, 1568].forEach((f, i) => beep(f, .18, 'sine', .07, i * .09));
const sfxClick = () => beep(900, .03, 'square', .03);
const sfxLevel = () => [784, 988, 1175, 1568].forEach((f, i) => beep(f, .15, 'sine', .07, i * .1));
const sfxGamble = () => [440, 554, 659, 880].forEach((f, i) => beep(f, .07, 'square', .04, i * .05));
const sfxAch   = () => [523, 659, 784, 1047, 1319].forEach((f, i) => beep(f, .2, 'sine', .08, i * .1));
const sfxEvent = () => [392, 494, 587, 784].forEach((f, i) => beep(f, .2, 'sine', .07, i * .12));
const sfxQuest = () => [659, 988, 1319].forEach((f, i) => beep(f, .13, 'triangle', .06, i * .08));
const sfxBuy   = () => [784, 1047, 1319].forEach((f, i) => beep(f, .1, 'sine', .06, i * .05));
const sfxWheel = () => [523, 587, 659, 784, 880, 1047].forEach((f, i) => beep(f, .08, 'square', .05, i * .06));
const sfxLB    = () => [659, 880, 1175, 1568].forEach((f, i) => beep(f, .14, 'triangle', .07, i * .1));
const sfxDaily = () => [523, 659, 784, 880, 1047, 1319].forEach((f, i) => beep(f, .12, 'sine', .06, i * .09));

/* ==================== ДАННЫЕ ==================== */
const THEMES = {
  sakura: { name: '🌸 Сакура', accent: '#ff6b9d', symbols: [
    { e: '🌸', w: 26, pay: 6 }, { e: '🍒', w: 22, pay: 5 }, { e: '🍋', w: 16, pay: 8 },
    { e: '⭐', w: 10, pay: 12 }, { e: '💎', w: 8, pay: 25 }, { e: '💖', w: 4, pay: 50 },
    { e: '🌟', w: 4, wild: 1 }, { e: '🎀', w: 3, scatter: 1 },
    { e: '💀', w: 3, skull: 1 }, { e: '🍀', w: 2, lucky: 1 }]},
  moon: { name: '🌙 Кровавая луна', accent: '#c0392b', symbols: [
    { e: '🍒', w: 22, pay: 5 }, { e: '🌙', w: 18, pay: 9 }, { e: '⭐', w: 14, pay: 14 },
    { e: '🔮', w: 10, pay: 22 }, { e: '💎', w: 8, pay: 32 }, { e: '🩸', w: 4, pay: 55 },
    { e: '🌟', w: 3, wild: 1 }, { e: '🎀', w: 3, scatter: 1 },
    { e: '💀', w: 5, skull: 1 }, { e: '🍀', w: 1, lucky: 1 }]},
  neon: { name: '🎆 Неон', accent: '#00d9ff', symbols: [
    { e: '🎆', w: 24, pay: 6 }, { e: '🎇', w: 20, pay: 6 }, { e: '⚡', w: 16, pay: 10 },
    { e: '💠', w: 10, pay: 18 }, { e: '🔷', w: 8, pay: 28 }, { e: '💖', w: 4, pay: 45 },
    { e: '🌟', w: 8, wild: 1 }, { e: '🎀', w: 4, scatter: 1 },
    { e: '💀', w: 2, skull: 1 }, { e: '🍀', w: 2, lucky: 1 }]},
};

const PHRASES = {
  lose: ["Ха! Я же говорила! Ты проиграл, идиот~ 💅","Не расстраивайся... то есть расстраивайся! Мне весело!",
    "Твои фишки теперь мои. Приятно держать их в руках... хмф!","Проиграл? Какой же ты невнимательный... ладно, держи пятюню на чай.",
    "М-может хватит? Я... не то чтобы переживаю! Просто скучно смотреть!","Опять?! Н-ну ты и неудачник... но я всё ещё здесь. Так и быть.",
    "Пф-ф! И это всё, на что ты способен? Слабак~","Х-хех... я специально тебе поддаюсь! Н-не наглей только!",
    "Ты думал, тебе повезёт? Со мной? Н-наивный!","М-м-м, вкусные фишки... твои, между прочим~"],
  win: ["В-выиграл?! Это... это случайность! Не зазнавайся!","Ладно, ладно, неплохо... для такого идиота.",
    "П-получил свои фишки обратно... я не рада! Совсем не рада!","Только попробуй потратить это не на меня!",
    "Х-хмф! Повезло один раз. Не привыкай!","Н-не думай, что я горжусь тобой! Просто... удача, вот и всё!",
    "О-о... это было неплохо. Я... я чуть не улыбнулась! Не смотри!","П-поздравляю. Т-только не думай, что я рада за тебя! Д-дурак..."],
  jack: ["Д-ДЖЕКПОТ?! Т-ты... ты серьёзно?! Э-это нечестно! Я... я не рада! Н-но... поздравляю, дурак...",
    "💖💗💝 ДЖЕКПОТ! Л-ладно, ты выиграл по-крупному... н-но это ничего не значит! Ничего!"],
  bonus: ["🎀🎀🎀 ФРИСПИНЫ! Н-ну держись... я тебе не поддамся!","Б-бонус?! Х-хорошо, вот тебе спины! Н-но это НЕ значит, что я тебя люблю!"],
  freeWin: ["И-и во фриспинах выиграл?! П-показушник!","Н-ну... во фриспинах удача удваивается! Это нечестно!"],
  gambleWin: ["У-УДВОИЛ?! С-сумасшедший! Я... я чуть не умерла от волнения! Д-дурак!","В-везёт же... н-но не привыкай!"],
  gambleLose: ["П-проиграл! Ха! Т-так тебе и надо! ...н-но мне немного тебя жалко.","В-всё сгорело! Я же говорила — не рискуй! Н-но... не расстраивайся сильно, ладно?"],
  levelUp: ["У-УРОВЕНЬ ВЫШЕ! Н-ну... ты растёшь. Я... я за тебя рада! Н-НЕ ДУМАЙ ЧТО ЭТО ЗНАЧИТ ЧТО-ТО!","Новый уровень! +50 фишек! Н-на, подавись... но ты молодец."],
  nearBust: ["Эй... у тебя почти не осталось фишек. М-может... может хватит?","Т-ты проигрываешь всё! Д-дурак! Я... я не смотрю!"],
  comeback: ["О-о-о! Отбился?! Н-невероятно! Я... я чуть не заплакала! ОТ РАДОСТИ!","В-вернулся в игру! К-какой же ты упрямый... это... это мило. ОЙ."],
  idle: ["Н-ну? Ты собираешься крутить или так и будешь на меня смотреть?","Х-хмф... я не скучаю по тебе. Я просто жду, когда ты нажмёшь кнопку!",
    "Т-ты... э-эй. Не отвлекайся. Крути давай!","М-может... может покажешь, на что способен? Н-не то чтобы мне интересно!"],
  combo: ["Х-хмф! Комбо... н-неплохо для тебя!","О-о, серия пошла! Н-но не зазнавайся!"],
  allin: ["В-ВА-БАНК?! Т-ты сумасшедший! Я... я не смотрю! Н-но... удачи. Н-ЕМУ! Не тебе!","💥 Всё на кон?! Д-дурак!"],
  event: ["О-о?! Что это... событие! Н-ну, посмотрим!","Х-хмф! Событие! Н-не думай, что я рада... но интересно!"],
  questDone: ["К-квест выполнен! Н-на, держи награду... н-не думай, что я рада!","О-о, задание сделал? Н-ну... молодец. Н-немного!"],
  relicBuy: ["К-купил реликвию?! Н-ну... надеюсь, не зря потратил!","Р-реликвия твоя... н-не думай, что я подбирала специально для тебя!"],
  wheel: ["К-колесо! Крути уже, не тяни! Н-не то чтобы мне интересно...","Х-хмф! Колесо фортуны... удача или позор, дурак?"],
  lbSave: ["З-записался в таблицу?! Н-ну... посмотрим, надолго ли тебя хватит!","О-о, рекорд! Н-не зазнавайся, другие тоже играют!"],
  daily: ["Е-ежедневный бонус! Н-на, забирай! Н-не то чтобы я ждала тебя каждый день!","О-о, ты вернулся... вот, бонус. П-просто так! Не благодари!"],
  record: ["Н-НОВЫЙ РЕКОРД?! К-как... ты... я... э-это нечестно! Я... я горжусь. Н-НЕ ГОРЖУСЬ!","Р-рекорд побит! Н-ну ладно, ты... ты молодец. Н-немного."],
};
const phrase = c => { const a = PHRASES[c]; return a[Math.floor(Math.random() * a.length)]; };

const RELICS = [
  { id: 'charm', icon: '🍀', name: 'Талисман удачи', desc: 'Каждые 5 спинов гарантирует пару при проигрыше', price: 250 },
  { id: 'gem', icon: '💎', name: 'Огранщик', desc: 'Выплаты за дорогие символы x1.5', price: 400 },
  { id: 'clock', icon: '⏳', name: 'Часы цундере', desc: '+2 к фриспинам при бонусе', price: 350 },
  { id: 'shield', icon: '🛡️', name: 'Щит', desc: 'Первый проигрыш возвращает ставку', price: 300 },
  { id: 'investor', icon: '📈', name: 'Инвестор', desc: '+10% фишек при старте события', price: 500 },
  { id: 'target', icon: '🎯', name: 'Метитель', desc: 'Wild падает чаще (+50%)', price: 450 },
  { id: 'comboboost', icon: '🔥', name: 'Комбо-усилитель', desc: 'Комбо +0.35 вместо +0.25', price: 600 },
  { id: 'heart', icon: '💖', name: 'Сердце цундере', desc: 'Ва-банк 65% вместо 50%', price: 800 },
];

const QUEST_POOL = [
  { id: 'spins10', text: 'Сделай 10 спинов', target: 10, reward: 150, stat: 'qSpins' },
  { id: 'spins25', text: 'Сделай 25 спинов', target: 25, reward: 400, stat: 'qSpins' },
  { id: 'wins5', text: 'Выиграй 5 раз', target: 5, reward: 250, stat: 'qWins' },
  { id: 'wins10', text: 'Выиграй 10 раз', target: 10, reward: 500, stat: 'qWins' },
  { id: 'combo3', text: 'Поймай комбо x3', target: 3, reward: 300, stat: 'qMaxCombo' },
  { id: 'bonus', text: 'Запусти бонус 🎀', target: 1, reward: 300, stat: 'qBonus' },
  { id: 'jack', text: 'Поймай джекпот', target: 1, reward: 600, stat: 'qJack' },
  { id: 'allin', text: 'Сделай ALL-IN', target: 1, reward: 200, stat: 'qAllin' },
  { id: 'gamblewin', text: 'Выиграй в ва-банке', target: 1, reward: 250, stat: 'qGambleWin' },
  { id: 'wheel', text: 'Крути колесо', target: 1, reward: 200, stat: 'qWheel' },
  { id: 'lucky', text: 'Поймай 🍀', target: 1, reward: 200, stat: 'qLucky' },
];

const EVENTS = [
  { id: 'sakura', name: '🌸 Дождь сакуры', desc: '+15 фишек за спин', spins: 5, color: '#ff6b9d' },
  { id: 'curse', name: '💀 Проклятие', desc: 'Больше 💀, но выигрыши x2', spins: 4, color: '#c0392b' },
  { id: 'luck', name: '🍀 Полоса удачи', desc: 'Гарантированная пара', spins: 3, color: '#2ecc71' },
  { id: 'diamond', name: '💎 Алмазный дождь', desc: '💎 в 3 раза чаще', spins: 5, color: '#00d9ff' },
  { id: 'wild', name: '🌟 Дикий шторм', desc: 'Wild в 3 раза чаще', spins: 4, color: '#9d4edd' },
  { id: 'gold', name: '💰 Золотая лихорадка', desc: 'Все выплаты +25%', spins: 4, color: '#ffd166' },
];

const WHEEL = [
  { prize: '+100 💰', action: () => { S.chips += 100; bump(chipsEl, true); } },
  { prize: '+300 💰', action: () => { S.chips += 300; bump(chipsEl, true); } },
  { prize: '+600 💰', action: () => { S.chips += 600; bump(chipsEl, true); } },
  { prize: '+5 XP', action: () => { addXP(5); } },
  { prize: '1 фриспин', action: () => { S.freeSpins += 1; } },
  { prize: 'Ничего 😢', action: () => {} },
  { prize: 'Случайная реликвия', action: () => {
    const avail = RELICS.filter(r => !S.relics[r.id]);
    if (avail.length) { const r = avail[Math.floor(Math.random() * avail.length)]; S.relics[r.id] = true; toast('🎁 Реликвия!', r.icon + ' ' + r.name, true); }
    else { S.chips += 200; bump(chipsEl, true); toast('🎁 Всё собрано!', '+200 💰'); }
  }},
  { prize: '💥 ДЖЕКПОТ x10 ставки!', action: () => { const w = S.bet * 10; S.chips += w; bump(chipsEl, true); toast('💥 ДЖЕКПОТ!', '+' + w + ' 💰', true); } },
];

const ACHIEVEMENTS = [
  { id: 'first_win', name: 'Первая победа', desc: 'Выиграй в первый раз', check: s => s.wins >= 1, reward: 50 },
  { id: 'streak3', name: 'Три подряд', desc: '3 победы подряд', check: s => s.maxStreak >= 3, reward: 100 },
  { id: 'streak5', name: 'Пять подряд', desc: '5 побед подряд', check: s => s.maxStreak >= 5, reward: 300 },
  { id: 'jack', name: 'Джекпот!', desc: 'Поймай джекпот', check: s => s.jackpots >= 1, reward: 500 },
  { id: 'bonus3', name: 'Бонус-хантер', desc: '3 бонуса', check: s => s.bonusCount >= 3, reward: 200 },
  { id: 'combo3', name: 'Комбо-мастер', desc: 'Комбо x3', check: s => s.maxCombo >= 3, reward: 250 },
  { id: 'combo5', name: 'Комбо-легенда', desc: 'Комбо x5', check: s => s.maxCombo >= 5, reward: 600 },
  { id: 'rich', name: 'Богач', desc: '1000+ фишек', check: s => s.chips >= 1000, reward: 100 },
  { id: 'whale', name: 'Кит', desc: '5000+ фишек', check: s => s.chips >= 5000, reward: 500 },
  { id: 'million', name: 'Миллионер', desc: '10 000+ фишек', check: s => s.chips >= 10000, reward: 2000 },
  { id: 'level5', name: 'Опытный', desc: 'Уровень 5', check: s => s.level >= 5, reward: 200 },
  { id: 'level10', name: 'Ветеран', desc: 'Уровень 10', check: s => s.level >= 10, reward: 500 },
  { id: 'level20', name: 'Грандмастер', desc: 'Уровень 20', check: s => s.level >= 20, reward: 1500 },
  { id: 'spins50', name: 'Полсотни', desc: '50 спинов', check: s => s.totalSpins >= 50, reward: 150 },
  { id: 'spins200', name: 'Двести!', desc: '200 спинов', check: s => s.totalSpins >= 200, reward: 500 },
  { id: 'allin', name: 'Смельчак', desc: 'Сделай ALL-IN', check: s => s.allinCount >= 1, reward: 100 },
  { id: 'allin_win', name: 'Легенда', desc: 'Победи в ALL-IN', check: s => s.allinWins >= 1, reward: 1000 },
  { id: 'collector', name: 'Коллекционер', desc: '3 реликвии', check: s => Object.keys(s.relics).length >= 3, reward: 300 },
  { id: 'fullset', name: 'Полный сет', desc: 'Все 8 реликвий', check: s => Object.keys(s.relics).length >= 8, reward: 3000 },
  { id: 'wheeler', name: 'Крути-верти', desc: 'Колесо 3 раза', check: s => (s.qWheel || 0) >= 3, reward: 300 },
  { id: 'daily5', name: 'Верный игрок', desc: '5 ежедневных бонусов', check: s => (s.dailyCount || 0) >= 5, reward: 500 },
];

/* ==================== СОСТОЯНИЕ ==================== */
const MAX_BET = 1000, MIN_BET = 5;
const SAVE_KEY = 'tsundere_casino_v7_save';
const NAME_KEY = 'tsundere_casino_v7_name';
const DAILY_KEY = 'tsundere_casino_v7_daily';

const S = {
  chips: 500, bet: 25, spinning: false,
  xp: 0, level: 1,
  freeSpins: 0, freeMult: 2,
  pendingWin: 0, gamblesLeft: 3,
  history: [], totalSpins: 0, wins: 0, best: 0,
  streak: 0, lossStreak: 0, maxStreak: 0,
  combo: 0, maxCombo: 0,
  theme: 'sakura',
  jackpots: 0, bonusCount: 0,
  event: null, eventSpins: 0, spinsUntilEvent: 15 + Math.floor(Math.random() * 10),
  achievements: {}, relics: {}, diary: [],
  spinsSinceWheel: 0, wheelActive: false, wheelSpinning: false, wheelRotation: 0,
  quests: [], qSpins: 0, qWins: 0, qMaxCombo: 0, qBonus: 0, qJack: 0, qAllin: 0, qGambleWin: 0, qWheel: 0, qLucky: 0,
  spinsSinceCharm: 0, shieldReady: false,
  autoSpin: false, autoLeft: 0,
  playerName: '', dailyCount: 0,
  allinCount: 0, allinWins: 0,
  lbMode: 'local',
};

/* ==================== DOM ==================== */
const $ = id => document.getElementById(id);
let reels = [0, 1, 2].map(i => $('r' + i));
let msgEl, chipsEl, betEl, winLine, floatWin, coinFlip, gamblePanel, freeBadge;

const say = h => { msgEl.innerHTML = h; };
const theme = () => THEMES[S.theme];
const symbols = () => theme().symbols;
function paymap() { const m = {}; symbols().forEach(s => { if (s.pay) m[s.e] = s.pay; }); return m; }

function pick(forceWild) {
  let list = symbols();
  if (S.event) {
    if (S.event.id === 'curse') list = list.map(s => s.skull ? { ...s, w: s.w * 3 } : s);
    if (S.event.id === 'diamond') list = list.map(s => s.e === '💎' ? { ...s, w: s.w * 3 } : s);
    if (S.event.id === 'wild') list = list.map(s => s.wild ? { ...s, w: s.w * 3 } : s);
  }
  if (S.relics.target) list = list.map(s => s.wild ? { ...s, w: s.w * 1.5 | 0 } : s);
  if (forceWild) { const w = list.find(s => s.wild); if (w) return w.e; }
  const tot = list.reduce((a, x) => a + x.w, 0);
  let r = Math.random() * tot;
  for (const s of list) { if ((r -= s.w) < 0) return s.e; }
  return list[0].e;
}
const setReel = (i, v) => { reels[i].querySelector('.inner').textContent = v; };

function update() {
  chipsEl.textContent = S.chips; betEl.textContent = S.bet;
  $('stSpins').textContent = S.totalSpins; $('stWins').textContent = S.wins;
  $('stBest').textContent = S.best; $('stCombo').textContent = S.maxCombo;
  $('stRate').textContent = S.totalSpins ? Math.round(S.wins / S.totalSpins * 100) + '%' : '0%';
  let st = '';
  if (S.streak >= 2) st = '🔥 Серия: ' + S.streak + '!';
  else if (S.lossStreak >= 4) st = '💔 Не везёт... держись!';
  if (S.combo >= 1) st += '<span id="comboTag">💫 COMBO x' + comboMult().toFixed(2).replace(/\.?0+$/, '') + '</span>';
  $('streak').innerHTML = st;
  $('lvl').textContent = S.level;
  const need = S.level * 10;
  $('xpFill').style.width = Math.min(100, S.xp / need * 100) + '%';
  $('xpTxt').textContent = S.xp + '/' + need;
  if (S.freeSpins > 0) { freeBadge.classList.remove('hidden'); $('fsCount').textContent = S.freeSpins; }
  else freeBadge.classList.add('hidden');
  if (S.event && S.eventSpins > 0) {
    $('eventBanner').classList.add('on');
    $('eventBanner').textContent = S.event.name + ' · ' + S.event.desc + ' · осталось: ' + S.eventSpins;
    $('eventBanner').style.background = 'linear-gradient(135deg,' + S.event.color + ',#9d4edd)';
  } else $('eventBanner').classList.remove('on');
  $('playerNameTag').textContent = S.playerName || '— нажми чтобы ввести —';
  $('autoBtn').classList.toggle('on', S.autoSpin);
  $('autoBtn').textContent = S.autoSpin ? ('🔁 ' + S.autoLeft) : '🔁 АВТО';
  renderHistory(); renderQuests();
}
function renderHistory() {
  const h = $('history'); h.innerHTML = '';
  S.history.slice(-10).forEach(r => {
    const c = document.createElement('div');
    c.className = 'hchip ' + (r.win ? 'win' : 'lose');
    c.textContent = r.icons; h.appendChild(c);
  });
}
function bump(el, up) { el.classList.remove('bump', 'down'); void el.offsetWidth; el.classList.add(up ? 'bump' : 'down'); setTimeout(() => el.classList.remove('bump', 'down'), 400); }
function showFloat(t, color) { floatWin.textContent = t; floatWin.style.color = color || 'var(--gold)'; floatWin.style.textShadow = '0 0 30px ' + (color || 'var(--gold)'); floatWin.classList.remove('show'); void floatWin.offsetWidth; floatWin.classList.add('show'); }
function toast(title, text, gold) { const t = document.createElement('div'); t.className = 'toast' + (gold ? ' gold' : ''); t.innerHTML = '<div class="tt">' + title + '</div>' + text; $('toastBox').appendChild(t); setTimeout(() => t.remove(), 4200); }
function comboMult() { const inc = S.relics.comboboost ? 0.35 : 0.25; return Math.min(1 + (S.combo - 1) * inc, 3.5); }

/* ==================== ДНЕВНИК ==================== */
function diary(text) {
  const d = new Date(), time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  S.diary.unshift({ time, text }); if (S.diary.length > 50) S.diary.length = 50;
  renderDiary();
}
function renderDiary() {
  const l = $('diaryList'); l.innerHTML = '';
  if (!S.diary.length) { l.innerHTML = '<div style="text-align:center;color:#9b7fc4;font-size:12px;padding:14px;">Н-ничего тут нет... пока что.</div>'; return; }
  S.diary.forEach(e => {
    const d = document.createElement('div'); d.className = 'diaryEntry';
    d.innerHTML = '<div class="dDate">' + e.time + '</div>' + e.text;
    l.appendChild(d);
  });
}
const DIARY_NOTES = {
  firstSpin: 'Он сделал первый спин... н-не то чтобы я запоминала!',
  lose: 'Он снова проиграл. М-мне всё равно. Всё равно... наверное.',
  bigWin: 'Он выиграл по-крупному... я... я чуть не улыбнулась. Н-не говори ему!',
  jackpot: '💖 ДЖЕКПОТ. Я... я так рада за него! ОЙ. Это для дневника, тут можно...',
  broke: 'Он проиграл всё... я дала ему 100 фишек. Н-не из жалости! Просто...',
  rich: 'У него больше 5000 фишек. Я... я немного горжусь. Н-НЕМНОГО.',
  bonus: 'Бонусные спины! Х-хех, он так радуется... это мило. ОЙ, ЗАБУДЬ.',
  level10: '10-й уровень! Он... он старается. Я... ну... ладно, он молодец.',
  wheel: 'Он крутил колесо. Я смотрела через плечо. Н-не специально!',
  record: 'Он записал рекорд в таблицу... я... я смотрела, как он вводит имя.',
  daily: 'Он зашёл за бонусом. З-значит, вернётся... н-не то чтобы я ждала!',
};

/* ==================== ДОСТИЖЕНИЯ ==================== */
function checkAchievements() {
  ACHIEVEMENTS.forEach(a => {
    if (!S.achievements[a.id] && a.check(S)) {
      S.achievements[a.id] = true; S.chips += a.reward; bump(chipsEl, true); sfxAch();
      toast('🏆 Достижение!', a.name + ' · +' + a.reward + ' 💰', true);
      diary('🏆 Ачивка: "' + a.name + '". Х-хмф, ну... неплохо для него.');
      update(); saveGame();
    }
  });
}
function renderAchievements() {
  const l = $('achList'); l.innerHTML = '';
  ACHIEVEMENTS.forEach(a => {
    const d = document.createElement('div');
    d.className = 'achItem' + (S.achievements[a.id] ? ' done' : '');
    d.innerHTML = '<div><div class="achName">' + (S.achievements[a.id] ? '✅ ' : '🔒 ') + a.name + '</div><div class="achDesc">' + a.desc + '</div></div><div class="achReward">+' + a.reward + '💰</div>';
    l.appendChild(d);
  });
}

/* ==================== МАГАЗИН ==================== */
function renderShop() {
  const l = $('shopList'); l.innerHTML = '';
  RELICS.forEach(r => {
    const owned = !!S.relics[r.id], afford = S.chips >= r.price;
    const d = document.createElement('div');
    d.className = 'shopItem' + (owned ? ' owned' : '');
    d.innerHTML = '<div class="shopIcon">' + r.icon + '</div><div style="flex:1"><div class="shopName">' + r.name + '</div><div class="shopDesc">' + r.desc + '</div></div>' +
      (owned ? '<button class="shopPrice" disabled>✓</button>' : (afford ? '<button class="shopPrice" data-relic="' + r.id + '">' + r.price + '💰</button>' : '<button class="shopPrice" disabled>' + r.price + '💰</button>'));
    l.appendChild(d);
  });
  l.querySelectorAll('.shopPrice[data-relic]').forEach(b => b.onclick = () => buyRelic(b.dataset.relic));
}
function buyRelic(id) {
  const r = RELICS.find(x => x.id === id);
  if (!r || S.relics[id]) return;
  if (S.chips < r.price) { say('Н-не хватает фишек, дурак! Копи давай.'); return; }
  S.chips -= r.price; S.relics[id] = true; sfxBuy(); bump(chipsEl, false);
  if (r.id === 'shield') S.shieldReady = true;
  toast('🏪 Реликвия!', r.icon + ' ' + r.name, true);
  say('<span class="big">' + r.icon + ' ' + r.name + '</span>' + phrase('relicBuy'));
  diary('🏪 Он купил реликвию "' + r.name + '". Н-надеюсь, не зря потратился...');
  checkAchievements(); renderShop(); update(); saveGame();
}

/* ==================== КВЕСТЫ ==================== */
function newQuests() {
  const pool = [...QUEST_POOL].sort(() => Math.random() - 0.5);
  S.quests = pool.slice(0, 3).map(q => ({ ...q, done: false }));
  S.qSpins = 0; S.qWins = 0; S.qMaxCombo = 0; S.qBonus = 0; S.qJack = 0; S.qAllin = 0;
  S.qGambleWin = 0; S.qWheel = 0; S.qLucky = 0;
  renderQuests();
}
function renderQuests() {
  const l = $('questList'); if (!l) return; l.innerHTML = '';
  S.quests.forEach(q => {
    const val = S[q.stat] || 0, pct = Math.min(100, val / q.target * 100);
    const d = document.createElement('div');
    d.className = 'qItem' + (q.done ? ' done' : '');
    d.innerHTML = '<div style="flex:1">' + (q.done ? '✅ ' : '') + q.text + '</div>' +
      '<div class="qBarWrap"><div class="qBar" style="width:' + pct + '%"></div></div>' +
      '<div style="font-size:9px;color:#9b7fc4;min-width:26px;text-align:right;">' + Math.min(val, q.target) + '/' + q.target + '</div>' +
      '<div class="qReward">+' + q.reward + '💰</div>';
    l.appendChild(d);
  });
}
function tickQuests() {
  S.quests.forEach(q => {
    if (q.done) return;
    if ((S[q.stat] || 0) >= q.target) {
      q.done = true; S.chips += q.reward; bump(chipsEl, true); sfxQuest();
      toast('📜 Квест!', q.text + ' · +' + q.reward + '💰', true);
      setTimeout(() => say('<span class="big">📜 КВЕСТ ВЫПОЛНЕН!</span>' + phrase('questDone')), 300);
      diary('📜 Он выполнил квест "' + q.text + '". Н-ну... ладно, молодец.');
      update(); saveGame();
    }
  });
  renderQuests();
}

/* ==================== СОБЫТИЯ ==================== */
function rollEvent() {
  const e = EVENTS[Math.floor(Math.random() * EVENTS.length)];
  S.event = e; S.eventSpins = e.spins; sfxEvent();
  toast('🌟 СОБЫТИЕ!', e.name + ' · ' + e.desc);
  setTimeout(() => say('<span class="big" style="color:' + e.color + '">' + e.name + '</span>' + e.desc + ' · ' + phrase('event')), 400);
  if (S.relics.investor) { const b = Math.round(S.chips * 0.1); S.chips += b; bump(chipsEl, true); toast('📈 Инвестор', '+' + b + ' 💰'); }
  update();
}
function tickEvent() {
  if (S.event && S.eventSpins > 0) {
    S.eventSpins--;
    if (S.eventSpins <= 0) { toast('⏳ Конец события', ': ' + S.event.name); S.event = null; }
  }
}

/* ==================== ВЫИГРЫШ ==================== */
function evalLine(a, b, c) {
  const scatters = [a, b, c].filter(x => x === '🎀').length;
  const skulls = [a, b, c].filter(x => x === '💀').length;
  const lucky = [a, b, c].filter(x => x === '🍀').length;
  const wilds = [a, b, c].filter(x => x === '🌟').length;
  if (scatters >= 3) return { type: 'bonus', mult: 0, label: '🎀🎀🎀 FREE SPINS!', lucky };
  if (skulls > 0 && wilds < 2) return { type: 'lose', mult: 0, label: '💀 Проигрыш!', lucky };
  const curJACK = symbols().filter(s => s.pay >= 40).map(s => s.e);
  if (curJACK.length >= 2 && [a, b, c].every(x => curJACK.includes(x))) return { type: 'jack', mult: 50, label: '💘 ДЖЕКПОТ!', lucky };
  if (a === b && b === c && curJACK.includes(a)) return { type: 'jack', mult: 50, label: '💘 ДЖЕКПОТ!', lucky };
  const pm = paymap();
  const nonWild = [a, b, c].filter(x => x !== '🌟');
  if (nonWild.length === 0) return { type: 'triple', mult: 50, label: '🌟🌟🌟 ТРОЙНОЙ WILD!', lucky };
  if (nonWild.every(x => x === nonWild[0])) {
    const sym = nonWild[0]; let mult = pm[sym] || 5;
    if (S.relics.gem && mult >= 20) mult = Math.round(mult * 1.5);
    const label = [a, b, c].includes('🌟') ? 'Тройка ' + sym + ' (🌟)!' : 'Тройка ' + sym + '!';
    return { type: 'triple', mult, label, sym, lucky };
  }
  const counts = {};
  [a, b, c].forEach(x => { if (x !== '🌟' && x !== '💀') counts[x] = (counts[x] || 0) + 1; });
  for (const [sym, cnt] of Object.entries(counts)) {
    if (cnt + wilds >= 2) return { type: 'pair', mult: 2, label: 'Пара ' + sym + (wilds ? ' (🌟)' : '') + '!', sym, lucky };
  }
  if (wilds >= 2) return { type: 'pair', mult: 3, label: '🌟 Двойной Wild!', lucky };
  return null;
}

/* ==================== СПИН ==================== */
function spin() {
  if (S.spinning) return;
  if (S.pendingWin > 0) { say('С-сначала разберись с выигрышем! Удвой или забери, дурак~'); stopAuto(); return; }
  if (S.wheelActive) { say('С-сначала колесо крути, дурак!'); stopAuto(); return; }
  if (S.freeSpins <= 0 && S.chips < S.bet) {
    say('У тебя не хватает фишек, дурак! Крути меньше ставку... н-не переживай так!');
    $('table').classList.add('shake'); setTimeout(() => $('table').classList.remove('shake'), 450);
    stopAuto(); return;
  }
  S.spinning = true;
  const isFree = S.freeSpins > 0;
  if (isFree) { S.freeSpins--; } else { S.chips -= S.bet; update(); bump(chipsEl, false); }
  S.totalSpins++; S.qSpins++;
  $('spinBtn').disabled = true;
  winLine.classList.remove('on');
  reels.forEach(r => r.classList.remove('win', 'wild', 'scatter', 'lucky'));

  const target = [pick(), pick(), pick()];
  if (S.relics.charm) {
    S.spinsSinceCharm++;
    if (S.spinsSinceCharm >= 5 && !evalLine(...target)) { target[2] = target[0]; S.spinsSinceCharm = 0; }
  }
  if (S.event && S.event.id === 'luck' && !isFree) { if (!evalLine(...target)) target[2] = target[0]; }
  else if (!isFree && S.lossStreak >= 5 && !evalLine(...target)) { target[2] = target[0]; }

  say(isFree ? '🌟 Фриспин! Д-давай, не подведи...' : 'Крутится... д-держи кулачки, если хочешь...');

  reels.forEach((r, i) => {
    r.classList.add('blur', 'spinning');
    let ticks = 0, max = 14 + i * 8;
    const iv = setInterval(() => {
      setReel(i, pick());
      if (!isFree || i > 0) sfxTick();
      if (++ticks >= max) {
        clearInterval(iv);
        r.classList.remove('blur', 'spinning');
        setReel(i, target[i]);
        if (target[i] === '🌟') r.classList.add('wild');
        if (target[i] === '🎀') r.classList.add('scatter');
        if (target[i] === '🍀') r.classList.add('lucky');
        if (i === 2) setTimeout(() => finish(target, isFree), 380);
      }
    }, 65 + i * 10);
  });
}

function finish(res, isFree) {
  S.spinning = false;
  $('spinBtn').disabled = false;
  const c = evalLine(...res);
  const icons = res.join('');
  tickEvent();
  S.spinsSinceWheel++;
  if (S.totalSpins === 1) diary(DIARY_NOTES.firstSpin);

  if (c && c.type === 'bonus') {
    sfxBonus();
    const extra = S.relics.clock ? 2 : 0;
    S.freeSpins += 8 + extra; S.bonusCount++; S.qBonus++;
    S.history.push({ icons, win: true }); S.combo = 0;
    diary(DIARY_NOTES.bonus);
    say('<span class="big">' + c.label + '</span>Х-хорошо! ' + (8 + extra) + ' фриспинов! ' + phrase('bonus'));
    reels.forEach(r => r.classList.add('win'));
    $('table').classList.add('glow-win'); setTimeout(() => $('table').classList.remove('glow-win'), 2200);
    addXP(3); checkAchievements(); tickQuests(); update(); saveGame();
    setTimeout(() => { if (S.freeSpins > 0 && !S.spinning && S.pendingWin === 0) spin(); }, 1600);
    checkWheel(); return;
  }

  if (c && c.mult > 0) {
    S.combo++; S.maxCombo = Math.max(S.maxCombo, S.combo);
    S.qMaxCombo = Math.max(S.qMaxCombo, S.combo);
    let win = S.bet * c.mult;
    if (isFree) win *= S.freeMult;
    if (S.combo > 1) win = Math.round(win * comboMult());
    if (S.event && S.event.id === 'gold') win = Math.round(win * 1.25);
    if (c.lucky && c.lucky.length > 0) { S.freeSpins += c.lucky.length; S.qLucky++; toast('🍀 Удача!', '+' + c.lucky.length + ' фриспин(ов)!'); }
    S.pendingWin = win; S.gamblesLeft = 3;
    S.wins++; S.qWins++; S.streak++; S.lossStreak = 0;
    S.maxStreak = Math.max(S.maxStreak, S.streak);
    if (win > S.best) S.best = win;
    winLine.classList.add('on');
    reels.forEach(r => r.classList.add('win'));
    $('table').classList.add('glow-win'); setTimeout(() => $('table').classList.remove('glow-win'), 2200);
    S.history.push({ icons, win: true });

    const comboNote = S.combo > 1 ? ' <span style="color:#f39c12">[x' + comboMult().toFixed(2).replace(/\.?0+$/, '') + ']</span>' : '';
    if (c.type === 'jack') {
      S.jackpots++; S.qJack++; sfxJack(); showFloat('+' + win, '#ff6b9d');
      say('<span class="big">' + c.label + '</span>Выигрыш: <b style="color:var(--gold)">+' + win + '</b> 💰' + comboNote + ' — ' + phrase('jack'));
      diary(DIARY_NOTES.jackpot);
    } else {
      sfxWin(); showFloat('+' + win, 'var(--gold)');
      say('<span class="big">' + c.label + '</span>Выигрыш: <b style="color:var(--gold)">+' + win + '</b> 💰' + comboNote + ' — ' + phrase(S.combo >= 2 ? 'combo' : (isFree ? 'freeWin' : 'win')));
      if (win >= 500) diary(DIARY_NOTES.bigWin);
    }
    addXP(2); checkAchievements();
    if (S.chips >= 5000) diary(DIARY_NOTES.rich);
    if (S.level >= 10) diary(DIARY_NOTES.level10);
    update(); saveGame();

    if (isFree) {
      S.chips += S.pendingWin; bump(chipsEl, true); S.pendingWin = 0; update();
      checkAchievements(); tickQuests(); checkWheel(); saveGame();
      if (S.freeSpins > 0) setTimeout(() => { if (!S.spinning) spin(); }, 1600);
      else say(msgEl.innerHTML + '<br><i style="color:#9b7fc4;font-size:12px">Фриспины закончились!</i>');
      return;
    }
    $('gwAmount').textContent = S.pendingWin; $('gambleLeft').textContent = S.gamblesLeft;
    gamblePanel.classList.remove('hidden');
    $('spinBtn').disabled = true; stopAuto();
    update(); return;
  }

  S.lossStreak++; S.streak = 0; S.combo = 0;
  sfxLose(); S.history.push({ icons, win: false });

  if (S.relics.shield && S.shieldReady && !isFree) {
    S.shieldReady = false; S.chips += S.bet; bump(chipsEl, true);
    toast('🛡️ Щит!', 'Ставка возвращена');
    say('<span class="big">🛡️ ЩИТ СРАБОТАЛ!</span>Х-хех, я... я не то чтобы специально тебя спасала! Просто... жалко было!');
    diary('🛡️ Его щит сработал. Я... я не переживала. Просто повезло, вот.');
    update(); checkAchievements();
    if (S.freeSpins > 0 && !S.spinning) setTimeout(() => spin(), 1400);
    checkWheel(); saveGame(); return;
  }

  $('table').classList.add('shake'); setTimeout(() => $('table').classList.remove('shake'), 450);
  let extra = '';
  if (S.chips < 50 && S.chips > 0) extra = '<br><i style="color:#ff9">' + phrase('nearBust') + '</i>';
  say((c ? c.label + '<br>' : '') + phrase('lose') + extra);
  if (S.totalSpins % 10 === 0) diary(DIARY_NOTES.lose);
  addXP(1); checkAchievements(); update(); saveGame();
  if (S.freeSpins > 0 && !S.spinning) setTimeout(() => spin(), 1400);
  if (S.chips === 0 && S.freeSpins === 0) {
    setTimeout(() => {
      S.chips = 100; update(); saveGame();
      say('Ладно... не могу смотреть на твою бедность. Вот 100 фишок. Н-не благодари!');
      diary(DIARY_NOTES.broke);
    }, 1200);
  }
  tickQuests(); checkWheel();
}

/* ==================== ВА-БАНК ==================== */
function gamble() {
  if (S.pendingWin <= 0 || S.gamblesLeft <= 0) return;
  $('gambleBtn').disabled = true; $('collectBtn').disabled = true;
  sfxGamble();
  coinFlip.textContent = '💖'; coinFlip.classList.remove('show'); void coinFlip.offsetWidth; coinFlip.classList.add('show');
  let flips = 0;
  const iv = setInterval(() => { coinFlip.textContent = Math.random() < .5 ? '💖' : '💀'; sfxGamble(); if (++flips >= 14) clearInterval(iv); }, 110);
  setTimeout(() => {
    const winChance = S.relics.heart ? 0.65 : 0.5;
    const win = Math.random() < winChance;
    coinFlip.textContent = win ? '💖' : '💀';
    if (win) {
      S.pendingWin *= 2; S.gamblesLeft--; S.qGambleWin++;
      bump(chipsEl, true); sfxWin();
      say('<span class="big">💖 УДВОИЛ! +' + S.pendingWin + ' 💰</span>' + phrase('gambleWin'));
      $('gwAmount').textContent = S.pendingWin; $('gambleLeft').textContent = S.gamblesLeft;
      $('gambleBtn').disabled = false; $('collectBtn').disabled = false;
      if (S.gamblesLeft <= 0) { say('<span class="big">💖 +' + S.pendingWin + ' 💰</span>Х-хватит риска! Забирай, дурак...'); setTimeout(collect, 900); }
      tickQuests();
    } else {
      say('<span class="big" style="color:var(--red)">💀 ВСЁ СГОРЕЛО!</span>' + phrase('gambleLose'));
      sfxLose(); S.pendingWin = 0;
      diary('💀 Он проиграл в ва-банке всё. Н-ну... я предупреждала. Но мне... немного жаль.');
      setTimeout(() => {
        gamblePanel.classList.add('hidden');
        $('gambleBtn').disabled = false; $('collectBtn').disabled = false;
        $('spinBtn').disabled = false; update(); saveGame();
      }, 1400);
    }
  }, 1600);
}
function collect() {
  if (S.pendingWin <= 0) return;
  S.chips += S.pendingWin; bump(chipsEl, true);
  const w = S.pendingWin; S.pendingWin = 0;
  gamblePanel.classList.add('hidden');
  $('gambleBtn').disabled = false; $('collectBtn').disabled = false;
  $('spinBtn').disabled = false;
  sfxClick(); checkAchievements(); tickQuests(); update(); saveGame();
  say('Забрал <b style="color:var(--gold)">+' + w + '</b> 💰. Н-ну... ладно. Молодец. Н-не думай, что я хвалю!');
  if (S.chips > 500 && S.lossStreak === 0) say(msgEl.innerHTML + '<br><i style="color:#ffb3cd;font-size:12px">' + phrase('comeback') + '</i>');
  checkWheel();
}

/* ==================== АВТОСПИН ==================== */
let autoTimer = null;
function startAuto() {
  if (S.autoSpin) return;
  S.autoSpin = true; S.autoLeft = 10;
  update();
  say('🔁 АВТОСПИН x10. Н-не смотри на меня так, просто кручу!');
  tickAuto();
}
function tickAuto() {
  if (!S.autoSpin) return;
  if (S.autoLeft <= 0) { stopAuto(); return; }
  if (S.spinning || S.pendingWin > 0 || S.wheelActive) { autoTimer = setTimeout(tickAuto, 500); return; }
  if (S.chips < S.bet && S.freeSpins <= 0) { stopAuto(); say('В-всё, фишки кончились! АВТО выключаю...'); return; }
  S.autoLeft--; update();
  spin();
  autoTimer = setTimeout(tickAuto, 1800);
}
function stopAuto() {
  S.autoSpin = false; S.autoLeft = 0;
  if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
  update();
}

/* ==================== КОЛЕСО ==================== */
function checkWheel() {
  if (S.spinsSinceWheel >= 10 && !S.wheelActive && !S.wheelSpinning) {
    S.spinsSinceWheel = 0; S.wheelActive = true; stopAuto();
    say('<span class="big" style="color:#f39c12">🎡 КОЛЕСО ФОРТУНЫ!</span>' + phrase('wheel'));
    sfxEvent(); setTimeout(openWheel, 600);
  }
}
function openWheel() {
  $('wheelPrize').textContent = 'Крути и забери приз, дурак~';
  $('wheelSpinBtn').disabled = false; $('wheelSpinBtn').textContent = 'КРУТИТЬ 🎡';
  $('wheelModal').classList.add('on');
}
function spinWheel() {
  if (S.wheelSpinning) return;
  S.wheelSpinning = true; $('wheelSpinBtn').disabled = true; $('wheelPrize').textContent = '...';
  const idx = Math.floor(Math.random() * WHEEL.length);
  const seg = 45, target = 360 * 5 + idx * seg + seg / 2;
  S.wheelRotation += target;
  $('wheelStage').style.transform = 'rotate(' + S.wheelRotation + 'deg)';
  sfxWheel();
  let t = 0; const iv = setInterval(() => { beep(700, .04, 'square', .03); t++; if (t > 18) clearInterval(iv); }, 180);
  setTimeout(() => {
    clearInterval(iv);
    const w = WHEEL[idx];
    $('wheelPrize').innerHTML = '<span style="font-size:22px">' + w.prize + '</span>';
    w.action(); S.qWheel++; diary(DIARY_NOTES.wheel); update(); checkAchievements(); saveGame();
    setTimeout(() => {
      S.wheelSpinning = false; S.wheelActive = false;
      $('wheelModal').classList.remove('on');
      say('Н-ну... вот и всё. Дальше крути давай!');
    }, 1600);
  }, 4200);
}

/* ==================== ОПЫТ ==================== */
function addXP(n) {
  S.xp += n;
  const need = S.level * 10;
  if (S.xp >= need) {
    S.xp -= need; S.level++; S.chips += 50; bump(chipsEl, true); sfxLevel();
    setTimeout(() => say('<span class="big">🌟 УРОВЕНЬ ' + S.level + '! +50 💰</span>' + phrase('levelUp')), 600);
    checkAchievements();
  }
}

/* ==================== ТАБЛИЦА РЕКОРДОВ ==================== */
async function renderLB() {
  const body = $('lbBody');
  body.innerHTML = '<tr><td colspan="4" class="lbEmpty">З-загружаю...</td></tr>';
  let lb = [];
  try {
    lb = await fetchTop();
  } catch (e) {
    console.warn('LB fetch failed:', e);
    body.innerHTML = '<tr><td colspan="4" class="lbEmpty">Ошибка загрузки 😢</td></tr>';
    return;
  }
  body.innerHTML = '';
  if (!lb.length) {
    body.innerHTML = '<tr><td colspan="4" class="lbEmpty">П-пусто... стань первым, дурак!</td></tr>';
    return;
  }
  lb.forEach((r, i) => {
    const tr = document.createElement('tr');
    const isMe = S.playerName && r.name === S.playerName;
    if (isMe) tr.className = 'me';
    const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
    tr.innerHTML = '<td class="lbRank ' + rankClass + '">' + (medal || ('#' + (i + 1))) + '</td>' +
      '<td class="lbName">' + escapeHtml(r.name || 'Аноним') + '</td>' +
      '<td class="lbLvl">ур.' + (r.level || 1) + '<br>' + (r.spins || 0) + ' сп.</td>' +
      '<td class="lbChips">' + (r.chips || 0).toLocaleString('ru-RU') + '</td>';
    body.appendChild(tr);
  });
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

async function saveLBRecord() {
  const name = $('lbNameInput').value.trim().slice(0, 16);
  if (!name) { toast('⚠️ Имя?', 'Введи имя, дурак!'); return; }
  S.playerName = name;
  localStorage.setItem(NAME_KEY, name);
  $('lbStatus').textContent = 'Отправляю...';
  try {
    const res = await submitScore({ name, chips: S.chips, level: S.level, spins: S.totalSpins, theme: S.theme });
    sfxLB();
    toast('🏅 Записано!', name + ' — ' + S.chips + ' 💰', true);
    say('<span class="big">🏅 РЕКОРД ЗАПИСАН!</span>' + phrase('lbSave') + (res.cloud ? '' : ' <i style="font-size:11px;color:#9b7fc4">(локально)</i>'));
    diary(DIARY_NOTES.record);
    $('lbStatus').textContent = res.cloud ? '✅ Отправлено в облако' : '✅ Сохранено локально';
    await renderLB(); update(); saveGame();
  } catch (e) {
    console.error(e);
    $('lbStatus').textContent = '❌ Ошибка отправки';
    toast('⚠️ Ошибка', 'Не удалось записать рекорд');
  }
}

/* ==================== ЕЖЕДНЕВНЫЙ БОНУС ==================== */
function checkDaily() {
  const today = new Date().toISOString().slice(0, 10);
  const last = localStorage.getItem(DAILY_KEY) || '';
  const badge = $('dailyBadge');
  if (last !== today) { badge.classList.remove('hidden'); badge.onclick = claimDaily; }
  else badge.classList.add('hidden');
}
function claimDaily() {
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem(DAILY_KEY, today);
  const bonus = 200 + Math.floor(S.level * 30);
  S.chips += bonus; S.dailyCount = (S.dailyCount || 0) + 1;
  bump(chipsEl, true); sfxDaily();
  toast('🎁 Ежедневный бонус!', '+' + bonus + ' 💰', true);
  say('<span class="big">🎁 ЕЖЕДНЕВНЫЙ БОНУС!</span>+' + bonus + ' 💰 — ' + phrase('daily'));
  diary(DIARY_NOTES.daily);
  $('dailyBadge').classList.add('hidden');
  checkAchievements(); update(); saveGame();
}

/* ==================== СОХРАНЕНИЕ ==================== */
function saveGame() {
  try {
    const snap = { ...S };
    snap.spinning = false; snap.autoSpin = false; snap.autoLeft = 0;
    snap.wheelSpinning = false; snap.wheelActive = false;
    snap.event = null; snap.eventSpins = 0;
    localStorage.setItem(SAVE_KEY, JSON.stringify(snap));
  } catch {}
}
function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    Object.keys(saved).forEach(k => { if (k in S) S[k] = saved[k]; });
    S.spinning = false; S.autoSpin = false; S.autoLeft = 0;
    S.pendingWin = 0; S.wheelActive = false; S.wheelSpinning = false;
    if (!Array.isArray(S.history)) S.history = [];
    if (!S.quests || !S.quests.length) newQuests();
    return true;
  } catch { return false; }
}

/* ==================== ИНИЦИАЛИЗАЦИЯ ==================== */
export async function initGame() {
  // Кэшировать DOM
  msgEl = $('msg'); chipsEl = $('chips'); betEl = $('bet');
  winLine = $('winLine'); floatWin = $('floatWin'); coinFlip = $('coinFlip');
  gamblePanel = $('gamblePanel'); freeBadge = $('freeBadge');

  // Сердечки
  (function () {
    const b = document.getElementById('hearts');
    const e = ['💖', '💗', '💝', '💕', '🌸', '✨', '🎀'];
    for (let i = 0; i < 16; i++) {
      const h = document.createElement('div'); h.className = 'heart'; h.textContent = e[i % e.length];
      h.style.left = Math.random() * 100 + '%';
      h.style.animationDuration = (7 + Math.random() * 9) + 's';
      h.style.animationDelay = (Math.random() * 12) + 's';
      h.style.fontSize = (12 + Math.random() * 14) + 'px';
      b.appendChild(h);
    }
  })();

  // Leaderboard
  const mode = await initLeaderboard();
  S.lbMode = mode.mode;
  $('lbMode').innerHTML = 'Режим: <b>' + (mode.mode === 'cloud' ? '☁️ Облако (Firebase)' : '💾 Локальный') + '</b>';
  if (mode.mode === 'local') {
    $('lbStatus').textContent = '💡 Настрой Firebase в js/config.js для общей таблицы';
  }

  // Имя
  const savedName = localStorage.getItem(NAME_KEY);
  if (savedName) S.playerName = savedName;

  // Загрузка
  const loaded = loadGame();

  // Тема
  document.querySelectorAll('.themeBtn').forEach(x => x.classList.toggle('active', x.dataset.theme === S.theme));
  document.documentElement.style.setProperty('--pink', theme().accent);
  document.documentElement.style.setProperty('--pink2', theme().accent);

  // Квесты
  if (!S.quests || !S.quests.length) newQuests();

  update();
  await renderLB();
  checkDaily();

  /* ---- СОБЫТИЯ UI ---- */
  $('spinBtn').onclick = () => { sfxClick(); spin(); };
  $('betMinus').onclick = () => { if (!S.spinning && S.pendingWin === 0) { S.bet = Math.max(MIN_BET, S.bet - 5); sfxClick(); } update(); };
  $('betPlus').onclick = () => { if (!S.spinning && S.pendingWin === 0) { S.bet = Math.min(MAX_BET, S.bet + 5); sfxClick(); } update(); };
  $('gambleBtn').onclick = gamble;
  $('collectBtn').onclick = collect;
  $('autoBtn').onclick = () => { if (S.autoSpin) stopAuto(); else startAuto(); };
  $('soundToggle').onclick = () => { soundOn = !soundOn; $('soundToggle').textContent = soundOn ? '🔊' : '🔇'; if (soundOn) sfxClick(); };
  $('achBtn').onclick = () => { renderAchievements(); $('achModal').classList.add('on'); sfxClick(); };
  $('shopBtn').onclick = () => { renderShop(); $('shopModal').classList.add('on'); sfxClick(); };
  $('diaryBtn').onclick = () => { renderDiary(); $('diaryModal').classList.add('on'); sfxClick(); };
  $('wheelSpinBtn').onclick = spinWheel;
  $('lbBtn').onclick = async () => {
    $('lbNameInput').value = S.playerName || '';
    $('lbModal').classList.add('on'); sfxClick();
    await renderLB();
  };
  $('saveBtn').onclick = () => {
    saveGame();
    toast('💾 Сохранено!', 'Твой прогресс в безопасности', true);
    say('С-сохранила! Не то чтобы я переживала... просто на всякий случай!');
  };
  $('playerNameTag').onclick = () => {
    $('nameInput').value = S.playerName || '';
    $('nameModal').classList.add('on');
    setTimeout(() => $('nameInput').focus(), 100);
  };
  $('nameSave').onclick = () => {
    const v = $('nameInput').value.trim().slice(0, 16) || 'Аноним';
    S.playerName = v; localStorage.setItem(NAME_KEY, v);
    $('nameModal').classList.remove('on');
    update(); saveGame(); sfxClick();
    say('О-о, "' + escapeHtml(v) + '"... н-ну, ладно. Н-нормальное имя. Н-не то чтобы мне нравится!');
  };
  $('nameInput').addEventListener('keydown', e => { if (e.key === 'Enter') $('nameSave').click(); });

  $('lbSave').onclick = saveLBRecord;
  $('lbRefresh').onclick = () => { sfxClick(); renderLB(); };
  $('lbClear').onclick = () => {
    if (!confirm('Очистить локальный кэш таблицы? (Облачные данные не тронутся)')) return;
    clearLocalCache(); renderLB(); sfxClick();
    toast('🗑️ Очищено', 'Локальный кэш пуст');
  };

  document.querySelectorAll('[data-close]').forEach(b => {
    b.onclick = () => { $('#' + b.dataset.close).classList.remove('on'); sfxClick(); };
  });
  document.querySelectorAll('.modal').forEach(m => {
    m.onclick = e => { if (e.target === m && m.id !== 'wheelModal') m.classList.remove('on'); };
  });
  $('qRefresh').onclick = () => {
    if (S.chips < 50) { say('50 фишек надо! Н-не наглей, дурак!'); return; }
    S.chips -= 50; bump(chipsEl, false); newQuests(); sfxClick(); update(); saveGame();
    say('Н-новые квесты. Д-дерзай...');
  };

  document.querySelectorAll('.presetBtn[data-bet]').forEach(b => {
    b.onclick = () => { if (S.spinning || S.pendingWin > 0) return; S.bet = Math.min(MAX_BET, parseInt(b.dataset.bet)); sfxClick(); update(); };
  });
  $('allinBtn').onclick = () => {
    if (S.spinning || S.pendingWin > 0) return;
    if (S.chips < MIN_BET) { say('Д-даже ALL-IN не сделаешь, у тебя фишек нет!'); return; }
    S.bet = Math.min(MAX_BET, S.chips); S.allinCount++; S.qAllin++;
    sfxClick(); update(); say(phrase('allin'));
    checkAchievements(); tickQuests();
  };

  document.querySelectorAll('.themeBtn').forEach(b => {
    b.onclick = () => {
      if (S.spinning || S.pendingWin > 0 || S.freeSpins > 0) { say('Н-не сейчас! Доиграй сначала, дурак!'); return; }
      S.theme = b.dataset.theme;
      document.querySelectorAll('.themeBtn').forEach(x => x.classList.toggle('active', x === b));
      const syms = symbols().filter(s => !s.wild && !s.scatter && !s.skull && !s.lucky);
      reels.forEach((r, i) => setReel(i, syms[i % syms.length].e));
      const accent = theme().accent;
      document.documentElement.style.setProperty('--pink', accent);
      document.documentElement.style.setProperty('--pink2', accent);
      sfxClick();
      say('О-о, тема "' + theme().name + '"! Н-неплохо выбрал.');
      update(); saveGame();
    };
  });

  addEventListener('keydown', e => {
    const inModal = document.querySelector('.modal.on');
    if (inModal) return;
    if (e.code === 'Space') { e.preventDefault(); if (S.pendingWin > 0 || S.wheelActive) return; spin(); }
    if (e.code === 'KeyG' && S.pendingWin > 0) gamble();
    if (e.code === 'KeyC' && S.pendingWin > 0) collect();
    if (e.code === 'KeyA') { if (S.autoSpin) stopAuto(); else startAuto(); }
    if (e.code === 'KeyT') {
      const keys = Object.keys(THEMES); const cur = keys.indexOf(S.theme);
      S.theme = keys[(cur + 1) % keys.length];
      document.querySelectorAll('.themeBtn').forEach(x => x.classList.toggle('active', x.dataset.theme === S.theme));
      const accent = theme().accent;
      document.documentElement.style.setProperty('--pink', accent);
      document.documentElement.style.setProperty('--pink2', accent);
      sfxClick(); update(); saveGame();
    }
  });

  /* ---- ТРИГГЕРЫ ---- */
  setInterval(() => {
    if (S.spinning || S.pendingWin > 0) return;
    if (S.spinsUntilEvent <= 0) { S.spinsUntilEvent = 15 + Math.floor(Math.random() * 10); rollEvent(); }
  }, 4000);
  setInterval(() => {
    if (!S.spinning && S.pendingWin === 0 && !S.event) S.spinsUntilEvent--;
  }, 1000);
  setInterval(() => {
    if (S.spinning || S.pendingWin > 0 || S.freeSpins > 0 || S.autoSpin) return;
    if (Math.random() < 0.3) say(phrase('idle'));
  }, 11000);

  /* ---- ПРИВЕТСТВИЕ ---- */
  setTimeout(() => {
    if (loaded) say('О-о, ты вернулся! Прогресс сохранён. Н-не думай, что я рада! ...ну, может, немного.');
    else say('Н-ну что, готов? Только... играй аккуратно, ладно? Н-не то чтобы я переживала!');
    if (!S.playerName) setTimeout(() => {
      say('К-кстати... как тебя звать? Введи имя, чтобы попасть в таблицу рекордов! <b style="color:var(--gold);cursor:pointer;" onclick="document.getElementById(\'nameModal\').classList.add(\'on\')">→ ввести</b>');
    }, 2500);
  }, 500);
}

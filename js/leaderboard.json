/* ============================================================
   МОДУЛЬ ТАБЛИЦЫ РЕКОРДОВ
   Работает в двух режимах:
   - LOCAL  — localStorage
   - CLOUD  — Firebase Firestore (см. config.js)
   ============================================================ */

import { USE_CLOUD, FIREBASE_CONFIG, COLLECTION_NAME, TOP_LIMIT } from './config.js';

const LOCAL_KEY = 'tsundere_casino_lb';

let fb = null;      // firebase refs
let cloudReady = false;

/* ---------- ИНИЦИАЛИЗАЦИЯ ---------- */
export async function initLeaderboard() {
  if (!USE_CLOUD) {
    console.log('[LB] Режим: LOCAL (localStorage)');
    return { mode: 'local' };
  }
  if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) {
    console.warn('[LB] Firebase конфиг пустой. Падаю в LOCAL.');
    return { mode: 'local' };
  }
  try {
    const appMod = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const fsMod  = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    const app = appMod.initializeApp(FIREBASE_CONFIG);
    const db  = fsMod.getFirestore(app);
    fb = { db, fs: fsMod };
    cloudReady = true;
    console.log('[LB] Режим: CLOUD (Firebase)');
    return { mode: 'cloud' };
  } catch (e) {
    console.error('[LB] Firebase упал, откат в LOCAL:', e);
    return { mode: 'local' };
  }
}

/* ---------- ПОЛУЧЕНИЕ ТОП-N ---------- */
export async function fetchTop() {
  if (cloudReady) {
    const { db, fs } = fb;
    const q = fs.query(
      fs.collection(db, COLLECTION_NAME),
      fs.orderBy('chips', 'desc'),
      fs.limit(TOP_LIMIT)
    );
    const snap = await fs.getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  // local
  const lb = readLocal();
  return lb.slice(0, TOP_LIMIT);
}

/* ---------- ОТПРАВКА РЕКОРДА ---------- */
export async function submitScore(rec) {
  const payload = {
    name: String(rec.name || 'Аноним').slice(0, 16),
    chips: Math.max(0, Math.floor(rec.chips || 0)),
    level: Math.max(1, Math.floor(rec.level || 1)),
    spins: Math.max(0, Math.floor(rec.spins || 0)),
    theme: String(rec.theme || 'sakura').slice(0, 16),
  };

  if (cloudReady) {
    const { db, fs } = fb;
    await fs.addDoc(fs.collection(db, COLLECTION_NAME), {
      ...payload,
      timestamp: fs.serverTimestamp()
    });
    return { ok: true, cloud: true };
  }

  // local
  const lb = readLocal();
  lb.push({ ...payload, d: Date.now() });
  lb.sort((a, b) => b.chips - a.chips);
  writeLocal(lb.slice(0, TOP_LIMIT));
  return { ok: true, cloud: false };
}

/* ---------- ОЧИСТКА ЛОКАЛЬНОГО КЭША ---------- */
// В облачном режиме НЕ трогает данные в Firebase (там rules запрещают delete).
export function clearLocalCache() {
  localStorage.removeItem(LOCAL_KEY);
}

export function isCloudMode() {
  return cloudReady;
}

/* ---------- УТИЛИТЫ ---------- */
function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch { return []; }
}
function writeLocal(arr) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(arr)); } catch {}
}

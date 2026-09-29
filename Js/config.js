/* ============================================================
   НАСТРОЙКИ КАЗИНО
   ============================================================
   ВЫБЕРИ РЕЖИМ ТАБЛИЦЫ РЕКОРДОВ:

   1) LOCAL — рекорды хранятся только у каждого в localStorage.
      Ничего настраивать не надо. Значение USE_CLOUD = false.

   2) CLOUD — общая таблица через Firebase Firestore (бесплатно).
      Все игроки видят один рейтинг.
      Смотри README.md — там пошаговая инструкция.

   После заполнения FIREBASE_CONFIG поставь USE_CLOUD = true.
   ============================================================ */

export const USE_CLOUD = false;

export const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Название коллекции в Firestore. Не меняй, если не хочешь запутаться.
export const COLLECTION_NAME = "leaderboard";

// Сколько записей тянуть из облака (топ N).
export const TOP_LIMIT = 10;

// ============================================================
// VESMÍRNÁ EXPEDICE SLOV – logika hry
// Vše se drží jen ve stavu aplikace, nic se neukládá.
// Po obnovení stránky začíná hra od začátku.
// ============================================================

"use strict";

// ---------- stav hry ----------
let stav = novyStav();

function novyStav() {
  const postup = {};
  UROVNE.forEach(u => { postup[u.id] = { hotova: false, hvezdy: 0 }; });
  return {
    postup,
    aktualni: null // stav právě hrané úrovně
  };
}

// ---------- pomocné funkce ----------
const $ = id => document.getElementById(id);

function zamichej(pole) {
  const p = pole.slice();
  for (let i = p.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  return p;
}

function ukazObrazovku(id) {
  document.querySelectorAll(".obrazovka").forEach(o => o.classList.remove("aktivni"));
  $(id).classList.add("aktivni");
  window.scrollTo(0, 0);
}

function celkemHvezd() {
  return Object.values(stav.postup).reduce((s, u) => s + u.hvezdy, 0);
}

function urovnePlanety(planetaId) {
  return UROVNE.filter(u => u.planeta === planetaId);
}

function planetaHotova(planetaId) {
  return urovnePlanety(planetaId).every(u => stav.postup[u.id].hotova);
}

function pocetHotovych(planetaId) {
  return urovnePlanety(planetaId).filter(u => stav.postup[u.id].hotova).length;
}

// Planeta je odemčená, když je na předchozí planetě hotová aspoň jedna úroveň
function planetaOdemcena(planetaId) {
  const poradi = PLANETY.findIndex(p => p.id === planetaId);
  if (poradi <= 0) return true;
  return pocetHotovych(PLANETY[poradi - 1].id) >= 1;
}

// ---------- hvězdné pozadí ----------
function vytvorHvezdy() {
  const kontejner = $("hvezdy-pozadi");
  kontejner.innerHTML = "";
  for (let i = 0; i < 90; i++) {
    const h = document.createElement("div");
    h.className = "hvezdicka";
    const velikost = Math.random() * 2.5 + 1;
    h.style.width = velikost + "px";
    h.style.height = velikost + "px";
    h.style.left = Math.random() * 100 + "%";
    h.style.top = Math.random() * 100 + "%";
    h.style.animationDelay = (Math.random() * 3) + "s";
    kontejner.appendChild(h);
  }
}

// ---------- mapa mise ----------
function vykresliMapu() {
  $("mapa-hvezdy").textContent = "⭐ " + celkemHvezd();
  const kontejner = $("mapa-planety");
  kontejner.innerHTML = "";

  PLANETY.forEach(planeta => {
    const urovne = urovnePlanety(planeta.id);
    const hotovo = pocetHotovych(planeta.id);
    const odemcena = planetaOdemcena(planeta.id);
    const hvezdyPlanety = urovne.reduce((s, u) => s + stav.postup[u.id].hvezdy, 0);

    const karta = document.createElement("div");
    karta.className = "planeta-karta " + planeta.trida + (odemcena ? "" : " zamcena");

    const hlava = document.createElement("div");
    hlava.className = "planeta-hlava";
    hlava.innerHTML =
      '<div class="planeta-koule">' + planeta.emoji + "</div>" +
      "<div><div class='planeta-jmeno'>" + planeta.nazev + "</div>" +
      "<div class='planeta-tema'>" + planeta.tema + "</div></div>" +
      "<div class='planeta-hvezdy'>⭐ " + hvezdyPlanety + " / " + (urovne.length * 3) + "</div>";
    karta.appendChild(hlava);

    // palivoměr
    const palivo = document.createElement("div");
    palivo.className = "palivo";
    const procenta = Math.round((hotovo / urovne.length) * 100);
    palivo.innerHTML =
      "<span>⛽ Palivo</span>" +
      "<div class='palivo-trubice'><div class='palivo-vypln' style='width:" + procenta + "%'></div></div>" +
      "<span>" + procenta + "%</span>";
    karta.appendChild(palivo);

    // tlačítka úrovní
    const mrizka = document.createElement("div");
    mrizka.className = "urovne-mrizka";
    urovne.forEach(u => {
      const p = stav.postup[u.id];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "uroven-btn" + (p.hotova ? " hotova" : "");
      btn.innerHTML =
        "<span class='uroven-ikona'>" + u.ikona + "</span>" +
        "<span>" + u.nazev + "</span>" +
        "<span class='mini-hvezdy'>" + "★".repeat(p.hvezdy) + "☆".repeat(3 - p.hvezdy) + "</span>";
      btn.addEventListener("click", () => spustUroven(u.id));
      mrizka.appendChild(btn);
    });
    karta.appendChild(mrizka);

    // odznak za celou planetu
    if (planetaHotova(planeta.id)) {
      const odznak = document.createElement("div");
      odznak.className = "odznak";
      odznak.textContent = "🏅 " + planeta.odznak;
      karta.appendChild(odznak);
    }

    // informace o zámku
    if (!odemcena) {
      const poradi = PLANETY.findIndex(p => p.id === planeta.id);
      const zamek = document.createElement("div");
      zamek.className = "zamek-info";
      zamek.textContent = "🔒 Odemkne se, až splníš jednu misi na: " + PLANETY[poradi - 1].nazev;
      karta.appendChild(zamek);
    }

    kontejner.appendChild(karta);
  });
}

// ---------- průběh úrovně ----------
function spustUroven(urovenId) {
  const uroven = UROVNE.find(u => u.id === urovenId);
  stav.aktualni = {
    urovenId,
    otazky: zamichej(OTAZKY[urovenId]),
    index: 0,
    pokusy: 0,          // špatné pokusy u aktuální otázky
    chybneOtazky: 0,    // otázky, kde padla aspoň jedna chyba
    zamceno: false      // blokuje klikání během zpětné vazby
  };
  $("uroven-nazev").textContent = uroven.nazev + " · " + PLANETY.find(p => p.id === uroven.planeta).nazev;
  ukazObrazovku("uroven");
  vykresliOtazku();
}

function aktualniOtazka() {
  return stav.aktualni.otazky[stav.aktualni.index];
}

function vykresliOtazku() {
  const a = stav.aktualni;
  const otazka = aktualniOtazka();
  a.pokusy = 0;
  a.zamceno = false;

  $("uroven-postup").textContent = "Otázka " + (a.index + 1) + " z " + a.otazky.length;
  $("postup-vypln").style.width = Math.round((a.index / a.otazky.length) * 100) + "%";
  vykresliPokusy();

  $("otazka-zadani").textContent = otazka.zadani;

  // věta s mezerou (jen u doplňovaček)
  const vetaEl = $("otazka-veta");
  if (otazka.typ === "dopln" && otazka.veta) {
    vetaEl.innerHTML = otazka.veta.replace("_", "<span class='mezera-pismeno' id='mezera'>_</span>");
  } else {
    vetaEl.textContent = "";
  }

  // možnosti (zamíchané, se zapamatovanou správnou)
  const kontejner = $("otazka-moznosti");
  kontejner.innerHTML = "";
  kontejner.className = "otazka-moznosti rezim-" + otazka.typ;

  const indexy = zamichej(otazka.moznosti.map((_, i) => i));
  indexy.forEach((puvodniIndex, poradi) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "moznost-btn";
    if (otazka.typ === "abc" && otazka.moznosti.length > 2) {
      btn.textContent = String.fromCharCode(97 + poradi) + ") " + otazka.moznosti[puvodniIndex];
    } else {
      btn.textContent = otazka.moznosti[puvodniIndex];
    }
    btn.addEventListener("click", () => vyhodnotOdpoved(btn, puvodniIndex));
    kontejner.appendChild(btn);
  });

  schovejZpetnouVazbu();
}

function vykresliPokusy() {
  const zbyva = 3 - stav.aktualni.pokusy;
  $("uroven-pokusy").textContent = "❤️".repeat(zbyva) + "🖤".repeat(3 - zbyva);
}

function vyhodnotOdpoved(btn, zvolenyIndex) {
  const a = stav.aktualni;
  if (a.zamceno) return;
  const otazka = aktualniOtazka();

  if (zvolenyIndex === otazka.spravna) {
    a.zamceno = true;
    btn.classList.add("spravna-volba");
    doplnMezeru(otazka);
    ukazZpetnouVazbu("ok", "✅ Správně! " + otazka.vysvetleni);
    return;
  }

  // špatná odpověď
  a.pokusy++;
  btn.classList.add("spatna-volba");
  vykresliPokusy();

  if (a.pokusy >= 3) {
    // vyčerpané pokusy: ukázat správnou odpověď a vysvětlení
    // (chyba už je započítaná z prvního špatného pokusu)
    a.zamceno = true;
    oznacSpravnou(otazka);
    doplnMezeru(otazka);
    ukazZpetnouVazbu("chyba",
      "Správná odpověď je: „" + otazka.moznosti[otazka.spravna] + "“. " + otazka.vysvetleni);
  } else if (a.pokusy === 1) {
    // první chyba se počítá, žák zkouší dál
    a.chybneOtazky++;
    ukazKratkouHlasku("❌ To není ono. Zkus to ještě jednou!");
  } else {
    // druhá chyba: nápověda
    ukazKratkouHlasku("💡 Nápověda: " + otazka.napoveda);
  }
}

function doplnMezeru(otazka) {
  const mezera = document.getElementById("mezera");
  if (mezera) mezera.textContent = otazka.moznosti[otazka.spravna];
}

function oznacSpravnou(otazka) {
  document.querySelectorAll("#otazka-moznosti .moznost-btn").forEach(b => {
    const text = b.textContent.replace(/^[a-z]\) /, "");
    if (text === otazka.moznosti[otazka.spravna]) b.classList.add("spravna-volba");
  });
}

// plná zpětná vazba s tlačítkem Pokračovat
function ukazZpetnouVazbu(druh, text) {
  const el = $("zpetna-vazba");
  el.className = "zpetna-vazba " + druh;
  $("zv-text").textContent = text;
  $("btn-dalsi").classList.remove("skryto");
}

// krátká hláška bez tlačítka (žák pokračuje ve stejné otázce)
function ukazKratkouHlasku(text) {
  const el = $("zpetna-vazba");
  el.className = "zpetna-vazba napoveda-blok";
  $("zv-text").textContent = text;
  $("btn-dalsi").classList.add("skryto");
}

function schovejZpetnouVazbu() {
  $("zpetna-vazba").className = "zpetna-vazba skryto";
}

function dalsiOtazka() {
  const a = stav.aktualni;
  a.index++;
  if (a.index < a.otazky.length) {
    vykresliOtazku();
  } else {
    dokonciUroven();
  }
}

// ---------- vyhodnocení úrovně ----------
function dokonciUroven() {
  const a = stav.aktualni;
  const chyby = a.chybneOtazky;
  let hvezdy = 1;
  if (chyby === 0) hvezdy = 3;
  else if (chyby <= 2) hvezdy = 2;

  const zaznam = stav.postup[a.urovenId];
  zaznam.hotova = true;
  zaznam.hvezdy = Math.max(zaznam.hvezdy, hvezdy); // lepší výsledek zůstává

  $("vysledek-emoji").textContent = hvezdy === 3 ? "🏆" : hvezdy === 2 ? "🎉" : "💪";
  $("vysledek-titul").textContent = hvezdy === 3 ? "Dokonalý let!" : hvezdy === 2 ? "Mise splněna!" : "Mise dokončena!";
  $("vysledek-hvezdy").innerHTML =
    "<span class='ziskana'>⭐</span>".repeat(hvezdy) +
    "<span class='prazdna'>⭐</span>".repeat(3 - hvezdy);
  $("vysledek-text").textContent =
    chyby === 0
      ? "Všechno správně na první pokus. Jsi hvězda!"
      : "Počet otázek s chybou: " + chyby + ". Úroveň si můžeš kdykoli zopakovat a získat víc hvězd.";

  ukazObrazovku("vysledek");
}

// ---------- vesmírný pas ----------
function vykresliPas() {
  const razitka = $("pas-razitka");
  razitka.innerHTML = "";
  PLANETY.forEach(planeta => {
    const hotova = planetaHotova(planeta.id);
    const div = document.createElement("div");
    div.className = "razitko " + (hotova ? "ziskane" : "neziskane");
    div.innerHTML =
      "<span class='razitko-emoji'>" + planeta.razitko + "</span>" +
      planeta.nazev +
      "<span class='razitko-stav'>" + (hotova ? "✔ SPLNĚNO" : "zatím neprozkoumáno") + "</span>";
    razitka.appendChild(div);
  });

  $("pas-souhrn").textContent = "⭐ Celkem hvězd: " + celkemHvezd() + " z " + (UROVNE.length * 3);

  // přehled úrovní (poslouží i učiteli na konci hodiny)
  const prehled = $("pas-urovne");
  prehled.innerHTML = "";
  PLANETY.forEach(planeta => {
    const h3 = document.createElement("h3");
    h3.textContent = planeta.nazev;
    prehled.appendChild(h3);
    urovnePlanety(planeta.id).forEach(u => {
      const p = stav.postup[u.id];
      const radek = document.createElement("div");
      radek.className = "radek";
      radek.innerHTML = "<span>" + u.nazev + "</span><span>" +
        (p.hotova ? "★".repeat(p.hvezdy) + "☆".repeat(3 - p.hvezdy) : "–") + "</span>";
      prehled.appendChild(radek);
    });
  });
}

// ---------- ovládání ----------
$("btn-start").addEventListener("click", () => { vykresliMapu(); ukazObrazovku("mapa"); });
$("btn-pas").addEventListener("click", () => { vykresliPas(); ukazObrazovku("pas"); });
$("btn-zpet").addEventListener("click", () => { vykresliMapu(); ukazObrazovku("mapa"); });
$("btn-dalsi").addEventListener("click", dalsiOtazka);
$("btn-na-mapu").addEventListener("click", () => { vykresliMapu(); ukazObrazovku("mapa"); });
$("btn-znovu-uroven").addEventListener("click", () => spustUroven(stav.aktualni.urovenId));
$("btn-pas-mapa").addEventListener("click", () => { vykresliMapu(); ukazObrazovku("mapa"); });
$("btn-tisk").addEventListener("click", () => window.print());
$("btn-reset").addEventListener("click", () => {
  stav = novyStav();
  ukazObrazovku("uvod");
});

// ---------- start ----------
vytvorHvezdy();

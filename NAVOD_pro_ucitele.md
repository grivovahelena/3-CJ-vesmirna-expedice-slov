# Vesmírná expedice slov – návod pro učitele

Interaktivní hra na procvičování češtiny pro 3. třídu: vyjmenovaná slova, podstatná jména (rod, číslo, pád) a slovesa (osoba, číslo, čas).

## Jak hru spustit
Dvojklik na soubor **index.html** – otevře se v prohlížeči. Funguje na PC i tabletu, bez internetu, nic se neinstaluje.

Na tabletu: složku hry nahraj např. na sdílený disk nebo web školy a otevři adresu v prohlížeči tabletu. Hra nepotřebuje žádný server, jen otevřít soubor.

## Co je dobré vědět před hodinou
- **Postup se neukládá.** Po zavření nebo obnovení stránky začíná hra od začátku. Jedno hraní je stavěné na jednu vyučovací hodinu.
- Planeta Podstatka se odemkne po splnění jedné mise na Ypsilonce, Stanice Slovesná po jedné misi na Podstatce.
- Žák má na každou otázku 3 pokusy (srdíčka vpravo nahoře). Po druhé chybě dostane nápovědu, po třetí se ukáže správná odpověď s vysvětlením.
- Hvězdy za úroveň: bez chyby 3, s 1–2 chybami 2, jinak 1. Opakováním úrovně si žák může hvězdy vylepšit, horší pokus lepší výsledek nepřepíše.
- **Vesmírný pas** (tlačítko dole na mapě) ukazuje razítka za planety a hvězdy za všechny úrovně – hodí se jako rychlý přehled výsledku na konci hodiny. Jde vytisknout tlačítkem 🖨️.

## Jak upravit nebo přidat otázky
Všechny otázky jsou v souboru **otazky.js** (otevři v Poznámkovém bloku nebo VS Code). Návod je přímo v hlavičce souboru – stačí zkopírovat existující blok otázky a přepsat texty. Do kódu hry (hra.js) není potřeba sahat.

Každá otázka má:
- `typ` – "dopln" (doplň písmeno), "abc" (výběr z možností), "chyt" (klepni na správnou bublinu)
- `moznosti` a `spravna` – pořadí správné možnosti, počítá se od 0
- `napoveda` – zobrazí se po druhé chybě
- `vysvetleni` – zobrazí se vždy po vyřešení otázky

Aktuálně: 16 úrovní, 130 otázek (8–10 na úroveň).

## Kontrola před nasazením
Obsah otázek byl sestaven podle oficiálního seznamu vyjmenovaných slov. Přesto doporučuji před prvním použitím ve třídě projít otázky v otazky.js ještě jednou učitelským okem – zvlášť pokud budeš doplňovat vlastní.

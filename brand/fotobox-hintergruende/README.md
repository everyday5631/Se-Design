# Fotobox-Hintergründe — Entwurf

Stand 26.11.2026. Drei Hintergrundbilder für die **Sonnhalde-Fotobox** (Android-App,
Repository `everyday5631/FotoboxSH`): Die App stellt die Personen auf dem Foto frei und setzt
sie vor eines dieser Bilder (wie ein virtueller Hintergrund bei Teams).

**Herkunft:** Diese Bilder stammen **nicht** aus der Lieferung des Grafikers. Sie wurden für die
Fotobox aus der Bildmarke (`bildschirm/Sonnhalde-bildmarke-gelb-2000px.png`) und den Farben des
Design-Systems erstellt (Verlauf, Bildmarke als Wasserzeichen). Sie sind ein Entwurf und noch
nicht vom Grafiker freigegeben.

| Datei | Verlauf | Bildmarke |
|---|---|---|
| `Sonnhalde-Hintergrund-Creme.jpg` | Cream `#FDF9F6` nach `#EADFD2` | Heading-Gold `#C8962E`, 22 %, rechts oben |
| `Sonnhalde-Hintergrund-Nachtblau.jpg` | `#2F465C` nach `#16222E` (Navy-Töne) | Logo-Gold `#EFBB50`, 16 %, rechts |
| `Sonnhalde-Hintergrund-Sonne.jpg` | `#FFD36B` nach `#F29E0E` (Sonnengelb-Töne) | Weiss, 35 %, links unten |

- **Format:** JPEG, 2000 × 1500 px (4:3), Qualität 85. Die App schneidet bei Bedarf mittig zu
  (z. B. 3:2 für den Druck 10 × 15 cm).
- **Einsatz:** In der App liegen dieselben Dateien unter `app/src/main/assets/backgrounds/`
  (dort mit Namen wie `sonnhalde_creme.jpg`). Ein Austausch dort genügt.
- **Hinweis:** Die Farbverläufe sind nicht Teil der offiziellen Farbdefinitionen
  (`src/tokens-official.css`); massgebend bleiben die Werte im Definitionen-Blatt.

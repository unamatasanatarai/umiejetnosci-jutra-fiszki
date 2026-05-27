# Umiejętności Jutra

> 🚀 Sprawdź aplikację online:  
> ### 👉 [Kliknij tutaj, aby rozpocząć naukę](https://unamatasanatarai.github.io/umiejetnosci-jutra-fiszki/)

Prosta aplikacja do nauki pojęć biznesowych i technologicznych w formie interaktywnych fiszek.  
Całość działa w klimacie terminala tekstowego, dzięki czemu nauka jest szybka, lekka i trochę bardziej „fun” niż kolejna tabela w Notion 😄

Projekt pomaga utrwalać wiedzę z obszarów takich jak:

- AI i prompty
- marketing
- sprzedaż
- biznes i startupy

Zamiast biernego czytania definicji, przechodzisz krótkie sesje fiszek, sprawdzasz swoją wiedzę i od razu widzisz postępy.

---

## ✨ Co potrafi?

### 📚 Kategorie wiedzy
Wybierasz obszar, którego chcesz się uczyć — aplikacja automatycznie ładuje dostępne zestawy fiszek z pliku JSON.

### 🃏 Interaktywne fiszki
Klikasz kartę, obracasz ją i sprawdzasz definicję pojęcia.

### ⌨️ Sterowanie klawiaturą i gestami
Możesz korzystać z aplikacji zarówno myszką, jak i skrótami:

- `Spacja` → pokaż odpowiedź
- `Y` → znałem
- `N` → nie znałem

Na telefonie działa też swipe.

### 📊 Statystyki po sesji
Po zakończeniu nauki dostajesz podsumowanie wyników:

- procent poprawnych odpowiedzi
- liczba poprawnych/błędnych kart
- ocena w gwiazdkach ⭐

### ✅ Bezpieczne dane
Aplikacja sprawdza poprawność struktury `cards.json`, więc błędne dane nie rozwalą całej sesji.

---

## 🛠️ Technologie

Projekt został napisany bez frameworków — czysty frontend:

- Vanilla JavaScript (ES6+)
- HTML5
- CSS3
- JSON

---

## 📁 Struktura projektu

```text
├── app.js        # Logika aplikacji
├── cards.json    # Baza fiszek i definicji
├── index.html    # Widoki i struktura strony
├── styles.css    # Style i responsywność
└── LICENSE       # Licencja MIT
````

---

## 🚀 Jak uruchomić?

Nie potrzebujesz instalować żadnych paczek ani budować projektu.

1. Sklonuj repozytorium
2. Uruchom lokalny serwer HTTP
   (np. Live Server w VS Code)
3. Otwórz projekt w przeglądarce

Przykład dla Pythona:

```bash
python -m http.server
```

---

## 🎮 Jak używać?

1. Otwórz aplikację w przeglądarce
2. Wybierz kategorię nauki
3. Odkrywaj definicje pojęć
4. Oznaczaj odpowiedzi jako poprawne lub błędne
5. Analizuj wyniki i powtarzaj materiał

---

## ⚙️ Dodawanie własnych fiszek

Wszystkie dane znajdują się w pliku `cards.json`.

Przykładowy format:

```json
{
  "AI i Prompty": [
    {
      "entry": "LLM",
      "definition": "Large Language Model — model językowy oparty na uczeniu maszynowym."
    }
  ]
}
```

Możesz łatwo tworzyć własne kategorie i rozbudowywać bazę wiedzy.

---

## 📄 Licencja

Projekt jest dostępny na licencji MIT.
Zobacz pełną treść licencji tutaj: [LICENSE](LICENSE)

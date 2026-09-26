# Setup: Dokumente & E-Mail-Versand

Diese Anleitung richtet die neuen Funktionen ein:
- Dokumente zu einer Forderung hochladen, anzeigen, herunterladen, löschen
- Dokumente/E-Mails aus Vorlagen generieren und direkt versenden

Beide Dienste sind im kostenlosen Tarif ausreichend für den privaten Gebrauch.

## 1. Supabase einrichten (Datenbank + Datei-Speicher)

1. Gehe zu [supabase.com](https://supabase.com) und erstelle einen kostenlosen Account.
2. Klicke auf "New Project".
   - Name: z. B. `debtor-buddy`
   - Region: Frankfurt (eu-central-1)
3. Warte, bis das Projekt erstellt ist (ca. 2 Minuten).

### Datenbank-Tabelle anlegen

1. Im Supabase-Dashboard links auf SQL Editor klicken.
2. New Query klicken.
3. Inhalt der Datei `supabase_schema.sql` einfügen.
4. Auf Run klicken.

### Storage Bucket prüfen

1. Links auf Storage klicken.
2. Es sollte ein Bucket `claim-documents` erscheinen.
3. Falls nicht vorhanden: New Bucket -> Name `claim-documents` -> Public: Aus.

### API-Keys kopieren

1. Project Settings (Zahnrad) -> API.
2. Kopiere Project URL und anon public key.

## 2. EmailJS einrichten (E-Mail-Versand ohne eigenes Backend)

1. Gehe zu [emailjs.com](https://www.emailjs.com), kostenloser Account (200 E-Mails/Monat).
2. Email Services -> Add New Service -> z. B. Gmail verbinden. Notiere die Service ID.
3. Email Templates -> Create New Template mit Variablen to_email, subject, message, az. Notiere die Template ID.
4. Account -> General -> Public Key kopieren.

## 3. Umgebungsvariablen setzen

```bash
cp .env.example .env
```

Trage deine Werte ein (Supabase URL/Key, EmailJS Service/Template/Public Key).

### In GitHub Codespaces / Vercel

- Codespaces: .env Datei direkt im Projekt anlegen.
- Vercel: Unter Project Settings -> Environment Variables eintragen.

## 4. Installation & Start

```bash
npm install
npm run dev
```

## 5. Funktionen nutzen

1. Forderung über "Details"-Button öffnen.
2. Tab "Dokumente": Dateien hochladen, kategorisieren, herunterladen, löschen.
3. Tab "Vorlagen / E-Mail": Vorlage wählen -> Generieren -> Text bearbeiten -> als Datei speichern, direkt senden oder im Mail-Programm öffnen.

## Eigene Vorlagen hinzufügen

Vorlagen liegen in `src/data/templates.json`. Platzhalter: AZ, Name1, V_Name1, Betreff, Forderungsart, Verfahrensstand, Gesamtforderung, Regulierungssumme, Regulierungsrate, Laufzeit, Stand.

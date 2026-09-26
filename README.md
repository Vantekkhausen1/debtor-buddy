# Debtor Buddy - Forderungsverwaltung

Eine moderne Web-App zur Verwaltung von Forderungen und Inkasso-Daten.

## Features

- **Dashboard** mit Übersichten und Statistiken
- **Forderungsliste** mit Sortierung und Filterung
- **Volltextsuche** über alle Forderungen
- **Filter** nach Verfahrensstand, Forderungsart und Status
- **Detailansicht** pro Forderung
- **Statusverwaltung** (offen/erledigt)
- **Responsive Design** für Desktop und Mobile

## Technologie-Stack

- React 18 mit TypeScript
- Vite als Build-Tool
- Tailwind CSS für Styling
- Zustand für State-Management
- TanStack Table für Datentabellen
- Recharts für Diagramme
- Lucide Icons

## Installation

```bash
npm install
npm run dev
npm run build
```

## Deployment

### Vercel (empfohlen)

1. Repository auf GitHub pushen
2. Auf [vercel.com](https://vercel.com) anmelden
3. "New Project" → Repository auswählen
4. Auf "Deploy" klicken

## Datenimport

Die Forderungsdaten werden aus `public/claims_data.json` geladen.

## Lizenz

Privatprojekt

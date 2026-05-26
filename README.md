# BFHL API Round — Bajaj Finserv HackRound Qualifier 1

A full-stack app with a **Netlify Function** backend and **Next.js** frontend for the BFHL API qualifier.

## Live Demo

Deployed on Netlify — see the Netlify dashboard for the live URL.

## Project Structure

```
.
├── netlify/
│   └── functions/
│       └── bfhl.js          # Serverless function (GET + POST)
├── pages/
│   ├── _app.js
│   ├── _document.js
│   └── index.js             # Frontend UI
├── styles/
│   ├── globals.css
│   └── Home.module.css
├── netlify.toml
├── next.config.js
└── package.json
```

## API Endpoints

### GET `/.netlify/functions/bfhl`
Returns:
```json
{ "operation_code": 1 }
```

### POST `/.netlify/functions/bfhl`
Body:
```json
{ "data": ["A", "1", "b", "2", "Z", "d"] }
```
Response:
```json
{
  "is_success": true,
  "user_id": "diya_wadhwa_26052004",
  "email": "diya.wadhwa24@gmail.com",
  "roll_number": "BFHL2024001",
  "numbers": ["1", "2"],
  "alphabets": ["A", "b", "Z", "d"],
  "highest_lowercase_alphabet": ["d"]
}
```

## Local Development

```bash
npm install
npm run dev
```

## Deployment

Deployed via Netlify with the `@netlify/plugin-nextjs` plugin.

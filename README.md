<div align="center">

# Bloom & You

**A self-care gift store: browse, customise and order.**

**[Live site](https://bloom-and-you-app.vercel.app)**

<img src="docs/screenshots/01-home.webp" width="860" alt="Bloom & You home page" />

</div>

## About

Bloom & You is an e-commerce front end for self-care gifts: pyjamas, bath bombs, skincare,
scented candles, face masks and bouquets. Visitors can browse by category, design their own
gift in the customiser, keep a cart, create an account and check out.

## Features

- Category pages for six product lines, each with its own gallery
- **Customiser** for building a personalised gift
- **Cart** shared across pages with React Context, with live item counts in the navigation
- **Accounts:** sign up and log in
- **Checkout** and a **contact form** that post to a REST API
- Client-side routing with React Router, and a soft brand palette throughout
- Laid out for phones from 360px up, with a shared footer and line icons

## Screenshots

| Products | Customise |
| --- | --- |
| <img src="docs/screenshots/02-categories.webp" alt="Product categories" /> | <img src="docs/screenshots/03-customize.webp" alt="Customising a scented candle" /> |
| **Bag** | **Checkout** |
| <img src="docs/screenshots/05-cart.webp" alt="Bag with three items" /> | <img src="docs/screenshots/06-checkout.webp" alt="Checkout with an order summary" /> |
| **Account** | **Footer** |
| <img src="docs/screenshots/04-account.webp" alt="Create account form" /> | <img src="docs/screenshots/07-footer.webp" alt="Site footer with shop and help links" /> |

<p align="center"><img src="docs/screenshots/08-phones.webp" width="860" alt="Home, customiser and footer on a phone" /></p>

## Tech stack

| Layer | Technology |
| --- | --- |
| Front end | React 19, React Router 7, Vite, CSS |
| State | React Context (cart) |
| API | Node.js, Express and MongoDB (accounts, checkout, contact) |
| Hosting | Vercel |

## Project structure

```
bloom-and-you/
├── frontend/
│   ├── src/
│   │   ├── pages/        One component per page (Home, Products, Customize, Cart, Account, Checkout, Contact, categories)
│   │   ├── components/   Navbar
│   │   ├── context/      CartContext
│   │   ├── styles/       Page styles
│   │   ├── assets/       Product images
│   │   └── api.js        Backend address (VITE_API_URL)
│   ├── vercel.json       Routes every URL to the app so deep links work
│   └── package.json
└── docs/screenshots/
```

## Run it locally

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Accounts, checkout and the contact form call the API at `VITE_API_URL`
(default `http://localhost:5000`). Copy `frontend/.env.example` to `frontend/.env` to change it.

## Deploy

On Vercel, import the repository and set **Root Directory** to `frontend` (framework: Vite).
Add `VITE_API_URL` under Environment Variables once the API is hosted.

## Author

**Minahil Nadeem** · [GitHub](https://github.com/minahilnadeem6688) · [LinkedIn](https://www.linkedin.com/in/minahil-nadeem23)

## License

[MIT](LICENSE)

# Google scape

This project is for educational purpose.

## Technology used

### Front-end

-   [Front-end source code](https://github.com/trdat123/google-scrape-fe)
-   Front-end uses [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [Bun](https://bun.sh/): Vite for starting local server. Bun for installing dependencies. Both of them are blazingly fast.
-   UI library: [shadcn/ui](https://ui.shadcn.com/examples/mail) and [Tailwindcss](https://tailwindcss.com/)
-   Authentication: [Auth0](https://auth0.com/)

### Back-end

-   [Bun](https://bun.sh/) as JavaScript run time, managing dependencies, and testing
-   Scraping library: [Puppeteer](https://pptr.dev/). Puppeteer will run Chrome or Chromium based browser in headless mode (Like a normal user). Allow it to do automate task and scraping data in browser easily.
-   Database & ORM: [vercel/postgres](https://vercel.com/docs/storage/vercel-postgres) & [Drizzle](https://orm.drizzle.team/)
-   API layer: [Express](https://expressjs.com/)

---

## Installation

(Use for both front-end and back-end)

-   Install Bun: See [Bun docs](https://bun.sh/)

```
curl -fsSL https://bun.sh/install | bash
```

```
bun i
```

-   Add Env file to root folder. Env file are variables for Vercel database, Drizzle ORM, and Auth0 authentication

`.env.local` is for front-end.
`.env` is for back-end.

Due to sending env file manually. Make sure to add the dot symbol at the start of file name.

-   To run server: `bun dev`
-   To run test: `bun test`

(If there is a problem when run in WSL environment. It might be because of the scrape function needs to be specify executable path)

![logo](./foxiny_logo.png)

# FOXINY MASTER DOC

Revisions:

> 2018-12-03: Ky Pham

{{TOC}}

---

## Vision and Value Proposition

People engaging online purchases are at risk of lacking trustworthy resources to research products and services. Their decision normally come from their own experience or personal preferrals from families and friends. They usually buy stuff at higher prices since there is no majority of vendors offering similar prodcuts in one marketplace, trying to compete to lower prices. Customer services and warannty are vary, exchanging and returning products are hassle.

Foxiny is an online marketplace where buyers and vendors can join as one stop shop for many different products and services. All vendors, products, and services listed on Foxiny will go thru a verification process to make sure everything legit. After listing, quarterly reevaluations are randomly conducted to any vendors and their offerings.

Products listed on Foxiny can be searched/recommended based on personal interest, location, and vendor ranking. Vendors can supply their own prodcut descriptions and testimonies.

Products and services can be purchased by projects users are engaging (building a houses) but they don't have to buy and stock immediately since Foxiny can offer a price locking along with project time line.

Foxiny includes a review system across members and vendors to provide not only trustworthy and honest environment but also reduce negative criticism.

Foxiny offers a reward system which participants can earn points upon their purchases, reviews, and other engagements helping promoting Foxiny. These points can be used toward future discounts/free products.

Foxiny also leverage users who own products/services from Foxiny can offer others trial sessions individually or at our monthly road shows.

Foxiny have mechanism to create campaigns between vendors and manufactures for bulk/group buy purchasing to increase buying power for cheaper prices. Vendors in a campaign can easly transfer ownership to other vendors which are short in stock for a small profit

For highly cost/expensive proudcts, Foxiny allows users setting up PiggyBank account to contribute daily/weekly before they can buy.

---

## Prioritized Feature List

1. Member functions: allow user registration, user login, user profile
2. Vendor functions: allow vendor registration, products/services CRUD
3. TBD

---

## Wireframe Prototype

[UI components](../ui)

---

## Architecture and Deployment Topology

- Docker
- Kubernetes
- Travis: CI/CD

---

## Data Layer

[Data modeling](https://www.draw.io/#G19ZZtMWX6v6OcjEAS8qgbwZ_0qcAcVTz3)

Indexing:

1. unique fields (email)
2. searchable fields (including full text search upon product name/description)

Replication:

- Multiple database replication

Backup:

- snapshots

---

## Service Layer

1. Gateway Service:

- GraphQL: Apollo Server (GraphQL Yoga), Prisma
- Express
- Passport
- Stripe
- Jest, json-server to set up a controlled test environment
- Useful libraries/middlewares:

  - body-parser (using express 4.16.x built in .json() and .urlencoded() instead)
  - cookie-parser
  - compress
  - errorhandler
  - express-session
  - express-simple-cdn
  - morgan: request logging
  - multer: multi-part form data or uploading files in chunks
  - serve-favicon: customize icon for browser
  - timeout: set request timeout
  - express-validator: validate incoming data
  - connect-redis: store session in redis cache
  - connect-timeout
  - vhost
  - express-stormpath
  - joi: Validate HTTP request JSON body properties
  - lodash
  - response-time: Show response time of HTTP requests
  - events (primative): Emit/listen to events
  - stream (primative): Provide readable/writable streams on top of data
  - zlib: Compress/decompress
  - helmet: Mitigrate different types of HTTP security vulnerabilities
  - pm2: Clustering

2. Domain Data Service:

- Prisma
- GraphQL Playground
- Postgres

1. Exposed APIs/events for 3rd parties

- Web socket (npm install websocket)

4. Enhancements

- Use cognative services to recognize description & uploaded photos/videos to generate tags/categories of the products/services
- Recommended system
- Blockchain for reviews, rewards, testimonies, etc.

---

## Web UI Layer

- React: create-react-app, React 16.6 (Context API, contextTypauthoredReview
- Next.js (prototype)
- LinguiJS: Internationalization and localization (Vietnamese)authoredReview
- Styling: Gestalt (Pinterest)
- Use regex to validate data entries: emails, phone numbers (by region), etc.
- Enzyme: Testing React components (jest-enzyme, enzyme-adapter-react-16)

---

## Mobile UI Layer

TBD

---

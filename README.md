# 🛍 Product Management API

[![Coverage](https://img.shields.io/badge/coverage-30%25%2B-brightgreen?style=flat-square)](https://github.com/<USERNAME>/<REPO>/actions)

A scalable **NestJS** backend for managing products, integrating **Contentful CMS**, and providing reporting features like stock alerts and deletion statistics. Perfect for SaaS platforms, e-commerce backends, or internal tools.  

---

## 🚀 Features

- **Products Management**  
  CRUD operations with soft deletes and upsert support from Contentful.  

- **Contentful Integration**  
  Pull products automatically via scheduler from your Contentful CMS.  

- **Reports & Metrics**  
  - Percent of deleted products  
  - Percent of non-deleted products in a price range  
  - Almost out-of-stock products  

- **Validation & Security**  
  - DTO validation with `class-validator`  
  - JWT authentication for private endpoints  
  - Swagger API documentation  

- **Testing**  
  - Unit tests with Jest covering services, controllers, and DTO validation  
  - Mocked database and Contentful for fast tests  

- **Scalable Architecture**  
  - TypeORM for database access  
  - Cron jobs via `@nestjs/schedule`  
  - Logger integrated for observability  

---

## 🛠 Tech Stack

- **Framework:** NestJS  
- **Database:** PostgreSQL (via TypeORM)  
- **CMS:** Contentful  
- **Auth:** JWT  
- **Testing:** Jest & ts-jest  
- **Documentation:** Swagger  
- **Scheduler:** NestJS Cron  

---

## 📦 Installation

```bash
# Clone the repo
git clone <repo-url>
cd <repo-name>

# Install dependencies
npm install

# Run the development server
npm run start:dev
```

---

## ⚡ Environment Variables

Create a .env file with:
```
DATABASE_URL=postgres://user:pass@localhost:5432/db
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_CONTENT_TYPE=product
JWT_SECRET=your_jwt_secret
```

---

## 📦 Docker Compose

You can run the entire application locally using Docker Compose:

```bash
# Build and start all services
docker-compose up --build
```

This will:

- Start the PostgreSQL database
- Start the NestJS API
- Connect the app to the database automatically

---

## 📄 API Documentation

Start the server and visit:

```
http://localhost:3000/api
```
- /auth/jwt → Get a JWT token
- /products → CRUD products
- /reports/percent-deleted → Percent of deleted products
- /reports/percent-non-deleted-with-price → Filtered report
- /reports/almost-out-of-stock → Products low on stock

---

## 🧪 Testing

Run all tests with coverage:

```
npm run test
npm run test:cov
```
Coverage thresholds are enforced at 30% minimum.

---

## 🕹 Scheduler

The scheduler automatically fetches products from Contentful **every hour**:

```ts
@Cron(CronExpression.EVERY_HOUR)
async fetchContentfulProducts()
```

You can also run it manually:
```ts
await schedulerService.fetchContentfulProducts();
```

---

## 📈 License

MIT License © 2025

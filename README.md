# Project-Java-and-Web-Development
Made by Timafei Bielawski 102203482 for the course DLBCSPJWD01 of Internationale Hochschule Bad Honnef 

# React Sneakers Project

# ATTENTION: As of January 2025, React may return a 401 error on the first launch. Simply refresh the page to resolve it!

## Overview
React Sneakers is a project designed with a modern React frontend and a robust backend powered by Node.js, Prisma, and PostgreSQL. This README provides guidance on setting up the project and running it locally.

---

## Prerequisites

Before starting, ensure the following programs are installed on your system:

### Required Software:

| Software      | Download Link                                                                 |
|---------------|-------------------------------------------------------------------------------|
| Node.js       | [Download Node.js](https://nodejs.org/)                                      |
| Yarn          | [Download Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)          |
| Prisma        | [Prisma Documentation](https://www.prisma.io/docs/getting-started)          |
| PostgreSQL    | [Download PostgreSQL](https://www.postgresql.org/download/)                 |
| TablePlus     | [Download TablePlus](https://tableplus.com/)                                 |

### PostgreSQL and TablePlus Configuration:

1. **Install PostgreSQL** with the default settings. Use the password `1111` during setup (important).
2. **Install TablePlus** and configure it as follows:
   - **Name**: Any name
   - **Host**: `localhost`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Database**: `reactSneakers`
   - **Password**: `1111`

---

## Project Setup

Follow these steps to set up and run the project locally:

### Backend Setup

1. Open the `react-sneakers-backend` folder in your terminal.
2. Execute the following commands in sequence:

```bash
npm install
npx prisma migrate dev --name init
npx prisma db push
yarn start
```

### Frontend Setup

1. Open the `react-sneakers` folder in your terminal.
2. Execute the following commands in sequence:

```bash
yarn
yarn remove node-sass
yarn add sass
yarn start
```

---

## Database Configuration

To initialize the demo sneakers database:

1. Open `TablePlus` and navigate to the `products` tab.
2. Import `product.csv` to populate the demo data.
3. View all records stored in the `users` tab for user data.

---

## Notes

- Ensure PostgreSQL is running before starting the backend.
- Use the same database credentials (e.g., password: `1111`) throughout the setup.
- If you encounter issues, double-check the configurations and follow the installation steps carefully.

---


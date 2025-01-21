# Project-Java-and-Web-Development
Project Java and Web Development

# React Sneakers Project

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

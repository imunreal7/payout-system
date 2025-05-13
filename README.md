# Payout System

This project implements a robust payout management system using Node.js (Express), PostgreSQL (Knex), and a cron-based scheduler. It handles:

-   **Advance Payouts**: Automatically pays out 10% of pending sales earnings as advances.
-   **Reconciliation**: Updates sale statuses (approved/declined) and computes final payouts or reversals.
-   **Final Payouts**: Settles remaining balances after reconciliation.

## Features

-   PostgreSQL schema with `users`, `sales`, `advance_payouts`, `final_payouts`, and `payout_transactions` tables.
-   Knex migrations and query models.
-   Services for advance payouts, reconciliation, and final payouts, with idempotency and failure handling.
-   Express routes to create users/sales, trigger payout jobs, reconcile, and fetch balances.
-   Cron jobs to automatically run advance (hourly) and final (hourly, offset) payouts.

## Prerequisites

-   Node.js (>=14)
-   PostgreSQL
-   `pgcrypto` extension enabled for UUID generation

## Setup & Installation

1. **Clone the repo**

    ```bash
    git clone <your-github-url>.git
    cd payout-system
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment**

    - Copy `.env.example` to `.env` and set:

        ```env
        DATABASE_URL=postgres://user:pass@localhost:5432/payout_db
        ```

4. **Enable `pgcrypto`**

    ```sql
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    ```

5. **Run migrations**

    ```bash
    npm run migrate
    ```

## Running the Server

```bash
npm run dev
```

-   Advance payouts run hourly at minute 00.
-   Final payouts run hourly at minute 30.

## API Endpoints

| Method | Path                   | Description                     |
| ------ | ---------------------- | ------------------------------- |
| POST   | `/sales/user`          | Create a new user               |
| POST   | `/sales`               | Create a new sale               |
| GET    | `/sales`               | List pending sales              |
| POST   | `/reconcile`           | Reconcile sales statuses (bulk) |
| POST   | `/payouts/advance/run` | Trigger advance payouts         |
| POST   | `/payouts/final/run`   | Trigger final payouts           |
| GET    | `/users/:id/balance`   | Get user balance                |

---


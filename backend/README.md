# Backend for Independent Site Builder

This project uses [NestJS](https://nestjs.com/) and [Supabase](https://supabase.com/).

## Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Copy `.env.example` to `.env` and fill in your Supabase credentials:
    ```bash
    cp .env.example .env
    ```
    Update `SUPABASE_URL` and `SUPABASE_KEY` in `.env`.

3.  **Run the application:**
    ```bash
    # development
    npm run start

    # watch mode
    npm run start:dev

    # production mode
    npm run start:prod
    ```

## Architecture

-   **SupabaseModule**: Handles connection to Supabase using `@supabase/supabase-js`.
-   **ConfigModule**: Manages environment variables.

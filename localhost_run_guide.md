# Running Algeria Web Studio Locally on Windows (Outside Replit)

Yes, this Replit project can be run perfectly on your local machine (`localhost`)! The codebase is built using standard, modern web technologies: **Node.js, TypeScript, Express 5, Vite, React, and PostgreSQL**. 

However, since the project was optimized specifically for Replit's environment (Linux x64), there are a few important **Windows-specific configurations** you must address to make it work.

Follow this step-by-step guide to run the workspace locally on Windows.

---

## 🛠️ Prerequisites

Before you start, make sure you have the following installed on your Windows machine:

1. **Node.js** (v20 or newer recommended, e.g., v22 or v24). [Download from nodejs.org](https://nodejs.org/).
2. **pnpm** (The workspace package manager):
   - Open PowerShell and install it globally:
     ```powershell
     npm install -g pnpm
     ```
   - *Note: Using standard `npm` or `yarn` will fail because the project's preinstall hook strictly requires `pnpm`.*
3. **PostgreSQL Database**:
   - You need a Postgres database running. You can either:
     - Install PostgreSQL locally on Windows.
     - Or use a free hosted cloud PostgreSQL instance (like [Supabase](https://supabase.com/) or [Neon](https://neon.tech/)).

---

## ⚠️ Critical Windows Setup Step: Update `pnpm-workspace.yaml`

The project contains package overrides that tell `pnpm` to **exclude** Windows binaries in order to speed up Replit (which runs on Linux x64). If you run `pnpm install` on Windows without changing this, **Vite, Tailwind, and esbuild will crash** with missing binary errors when starting up.

### How to fix it:
Open the [pnpm-workspace.yaml](file:///c:/Users/tadje/Downloads/Algeria-Web-Studio/Algeria-Web-Studio/pnpm-workspace.yaml) file in the root of your project, and either:
- **Option A (easiest & recommended):** Delete or comment out the entire `overrides:` block (lines 77 to 157).
- **Option B:** Comment out or delete the entries specifically mentioning `win32`, such as:
  ```yaml
  # Comment out these lines by adding '#' in front of them:
  # "esbuild>@esbuild/win32-x64": "-"
  # "lightningcss>lightningcss-win32-x64-msvc": "-"
  # "@tailwindcss/oxide>@tailwindcss/oxide-win32-x64-msvc": "-"
  # "rollup>@rollup/rollup-win32-x64-msvc": "-"
  ```

---

## ⚙️ Environment Variables Setup

Both the backend and front-end Vite configurations require specific environment variables to run. In Replit, these are injected automatically. Locally, you must define them.

Create a `.env` file in the **root of the project** with the following values:

```env
# 1. Your PostgreSQL connection string
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/algeria_web_studio"

# 2. Port and Environment Configurations
NODE_ENV="development"

# Port for the API server (Backend)
PORT=5000

# Base Path for the frontend application
BASE_PATH="/"
```

---

## 🚀 Running the Project (Step-by-Step)

### 1. Install Dependencies
Open your terminal (PowerShell or Command Prompt) in the root of the project and run:
```powershell
pnpm install
```

### 2. Push the Database Schema
The database uses Drizzle ORM. You need to push the schemas to your PostgreSQL instance to create the required tables:
```powershell
# Set database URL and push the database schema
$env:DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/algeria_web_studio"; pnpm --filter @workspace/db run push
```

### 3. Start the Backend API Server
The server is inside `artifacts/api-server`. To run it locally in development mode, open a PowerShell terminal and run:
```powershell
# Set environment variables and start the server:
$env:PORT="5000"; $env:DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/algeria_web_studio"; pnpm --filter @workspace/api-server run start
```

### 4. Start the Front-end Client (Sitecraft)
Vite will crash if `PORT` and `BASE_PATH` are not defined. Open a second PowerShell terminal in the root directory and start it by running:
```powershell
# Set environment variables and start Sitecraft:
$env:PORT="8080"; $env:BASE_PATH="/"; pnpm --filter @workspace/sitecraft run dev
```
Once started, you can access the frontend in your browser at `http://localhost:8080`.

### 5. (Optional) Start the Mockup Sandbox
If you want to view the mockup sandbox tool, open another PowerShell terminal and run:
```powershell
# Set environment variables and start Mockup Sandbox:
$env:PORT="8081"; $env:BASE_PATH="/"; pnpm --filter @workspace/mockup-sandbox run dev
```
Access the sandbox at `http://localhost:8081`.

---

## 💡 Quick Tips for Windows
- **Set variables globally in your terminal session**: Instead of typing `$env:...` on every command, you can run them once in your open PowerShell terminal so all subsequent commands in that terminal have access to them:
  ```powershell
  $env:PORT="8080"
  $env:BASE_PATH="/"
  $env:DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/algeria_web_studio"
  ```
- **Using dotEnv tools**: If you don't want to set env variables manually in PowerShell, you can install `dotenv-cli` globally (`npm install -g dotenv-cli`) and prefix your commands with `dotenv --`, which will automatically load them from your `.env` file!
  ```powershell
  dotenv -- pnpm --filter @workspace/sitecraft run dev
  ```

# Rental Management System

A rental-property platform with a React/Vite frontend and an ASP.NET Core Web API. Renters can browse and compare homes, save favorites, contact owners, and manage tenancies. Owners can manage listings and inquiries, while administrators manage reports, news, and support tickets.

## Technology

- React 19 and Vite 8
- ASP.NET Core and Entity Framework Core 10
- PostgreSQL for the current API runtime (SQL Server migrations are retained for legacy compatibility)

## Requirements

- Node.js `^20.19.0` or `>=22.12.0` and npm
- .NET 10 SDK
- A PostgreSQL instance for the API runtime
- Git
- .NET EF Core CLI 10.0.12 to apply database migrations

`requirements.txt` lists the toolchain prerequisites. Frontend packages are managed by `rental-management-ui/package.json` and `package-lock.json`; backend packages are managed by `RentalManagement.Api/RentalManagement.Api.csproj`.

## Run locally (Windows PowerShell)

### 1. Configure the database

Configure either `ConnectionStrings:DefaultConnection` (a .NET/Npgsql connection string) or `DATABASE_URL` (a PostgreSQL URL copied from Supabase), plus `Jwt:Key`, through .NET user-secrets or environment variables. The non-secret JWT issuer and audience have local defaults; set the production values in Render. Do not commit database credentials or JWT secrets.

For a first-time local setup, run these commands from the repository root. Set **one** of the database settings using the connection details from Supabase, and use your own random JWT signing key of at least 32 bytes:

```powershell
dotnet user-secrets init --project .\RentalManagement.Api\RentalManagement.Api.csproj
dotnet user-secrets set "DATABASE_URL" "<Supabase PostgreSQL URL>" --project .\RentalManagement.Api\RentalManagement.Api.csproj
dotnet user-secrets set "Jwt:Key" "<your random local JWT signing key>" --project .\RentalManagement.Api\RentalManagement.Api.csproj
```

Alternatively, store the connection details as `ConnectionStrings:DefaultConnection` in Npgsql format (`Host=...;Port=5432;Database=postgres;Username=...;Password=...;SSL Mode=Require`). Do not configure both database settings; `ConnectionStrings:DefaultConnection` takes precedence.

### 2. Restore, migrate, and start the API

From the repository root:

```powershell
dotnet restore .\RentalManagement.Api\RentalManagement.Api.csproj
dotnet tool install --global dotnet-ef --version 10.0.12
dotnet ef database update --project .\RentalManagement.Api\RentalManagement.Api.csproj --startup-project .\RentalManagement.Api\RentalManagement.Api.csproj --context PostgresDbContext
dotnet run --project .\RentalManagement.Api\RentalManagement.Api.csproj --launch-profile http
```

If `dotnet-ef` is already installed, skip the tool-install command. The API listens at `http://localhost:5123`; Swagger is available at `http://localhost:5123/swagger` in Development.

### 3. Start the frontend

In a second terminal:

```powershell
Set-Location .\rental-management-ui
npm ci
npm run dev
```

Set `VITE_API_URL=http://localhost:5123/api` in `rental-management-ui/.env.development` before starting Vite. Use `.env.development.example` as the local template; use `.env.production.example` as a reference for the deployed API URL. Real `.env.*` files are ignored by Git. Open the Vite URL printed in the terminal (normally `http://localhost:5173`) and keep both the API and frontend running. Restart Vite after changing environment values.

## Checks

```powershell
Set-Location .\rental-management-ui
npm run lint
npm run build
```

```powershell
dotnet build .\RentalManagement.Api\RentalManagement.Api.csproj
```

## Deployment notes

The frontend reads its API base URL from `VITE_API_URL`. For a Render Static Site, set this at build time to `https://myhome-backend1.onrender.com/api` (or your API URL). The API allows localhost origins and `https://myhome-d67z.onrender.com` by default; configure `Cors__AllowedOrigins` on the API service to the exact frontend origin if it differs (comma-separated if there is more than one). Do not include an API path or trailing slash in the CORS origins.

The API runtime uses PostgreSQL, but the original EF Core migrations are SQL Server-specific. The SQL Server EF provider remains temporarily so those migrations compile. **Do not apply the original SQL Server migrations to PostgreSQL.** The app also stores uploaded agreements and support attachments under the API's `App_Data` directory.

Before deploying:

1. Set `VITE_API_URL` in the frontend host's build environment, then redeploy the static site after changing it.
2. Set `Cors__AllowedOrigins` on the API service to the exact deployed frontend origin.
3. Set either `ConnectionStrings__DefaultConnection` to an Npgsql connection string or `DATABASE_URL` to the Supabase PostgreSQL URL. Convert the existing SQL Server EF migrations and plan any required SQL Server data migration before applying database changes.
4. Configure strong production JWT values using environment variables (`Jwt__Key`, `Jwt__Issuer`, and `Jwt__Audience`).
5. Store uploaded files on persistent storage or an object-storage service; container-local files can be lost when an instance is replaced.

ASP.NET Core does not load `.env` files by default. Keep database and JWT secrets in .NET user-secrets for local development and in the API host's environment settings for deployment; never commit them.

Once configured, deploy the frontend as a Render **Static Site** with root directory `rental-management-ui`, build command `npm ci && npm run build`, and publish directory `dist`. Add a rewrite from `/*` to `/index.html` for React Router routes. Deploy the API as a Render **Web Service** using Docker, with root directory `RentalManagement.Api` and Dockerfile path `Dockerfile`. The API Dockerfile binds to Render's `PORT` (defaulting to `10000`). Swagger is enabled in Development; to temporarily expose `/swagger` on Render for testing, set `Swagger__Enabled` to `true` in the API service's environment, then remove or set it to `false` afterward. See Render's [Static Sites](https://render.com/docs/static-sites) and [Docker](https://render.com/docs/docker) guides.

Email verification is currently a development flow: the API returns the verification code to the frontend instead of sending email. Add a real email provider before using registration in production.

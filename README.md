# Rental Management System

A rental-property platform with a React/Vite frontend and an ASP.NET Core Web API. Renters can browse and compare homes, save favorites, contact owners, and manage tenancies. Owners can manage listings and inquiries, while administrators manage reports, news, and support tickets.

## Technology

- React 19 and Vite 8
- ASP.NET Core and Entity Framework Core 10
- Microsoft SQL Server

## Requirements

- Node.js `^20.19.0` or `>=22.12.0` and npm
- .NET 10 SDK
- A running SQL Server instance
- Git
- .NET EF Core CLI 10.0.12 to apply database migrations

`requirements.txt` lists the toolchain prerequisites. Frontend packages are managed by `rental-management-ui/package.json` and `package-lock.json`; backend packages are managed by `RentalManagement.Api/RentalManagement.Api.csproj`.

## Run locally (Windows PowerShell)

### 1. Configure the database

Start SQL Server and set `ConnectionStrings:DefaultConnection` in `RentalManagement.Api/appsettings.json` to a connection string that works on your machine. The checked-in default uses Windows integrated authentication and expects a local SQL Server instance.

### 2. Restore, migrate, and start the API

From the repository root:

```powershell
dotnet restore .\RentalManagement.Api\RentalManagement.Api.csproj
dotnet tool install --global dotnet-ef --version 10.0.12
dotnet ef database update --project .\RentalManagement.Api\RentalManagement.Api.csproj --startup-project .\RentalManagement.Api\RentalManagement.Api.csproj
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

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). Keep the API and frontend running together.

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

The current app is configured for local development: frontend API calls use `http://localhost:5123`, and API CORS allows localhost origins only. It also uses SQL Server and stores uploaded agreements and support attachments under the API's `App_Data` directory. **It is not ready to deploy to Render without production configuration.**

Before deploying:

1. Configure the frontend API base URL from a Vite environment variable and update every API/image URL to use it.
2. Configure API CORS to allow the deployed frontend origin.
3. Provide a reachable SQL Server connection string. Render PostgreSQL is not a drop-in replacement for this SQL Server/EF Core setup; migrating providers requires code and database changes.
4. Configure strong production JWT values using environment variables (`Jwt__Key`, `Jwt__Issuer`, and `Jwt__Audience`). Do not use the development JWT key from `appsettings.json`.
5. Store uploaded files on persistent storage or an object-storage service; container-local files can be lost when an instance is replaced.

Once configured, deploy the frontend as a Render **Static Site** with root directory `rental-management-ui`, build command `npm ci && npm run build`, and publish directory `dist`. Add a rewrite from `/*` to `/index.html` for React Router routes. Deploy the API as a Render **Web Service** using Docker, with root directory `RentalManagement.Api` and Dockerfile path `Dockerfile`. The API Dockerfile binds to Render's `PORT` (defaulting to `10000`). See Render's [Static Sites](https://render.com/docs/static-sites) and [Docker](https://render.com/docs/docker) guides.

Email verification is currently a development flow: the API returns the verification code to the frontend instead of sending email. Add a real email provider before using registration in production.

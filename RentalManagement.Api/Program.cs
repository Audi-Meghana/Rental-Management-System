using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using RentalManagement.Api.Data;
using RentalManagement.Api.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =====================================================
// CONTROLLERS
// =====================================================

builder.Services.AddControllers();


// =====================================================
// DATABASE
// =====================================================

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var databaseUrl = builder.Configuration["DATABASE_URL"];

if (string.IsNullOrWhiteSpace(connectionString) &&
    !string.IsNullOrWhiteSpace(databaseUrl))
{
    if (!Uri.TryCreate(databaseUrl, UriKind.Absolute, out var databaseUri) ||
        (databaseUri.Scheme != "postgres" && databaseUri.Scheme != "postgresql"))
    {
        throw new InvalidOperationException(
            "DATABASE_URL must be a valid PostgreSQL connection URL.");
    }

    var credentialSeparator = databaseUri.UserInfo.IndexOf(':');
    if (credentialSeparator <= 0 ||
        credentialSeparator == databaseUri.UserInfo.Length - 1)
    {
        throw new InvalidOperationException(
            "DATABASE_URL must include a PostgreSQL username and password.");
    }

    connectionString = new NpgsqlConnectionStringBuilder
    {
        Host = databaseUri.Host,
        Port = databaseUri.IsDefaultPort ? 5432 : databaseUri.Port,
        Database = Uri.UnescapeDataString(databaseUri.AbsolutePath.TrimStart('/')),
        Username = Uri.UnescapeDataString(databaseUri.UserInfo[..credentialSeparator]),
        Password = Uri.UnescapeDataString(databaseUri.UserInfo[(credentialSeparator + 1)..]),
        SslMode = SslMode.Require
    }.ConnectionString;
}

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Database connection is missing. Configure ConnectionStrings:DefaultConnection or a Supabase PostgreSQL DATABASE_URL.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddDbContext<PostgresDbContext>(options =>
    options.UseNpgsql(connectionString));

// =====================================================
// SERVICES
// =====================================================

builder.Services.AddScoped<IPropertyService, PropertyService>();

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IVerificationService, VerificationService>();


// =====================================================
// CORS
// =====================================================

var configuredOrigins = builder.Configuration["Cors:AllowedOrigins"];
var allowedOrigins = new[]
    {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://myhome-d67z.onrender.com"
    }
    .Concat(string.IsNullOrWhiteSpace(configuredOrigins)
        ? Array.Empty<string>()
        : configuredOrigins.Split(
            ',',
            StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
    .Select(origin => origin.TrimEnd('/'))
    .Distinct(StringComparer.OrdinalIgnoreCase)
    .ToArray();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
    });
});


// =====================================================
// JWT
// =====================================================

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "JWT key is missing."
    );

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException(
        "JWT issuer is missing."
    );

var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException(
        "JWT audience is missing."
    );

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    ),

                ValidateIssuer = true,
                ValidIssuer = jwtIssuer,

                ValidateAudience = true,
                ValidAudience = jwtAudience,

                ValidateLifetime = true,

                ClockSkew = TimeSpan.Zero
            };
    });

builder.Services.AddAuthorization();


// =====================================================
// SWAGGER
// =====================================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();


// =====================================================
// BUILD APPLICATION
// =====================================================

var app = builder.Build();


// =====================================================
// SWAGGER
// =====================================================

if (app.Environment.IsDevelopment() ||
    app.Configuration.GetValue<bool>("Swagger:Enabled"))
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// =====================================================
// CORS
// IMPORTANT: BEFORE AUTHENTICATION
// =====================================================

app.UseCors("ReactApp");

app.UseStaticFiles();


// =====================================================
// AUTHENTICATION
// =====================================================

app.UseAuthentication();

app.UseAuthorization();


// =====================================================
// CONTROLLERS
// =====================================================

app.MapControllers();


// =====================================================
// RUN
// =====================================================

app.Run();
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["RentalManagement.Api.csproj", "./"]
RUN dotnet restore "./RentalManagement.Api.csproj"

COPY . .
RUN dotnet publish "./RentalManagement.Api.csproj" \
    --configuration Release \
    --output /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 10000
ENTRYPOINT ["sh", "-c", "dotnet RentalManagement.Api.dll --urls http://0.0.0.0:${PORT:-10000}"]

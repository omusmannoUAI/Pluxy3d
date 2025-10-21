# Script para crear Resource Group, App Service Plan y Web App (Windows .NET 9)
# Uso: powershell.exe -ExecutionPolicy Bypass -File .\scripts\create-appservice.ps1 -subscriptionId <SUB_ID> -location <LOCATION> -resourceGroup <RG_NAME> -appServiceName <APP_NAME>

param(
    [Parameter(Mandatory=$true)]
    [string]$subscriptionId,

    [Parameter(Mandatory=$true)]
    [string]$location,

    [Parameter(Mandatory=$true)]
    [string]$resourceGroup,

    [Parameter(Mandatory=$true)]
    [string]$appServiceName
)

# Recomendado: iniciar sesion previamente con `az login`
Write-Host "Usando suscripción: $subscriptionId" -ForegroundColor Cyan
az account set --subscription $subscriptionId

# Crear resource group si no existe
if (-not (az group exists -n $resourceGroup)) {
    Write-Host "Creando resource group $resourceGroup en $location" -ForegroundColor Green
    az group create -n $resourceGroup -l $location | Out-Null
} else {
    Write-Host "Resource group $resourceGroup ya existe" -ForegroundColor Yellow
}

# Crear App Service Plan (Windows, S1 - Standard)
$planName = "$appServiceName-Plan"
if (-not (az appservice plan show -g $resourceGroup -n $planName --query name -o tsv 2>$null)) {
    Write-Host "Creando App Service Plan $planName (Windows, S1)" -ForegroundColor Green
    az appservice plan create -g $resourceGroup -n $planName --is-linux false --sku S1 | Out-Null
} else {
    Write-Host "App Service Plan $planName ya existe" -ForegroundColor Yellow
}

# Crear Web App (Windows) usando runtime .NET 9
if (-not (az webapp show -g $resourceGroup -n $appServiceName --query name -o tsv 2>$null)) {
    Write-Host "Creando Web App $appServiceName (.NET 9, Windows)" -ForegroundColor Green
    az webapp create -g $resourceGroup -n $appServiceName --plan $planName --runtime "DOTNETCORE|9.0" | Out-Null
} else {
    Write-Host "Web App $appServiceName ya existe" -ForegroundColor Yellow
}

# Obtener publish profile (XML) - guardarlo localmente
$publishProfile = az webapp deployment list-publishing-profiles -n $appServiceName -g $resourceGroup --query "[?contains(publishMethod,'MSDeploy')].{profile:publishUrl,user:userName,password:publishPassword}" -o json
$publishXml = az webapp deployment list-publishing-profiles -n $appServiceName -g $resourceGroup -o yaml
$publishFile = "$env:TEMP\$appServiceName-publishprofile.xml"
az webapp deployment list-publishing-profiles -n $appServiceName -g $resourceGroup -o xml > $publishFile

Write-Host "Publish profile saved to: $publishFile" -ForegroundColor Green
Write-Host "Para desplegar manualmente desde tu máquina puedes usar: az webapp deploy --resource-group $resourceGroup --name $appServiceName --src-path <path-to-zip-or-folder>" -ForegroundColor Cyan
Write-Host "O configurar la variable secreta AZURE_WEBAPP_PUBLISH_PROFILE en GitHub con el contenido de $publishFile para CI/CD" -ForegroundColor Cyan

# Recomendaciones post-creación
Write-Host "Recomendaciones:" -ForegroundColor Magenta
Write-Host " - Configurar cadena de conexión en Portal > Configuration > Connection strings si usarás Azure SQL (recomendado)." -ForegroundColor Magenta
Write-Host " - Revisar Application settings: ApplyMigrationsOnStartup = true (ya definido en appsettings.json)." -ForegroundColor Magenta
Write-Host " - Habilitar Logging > App Service logs para ver stdout/stderr y archivos de log." -ForegroundColor Magenta

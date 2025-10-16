# ----------------------------
# Configuración de entorno
# ----------------------------
$ErrorActionPreference = "Stop"

Write-Host "Detectando IP local de la máquina..."
try {
   $env:LOCAL_IP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.InterfaceAlias -notmatch "vEthernet" -and $_.IPAddress -notlike "169.*" -and $_.IPAddress -notlike "127.*"
    } | Select-Object -First 1).IPAddress

    Write-Host "IP detectada: $env:LOCAL_IP"

} catch {
    Write-Host "Error detectando IP local: $_"
    docker-compose down --remove-orphans
    exit 1
}

# ----------------------------
# Limpiar contenedores previos
# ----------------------------
Write-Host "Deteniendo y eliminando contenedores previos (si los hay)..."
docker-compose down --remove-orphans

# ----------------------------
# Levantar Docker Compose
# ----------------------------
Write-Host "Levantando backend, frontend y MongoDB..."
try {
    docker-compose up --build
} catch {
    Write-Host "Error al levantar Docker Compose: $_"
    Write-Host "Deteniendo todos los contenedores..."
    docker-compose down --remove-orphans
    exit 1
}
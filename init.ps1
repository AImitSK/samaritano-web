# ============================================
# SK Online Marketing - Projekt Setup Script
# ============================================
# Nach dem Klonen des Templates ausfuehren:
#   .\init.ps1
#   .\init.ps1 -ProjectName "mein-projekt"
#   .\init.ps1 -SkipInstall -SkipGitReinit
# ============================================

param(
    [string]$ProjectName,
    [switch]$SkipGitReinit,
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"

# Farben fuer Output
function Write-Step { param($msg) Write-Host "`n>> $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "   [OK] $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "   [!] $msg" -ForegroundColor Yellow }
function Write-Info { param($msg) Write-Host "   $msg" -ForegroundColor Gray }

# Header
Write-Host ""
Write-Host "============================================" -ForegroundColor Magenta
Write-Host " SK Online Marketing - Projekt Setup" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta

# Projektname abfragen falls nicht uebergeben
if (-not $ProjectName) {
    Write-Host ""
    $ProjectName = Read-Host "Projektname (z.B. kunde-website)"
    if (-not $ProjectName) {
        Write-Warn "Kein Projektname angegeben, verwende 'neue-website'"
        $ProjectName = "neue-website"
    }
}

# Projektname bereinigen (lowercase, keine Leerzeichen/Sonderzeichen)
$ProjectNameClean = $ProjectName.ToLower() -replace '\s+', '-' -replace '[^a-z0-9-]', ''
Write-Info "Projektname: $ProjectNameClean"

# ============================================
# 1. Package.json aktualisieren
# ============================================
Write-Step "Aktualisiere package.json..."

$packageJsonPath = ".\package.json"
if (Test-Path $packageJsonPath) {
    try {
        $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
        $packageJson.name = $ProjectNameClean
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath -Encoding UTF8
        Write-Success "package.json aktualisiert (name: $ProjectNameClean)"
    } catch {
        Write-Warn "Fehler beim Aktualisieren von package.json: $_"
    }
} else {
    Write-Warn "package.json nicht gefunden!"
}

# ============================================
# 2. .env.local erstellen
# ============================================
Write-Step "Erstelle .env.local..."

$envExamplePath = ".\.env.example"
$envLocalPath = ".\.env.local"

if (Test-Path $envLocalPath) {
    Write-Warn ".env.local existiert bereits, ueberspringe..."
} elseif (Test-Path $envExamplePath) {
    Copy-Item $envExamplePath $envLocalPath
    Write-Success ".env.local erstellt aus .env.example"
    Write-Info "Bitte .env.local mit echten Werten fuellen!"
} else {
    Write-Warn ".env.example nicht gefunden!"
}

# ============================================
# 3. CLAUDE.md aktualisieren
# ============================================
Write-Step "Aktualisiere CLAUDE.md..."

$claudeMdPath = ".\CLAUDE.md"
if (Test-Path $claudeMdPath) {
    try {
        $content = Get-Content $claudeMdPath -Raw -Encoding UTF8
        $content = $content -replace '\[KUNDENNAME\]', $ProjectNameClean
        Set-Content $claudeMdPath $content -Encoding UTF8 -NoNewline
        Write-Success "CLAUDE.md aktualisiert"
    } catch {
        Write-Warn "Fehler beim Aktualisieren von CLAUDE.md: $_"
    }
} else {
    Write-Warn "CLAUDE.md nicht gefunden!"
}

# ============================================
# 4. humans.txt aktualisieren
# ============================================
Write-Step "Aktualisiere humans.txt..."

$humansTxtPath = ".\public\humans.txt"
if (Test-Path $humansTxtPath) {
    try {
        $content = Get-Content $humansTxtPath -Raw -Encoding UTF8
        $today = Get-Date -Format "yyyy-MM-dd"
        $content = $content -replace '\[DATUM\]', $today
        Set-Content $humansTxtPath $content -Encoding UTF8 -NoNewline
        Write-Success "humans.txt aktualisiert (Datum: $today)"
    } catch {
        Write-Warn "Fehler beim Aktualisieren von humans.txt: $_"
    }
} else {
    Write-Warn "humans.txt nicht gefunden!"
}

# ============================================
# 5. Git neu initialisieren (optional)
# ============================================
if (-not $SkipGitReinit) {
    Write-Step "Git Repository..."

    $response = Read-Host "Git-Historie loeschen und neu starten? (j/N)"
    if ($response -eq "j" -or $response -eq "J") {
        try {
            if (Test-Path ".\.git") {
                Remove-Item -Recurse -Force ".\.git"
                Write-Info "Alte Git-Historie geloescht"
            }
            git init | Out-Null
            git add .
            git commit -m "Initial commit: $ProjectNameClean" | Out-Null
            Write-Success "Neues Git Repository initialisiert"
        } catch {
            Write-Warn "Git-Fehler: $_"
        }
    } else {
        Write-Info "Git-Historie beibehalten"
    }
} else {
    Write-Info "Git-Reinitialisierung uebersprungen (--SkipGitReinit)"
}

# ============================================
# 6. Dependencies installieren
# ============================================
if (-not $SkipInstall) {
    Write-Step "Installiere Dependencies (npm install)..."
    Write-Info "Das kann einen Moment dauern..."

    npm install 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dependencies installiert"
    } else {
        Write-Warn "npm install hatte Probleme - bitte manuell pruefen"
    }
} else {
    Write-Info "Installation uebersprungen (--SkipInstall)"
}

# ============================================
# Zusammenfassung
# ============================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host " Setup abgeschlossen!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Naechste Schritte:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. .env.local oeffnen und API Keys eintragen:" -ForegroundColor White
Write-Host "     - NEXT_PUBLIC_SANITY_PROJECT_ID" -ForegroundColor Gray
Write-Host "     - SANITY_API_TOKEN" -ForegroundColor Gray
Write-Host "     - SENDGRID_API_KEY (optional)" -ForegroundColor Gray
Write-Host "     - GEMINI_API_KEY (optional)" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Sanity Projekt erstellen (falls neu):" -ForegroundColor White
Write-Host "     https://sanity.io/manage" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Entwicklungsserver starten:" -ForegroundColor White
Write-Host "     npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "  4. GitHub Repository erstellen:" -ForegroundColor White
Write-Host "     gh repo create $ProjectNameClean --private --source=. --push" -ForegroundColor Gray
Write-Host ""
Write-Host "Dokumentation: docs/KUNDE-README.md" -ForegroundColor DarkGray
Write-Host ""

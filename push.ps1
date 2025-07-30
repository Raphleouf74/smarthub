# Lire la version actuelle depuis version.json
$versionFile = "version.json"
if (Test-Path $versionFile) {
    $json = Get-Content $versionFile | ConvertFrom-Json
    $currentVersion = $json.version
} else {
    Write-Host "version.json net found !"
    exit
}

# Afficher la version actuelle et demander la nouvelle
Write-Host "Old version : $currentVersion"
$newVersion = Read-Host "New version ('', '-' or ' ' to keep $currentVersion)"

# Si l'utilisateur ne tape rien, un espace ou un tiret, on garde l'ancienne version
if ([string]::IsNullOrWhiteSpace($newVersion) -or $newVersion -eq "-") {
    $newVersion = $currentVersion
    Write-Host "Unchaged Version: $currentVersion"
} else {
    # Mettre à jour le JSON
    $json.version = $newVersion
    $json | ConvertTo-Json -Depth 10 | Set-Content $versionFile -Encoding UTF8
    Write-Host "version.json updated to $newVersion"
}

# Git commit & push
git add .
git commit -m "SmartHub version $newVersion"
git push origin main

Write-Host "GitPush completed"

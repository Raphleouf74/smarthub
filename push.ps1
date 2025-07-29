# Lire la version actuelle depuis version.json
$versionFile = "version.json"
if (Test-Path $versionFile) {
    $json = Get-Content $versionFile | ConvertFrom-Json
    $currentVersion = $json.version
}
else {
    Write-Host "version.json introuvable !"
    exit
}

# Afficher la version actuelle et demander la nouvelle
Write-Host "Ancienne version : $currentVersion"
$newVersion = Read-Host "Nouvelle version:"

# Mettre à jour le JSON
$json.version = $newVersion
$json | ConvertTo-Json -Depth 10 | Set-Content $versionFile -Encoding UTF8

Write-Host "version.json mis à jour vers $newVersion"

# Git commit & push
git add .
git commit -m "SmartHub version $newVersion"
git push origin main

Write-Host "Push éfféctué !"

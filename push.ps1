# Check version.json and compare versions
$versionFile = "version.json"
if (Test-Path $versionFile) {
    $json = Get-Content $versionFile | ConvertFrom-Json
    $currentVersion = $json.version
} else {
    Write-Host "version.json not found !"
    exit
}

# Show to user the old version and ask for the new one
Write-Host "Old version : $currentVersion"
$newVersion = Read-Host "New version ('', '-' or ' ' to keep $currentVersion)"

#If no user input, or if the user put a space or a "-", the old version number is pushed
if ([string]::IsNullOrWhiteSpace($newVersion) -or $newVersion -eq "-") {
    $newVersion = $currentVersion
    Write-Host "Unchaged Version: $currentVersion"
} else {
    # Update the JSON
    $json.version = $newVersion
    $json | ConvertTo-Json -Depth 10 | Set-Content $versionFile -Encoding UTF8
    Write-Host "version.json updated to $newVersion"
}

# Git commit & push
git add .
git commit -m "SmartHub version $newVersion"
git push origin main

Write-Host "GitPush completed"

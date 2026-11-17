param([switch]$Uninstall)
$root = $PSScriptRoot
$dest = Join-Path $HOME ".copilot"
$agents = Get-ChildItem (Join-Path $root "agents") -Filter *.agent.md
$skills = Get-ChildItem (Join-Path $root "skills") -Directory

if ($Uninstall) {
  $agents | ForEach-Object { Remove-Item (Join-Path $dest "agents\$($_.Name)") -ErrorAction SilentlyContinue }
  $skills | ForEach-Object { Remove-Item (Join-Path $dest "skills\$($_.Name)") -Recurse -ErrorAction SilentlyContinue }
  Write-Host "Agents et skills désinstallés."
  return
}

New-Item -ItemType Directory -Force (Join-Path $dest "agents"), (Join-Path $dest "skills") | Out-Null
$agents | ForEach-Object { Copy-Item $_.FullName (Join-Path $dest "agents") -Force; Write-Host "agent : $($_.Name)" }
$skills | ForEach-Object { Copy-Item $_.FullName (Join-Path $dest "skills") -Recurse -Force; Write-Host "skill : $($_.Name)" }
Write-Host "Installé dans $dest. Lancez : copilot --agent orchestrator"

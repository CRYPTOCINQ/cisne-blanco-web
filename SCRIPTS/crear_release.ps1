param(
  [Parameter(Mandatory=$true)][string]$VersionTag,
  [string]$Message = "Release $VersionTag"
)

# Crea un tag y lo publica
git tag $VersionTag -m $Message
git push origin $VersionTag
Write-Host "Tag $VersionTag creado y enviado."

param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$Name
)

function To-Kebab {
  param([string]$s)
  if ([string]::IsNullOrWhiteSpace($s)) { return $s }
  if ($s -match '^[a-z0-9\-]+$') { return $s.ToLower() }
  $t = ($s -replace '([a-z0-9])([A-Z])', '$1-$2' -replace '([A-Z])([A-Z][a-z])', '$1-$2')
  ($t -replace '[^A-Za-z0-9\-]', '-' -replace '--+', '-').Trim('-').ToLower()
}

$kebab = To-Kebab $Name
$componentPath = "src/components/$kebab/$kebab.ts"

$cmd = @(
  'cmd','/c',
  "nx g @nx/angular:component $componentPath"
) -join ' '

Write-Host $cmd
Invoke-Expression $cmd
exit $LASTEXITCODE

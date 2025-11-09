Param(
  [string]$AppPath = "C:\Cruise0-App\frontend",
  [string]$Bucket = "cruise0-frontend-new",
  [string]$Region = "ca-central-1",

  # Provide ONE of these:
  [string]$DistributionId = "",                   # e.g. E3IR04NW0OSJBD
  [string]$DistributionDomain = "dss3jdxg4usbj.cloudfront.net"  # e.g. dxxxx.cloudfront.net
)

function Resolve-DistributionId {
  param([string]$Domain)
  if ([string]::IsNullOrWhiteSpace($Domain)) { return "" }

  $id = aws cloudfront list-distributions `
    --query "DistributionList.Items[?DomainName=='$Domain'].Id | [0]" `
    --output text 2>$null

  if ($LASTEXITCODE -ne 0 -or $id -eq $null -or $id -eq "None") {
    Write-Error "Could not resolve DistributionId from domain '$Domain'. Check the domain or AWS credentials."
    exit 1
  }
  return $id
}

# 1) Ensure Node build
Write-Host "==> Building SPA" -ForegroundColor Cyan
Push-Location $AppPath
if (Test-Path package-lock.json) {
  npm ci
} else {
  npm install
}
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Vite build failed"; exit 1 }
Pop-Location

# 2) Upload to S3 (cache everything long except index.html)
Write-Host "==> Syncing to S3 s3://$Bucket (region $Region)" -ForegroundColor Cyan
aws s3 sync "$AppPath\dist" "s3://$Bucket" --delete --region $Region --cache-control "max-age=31536000,public"
# Re-upload index.html with no-cache so updates appear immediately
aws s3 cp "$AppPath\dist\index.html" "s3://$Bucket/index.html" --region $Region --cache-control "no-cache, no-store, must-revalidate" --content-type "text/html"

if ($LASTEXITCODE -ne 0) { Write-Error "S3 sync failed"; exit 1 }

# 3) Determine DistributionId if not passed
if ([string]::IsNullOrWhiteSpace($DistributionId)) {
  $DistributionId = Resolve-DistributionId -Domain $DistributionDomain
  Write-Host "==> Resolved DistributionId: $DistributionId from domain $DistributionDomain" -ForegroundColor Green
} else {
  Write-Host "==> Using DistributionId: $DistributionId" -ForegroundColor Green
}

# 4) Invalidate CloudFront
Write-Host "==> Creating CloudFront invalidation /* for $DistributionId" -ForegroundColor Cyan
$inv = aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*"
if ($LASTEXITCODE -ne 0) { Write-Error "CloudFront invalidation failed"; exit 1 }

Write-Host "`n✅ Deploy complete!" -ForegroundColor Green
Write-Host "   S3 Bucket: s3://$Bucket"
Write-Host "   CloudFront: https://$DistributionDomain"

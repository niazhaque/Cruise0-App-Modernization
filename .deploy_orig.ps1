# ================================
# Cruise0 Full Deployment Script
# ================================

Write-Host "`n--- Starting Cruise0 Deployment ---`n" -ForegroundColor Cyan

# 1. Build Frontend
Write-Host "Building Frontend..." -ForegroundColor Yellow
cd ./frontend
npm install --legacy-peer-deps
npm run build

# 2. Upload to S3
Write-Host "`nSyncing frontend to S3..." -ForegroundColor Yellow
aws s3 sync ./dist s3://cruise0-frontend-new --delete

# 3. Invalidate CloudFront cache
Write-Host "`nInvalidating CloudFront cache..." -ForegroundColor Yellow
aws cloudfront create-invalidation --distribution-id E24BZKU7I9636Z --paths "/*"

# 4. Deploy Backend
Write-Host "`nDeploying backend (Lambda + API Gateway)..." -ForegroundColor Yellow
cd ../backend
sam deploy

# 5. Fetch API URL
$apiUrl = (aws cloudformation describe-stacks --stack-name cruise0-backend --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" --output text)

Write-Host "`nDeployment Complete!" -ForegroundColor Green
Write-Host "---------------------------------------------"
Write-Host "Frontend: dss3jdxg4usbj.cloudfront.net" -ForegroundColor Cyan
Write-Host "Backend API: $apiUrl" -ForegroundColor Cyan
Write-Host "---------------------------------------------"
Write-Host "Done ✅"

# Automated Blog Generation Setup Script

Write-Host "=== Automated Blog Generation Setup ===" -ForegroundColor Cyan
Write-Host ""

if (Test-Path .env.local) {
    Write-Host "✅ Found .env.local" -ForegroundColor Green
} else {
    Write-Host "⚠️ Creating .env.local from env.example..." -ForegroundColor Yellow
    Copy-Item env.example .env.local
    Write-Host "✅ Created .env.local" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Get your FREE Gemini API Key:" -ForegroundColor Cyan
Write-Host "   Visit: https://makersuite.google.com/app/apikey" -ForegroundColor White
Write-Host ""
Write-Host "2. Generate a random secret for CRON_SECRET:" -ForegroundColor Cyan
Write-Host "   Run this command:" -ForegroundColor White
Write-Host '   $secret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})' -ForegroundColor Gray
Write-Host '   Write-Host $secret' -ForegroundColor Gray
Write-Host ""
Write-Host "3. Add to .env.local:" -ForegroundColor Cyan
Write-Host "   GEMINI_API_KEY=your_key" -ForegroundColor White
Write-Host "   CRON_SECRET=your_secret" -ForegroundColor White
Write-Host ""
Write-Host "4. Add to Vercel environment variables" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Done! Deploy to activate daily blog posts at 9 AM UTC" -ForegroundColor Green

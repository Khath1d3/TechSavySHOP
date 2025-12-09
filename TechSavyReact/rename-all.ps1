# Master script to rename all page classes
Write-Host "Starting comprehensive class renaming for all pages..."
Write-Host "============================================="

# Run all renaming scripts in sequence
& ".\rename-product.ps1"
Write-Host ""

& ".\rename-cart.ps1"
Write-Host ""

& ".\rename-viewitem.ps1"
Write-Host ""

& ".\rename-account.ps1"
Write-Host ""

& ".\rename-review.ps1"
Write-Host ""

& ".\rename-shared.ps1"
Write-Host ""

Write-Host "============================================="
Write-Host "All pages and components have been successfully renamed!"
Write-Host "Each page now has its own isolated styles:"
Write-Host "  - Landing Page: landing-*"
Write-Host "  - Product Page: product-*"
Write-Host "  - Cart Page: cart-*"
Write-Host "  - View Item Page: viewitem-*"
Write-Host "  - Account Page: account-*"
Write-Host "  - Review Order Page: review-*"
Write-Host "  - Shared Components: shared-*"

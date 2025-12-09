# Rename ReviewOrderPage classes with review- prefix
$jsxFile = "src\Pages\ReviewOrderPage\ReviewOrderPage.jsx"
$cssFile = "src\Pages\ReviewOrderPage\ReviewOrderStyle.css"

Write-Host "Processing ReviewOrder files..."

# Process JSX
$content = Get-Content $jsxFile -Raw
$content = $content -replace 'className="review-order-page\b', 'className="review-review-order-page'
$content = $content -replace 'className="review-container\b', 'className="review-review-container'
$content = $content -replace 'className="order-summary\b', 'className="review-order-summary'
$content = $content -replace 'className="payment-', 'className="review-payment-'
$content = $content -replace 'className="address-', 'className="review-address-'
$content = $content -replace 'className="voucher-', 'className="review-voucher-'
$content = $content -replace 'className="total-', 'className="review-total-'
$content = $content -replace 'className="checkout-btn\b', 'className="review-checkout-btn'
Set-Content $jsxFile $content

# Process CSS
$content = Get-Content $cssFile -Raw
$content = $content -replace '\.review-order-page\b', '.review-review-order-page'
$content = $content -replace '\.review-container\b', '.review-review-container'
$content = $content -replace '\.order-summary\b', '.review-order-summary'
$content = $content -replace '\.payment-', '.review-payment-'
$content = $content -replace '\.address-', '.review-address-'
$content = $content -replace '\.voucher-', '.review-voucher-'
$content = $content -replace '\.total-', '.review-total-'
$content = $content -replace '\.checkout-btn\b', '.review-checkout-btn'
Set-Content $cssFile $content

Write-Host "ReviewOrderPage classes renamed successfully!"

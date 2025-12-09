# Rename ViewItemPage classes with viewitem- prefix
$jsxFile = "src\Pages\ViewItemPage\ViewItemPage.jsx"
$cssFile = "src\Pages\ViewItemPage\ViewItemStyle.css"

Write-Host "Processing ViewItem files..."

# Process JSX
$content = Get-Content $jsxFile -Raw
$content = $content -replace 'className="view-item-page\b', 'className="viewitem-view-item-page'
$content = $content -replace 'className="product-container\b', 'className="viewitem-product-container'
$content = $content -replace 'className="product-image\b', 'className="viewitem-product-image'
$content = $content -replace 'className="product-info\b', 'className="viewitem-product-info'
$content = $content -replace 'className="product-', 'className="viewitem-product-'
$content = $content -replace 'className="quantity-', 'className="viewitem-quantity-'
$content = $content -replace 'className="add-to-cart\b', 'className="viewitem-add-to-cart'
$content = $content -replace 'className="reviews-section\b', 'className="viewitem-reviews-section'
$content = $content -replace 'className="review-', 'className="viewitem-review-'
Set-Content $jsxFile $content

# Process CSS
$content = Get-Content $cssFile -Raw
$content = $content -replace '\.view-item-page\b', '.viewitem-view-item-page'
$content = $content -replace '\.product-container\b', '.viewitem-product-container'
$content = $content -replace '\.product-image\b', '.viewitem-product-image'
$content = $content -replace '\.product-info\b', '.viewitem-product-info'
$content = $content -replace '\.product-', '.viewitem-product-'
$content = $content -replace '\.quantity-', '.viewitem-quantity-'
$content = $content -replace '\.add-to-cart\b', '.viewitem-add-to-cart'
$content = $content -replace '\.reviews-section\b', '.viewitem-reviews-section'
$content = $content -replace '\.review-', '.viewitem-review-'
Set-Content $cssFile $content

Write-Host "ViewItemPage classes renamed successfully!"

# Rename CartPage classes with cart- prefix
$jsxFile = "src\Pages\CartPage\CartPage.jsx"
$cssFile = "src\Pages\CartPage\CartitemStyle.css"
$itemJsx = "src\Components\CartItem.jsx"

Write-Host "Processing Cart files..."

# Process CartPage.jsx
$content = Get-Content $jsxFile -Raw
$content = $content -replace 'className="cart-page\b', 'className="cart-cart-page'
$content = $content -replace 'className="cart-container\b', 'className="cart-cart-container'
$content = $content -replace 'className="cart-items\b', 'className="cart-cart-items'
$content = $content -replace 'className="cart-summary\b', 'className="cart-cart-summary'
$content = $content -replace 'className="empty-cart\b', 'className="cart-empty-cart'
Set-Content $jsxFile $content

# Process CartItem.jsx
$content = Get-Content $itemJsx -Raw
$content = $content -replace 'className="cart-item\b', 'className="cart-cart-item'
$content = $content -replace 'className="item-image\b', 'className="cart-item-image'
$content = $content -replace 'className="item-details\b', 'className="cart-item-details'
$content = $content -replace 'className="item-', 'className="cart-item-'
$content = $content -replace 'className="quantity-', 'className="cart-quantity-'
$content = $content -replace 'className="remove-btn\b', 'className="cart-remove-btn'
Set-Content $itemJsx $content

# Process CSS
$content = Get-Content $cssFile -Raw
$content = $content -replace '\.cart-page\b', '.cart-cart-page'
$content = $content -replace '\.cart-container\b', '.cart-cart-container'
$content = $content -replace '\.cart-items\b', '.cart-cart-items'
$content = $content -replace '\.cart-item\b', '.cart-cart-item'
$content = $content -replace '\.cart-summary\b', '.cart-cart-summary'
$content = $content -replace '\.empty-cart\b', '.cart-empty-cart'
$content = $content -replace '\.item-image\b', '.cart-item-image'
$content = $content -replace '\.item-details\b', '.cart-item-details'
$content = $content -replace '\.item-', '.cart-item-'
$content = $content -replace '\.quantity-', '.cart-quantity-'
$content = $content -replace '\.remove-btn\b', '.cart-remove-btn'
Set-Content $cssFile $content

Write-Host "CartPage classes renamed successfully!"

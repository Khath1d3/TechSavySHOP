# Rename ProductPage/DeviceList classes with product- prefix
$files = @(
    @{jsx="src\Components\DeviceList.jsx"; css="src\componentStyle\DeviceListstyle.css"; prefix="product"}
)

foreach ($file in $files) {
    $jsxFile = $file.jsx
    $cssFile = $file.css
    $prefix = $file.prefix
    
    Write-Host "Processing $jsxFile..."
    
    # Read JSX content
    $jsxContent = Get-Content $jsxFile -Raw
    
    # Replace class names in JSX
    $jsxContent = $jsxContent -replace 'className="filters\b', "className=`"$prefix-filters"
    $jsxContent = $jsxContent -replace 'className="filter-', "className=`"$prefix-filter-"
    $jsxContent = $jsxContent -replace 'className="products-grid\b', "className=`"$prefix-products-grid"
    $jsxContent = $jsxContent -replace 'className="products-container\b', "className=`"$prefix-products-container"
    $jsxContent = $jsxContent -replace 'className="pagination\b', "className=`"$prefix-pagination"
    $jsxContent = $jsxContent -replace 'className=\{`filters', "className={``$prefix-filters"
    $jsxContent = $jsxContent -replace 'className=\{`filter-', "className={``$prefix-filter-"
    
    Set-Content $jsxFile $jsxContent
    
    Write-Host "Processing $cssFile..."
    
    # Read CSS content
    $cssContent = Get-Content $cssFile -Raw
    
    # Replace selectors in CSS
    $cssContent = $cssContent -replace '\.filters\b', ".$prefix-filters"
    $cssContent = $cssContent -replace '\.filter-', ".$prefix-filter-"
    $cssContent = $cssContent -replace '\.products-grid\b', ".$prefix-products-grid"
    $cssContent = $cssContent -replace '\.products-container\b', ".$prefix-products-container"
    $cssContent = $cssContent -replace '\.pagination\b', ".$prefix-pagination"
    
    Set-Content $cssFile $cssContent
}

Write-Host "ProductPage classes renamed successfully!"

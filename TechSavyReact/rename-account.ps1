# Rename AccountPage and its components with account- prefix
$files = @(
    @{jsx="src\Pages\Account\Account.jsx"; css="src\Pages\Account\AccountStyle.css"},
    @{jsx="src\Components\personalDetails.jsx"; css="src\componentStyle\PersonalStyle.css"},
    @{jsx="src\Components\AddressBook.jsx"; css="src\componentStyle\AddressBookStyle.css"},
    @{jsx="src\Components\invoices.jsx"; css="src\componentStyle\invoicestyle.css"},
    @{jsx="src\Components\Orders.jsx"; css=null},
    @{jsx="src\Components\Reviews.jsx"; css="src\componentStyle\ProductReview.css"},
    @{jsx="src\Components\SecuritySettings.jsx"; css="src\componentStyle\SecuritySettingsStyle.css"}
)

foreach ($file in $files) {
    Write-Host "Processing $($file.jsx)..."
    
    # Process JSX
    $content = Get-Content $file.jsx -Raw
    
    # Generic replacements for all account components
    $content = $content -replace 'className="account-page\b', 'className="account-account-page'
    $content = $content -replace 'className="account-container\b', 'className="account-account-container'
    $content = $content -replace 'className="Left\b', 'className="account-Left'
    $content = $content -replace 'className="Right\b', 'className="account-Right'
    $content = $content -replace 'className="floating-menu-btn\b', 'className="account-floating-menu-btn'
    $content = $content -replace 'className="menu-overlay\b', 'className="account-menu-overlay'
    $content = $content -replace 'className="personal-', 'className="account-personal-'
    $content = $content -replace 'className="address-', 'className="account-address-'
    $content = $content -replace 'className="invoice-', 'className="account-invoice-'
    $content = $content -replace 'className="order-', 'className="account-order-'
    $content = $content -replace 'className="review-', 'className="account-review-'
    $content = $content -replace 'className="security-', 'className="account-security-'
    $content = $content -replace 'className="form-', 'className="account-form-'
    $content = $content -replace 'className="btn-', 'className="account-btn-'
    
    Set-Content $file.jsx $content
    
    # Process CSS if exists
    if ($file.css) {
        Write-Host "Processing $($file.css)..."
        $content = Get-Content $file.css -Raw
        
        $content = $content -replace '\.account-page\b', '.account-account-page'
        $content = $content -replace '\.account-container\b', '.account-account-container'
        $content = $content -replace '\.Left\b', '.account-Left'
        $content = $content -replace '\.Right\b', '.account-Right'
        $content = $content -replace '\.floating-menu-btn\b', '.account-floating-menu-btn'
        $content = $content -replace '\.menu-overlay\b', '.account-menu-overlay'
        $content = $content -replace '\.personal-', '.account-personal-'
        $content = $content -replace '\.address-', '.account-address-'
        $content = $content -replace '\.invoice-', '.account-invoice-'
        $content = $content -replace '\.order-', '.account-order-'
        $content = $content -replace '\.review-', '.account-review-'
        $content = $content -replace '\.security-', '.account-security-'
        $content = $content -replace '\.form-', '.account-form-'
        $content = $content -replace '\.btn-', '.account-btn-'
        
        Set-Content $file.css $content
    }
}

Write-Host "AccountPage and components classes renamed successfully!"

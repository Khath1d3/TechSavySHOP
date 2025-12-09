# Rename shared component classes (Header2, Footer, Modal, etc.)
Write-Host "Processing shared components..."

# Header2
$content = Get-Content "src\Components\Header2.jsx" -Raw
$content = $content -replace 'className="header-top\b', 'className="shared-header-top'
$content = $content -replace 'className="logo\b', 'className="shared-logo'
$content = $content -replace 'className="hamburger-menu\b', 'className="shared-hamburger-menu'
$content = $content -replace 'className="nav-menu\b', 'className="shared-nav-menu'
$content = $content -replace 'className="nav-links\b', 'className="shared-nav-links'
$content = $content -replace 'className="nav-link\b', 'className="shared-nav-link'
$content = $content -replace 'className="item\b', 'className="shared-item'
$content = $content -replace 'className="accountInfo\b', 'className="shared-accountInfo'
$content = $content -replace 'className="user-info', 'className="shared-user-info'
$content = $content -replace 'className="cart-icon\b', 'className="shared-cart-icon'
$content = $content -replace 'className=\{`nav-menu', 'className={`shared-nav-menu'
$content = $content -replace 'className=\{`accountInfo', 'className={`shared-accountInfo'
Set-Content "src\Components\Header2.jsx" $content

$content = Get-Content "src\componentStyle\Header2style.css" -Raw
$content = $content -replace '\bheader\s*\{', 'header.shared-header {'
$content = $content -replace '\.header-top\b', '.shared-header-top'
$content = $content -replace '\.logo\b', '.shared-logo'
$content = $content -replace '\.hamburger-menu\b', '.shared-hamburger-menu'
$content = $content -replace '\.nav-menu\b', '.shared-nav-menu'
$content = $content -replace '\.nav-links\b', '.shared-nav-links'
$content = $content -replace '\.nav-link\b', '.shared-nav-link'
$content = $content -replace '\.item\b', '.shared-item'
$content = $content -replace '\.accountInfo\b', '.shared-accountInfo'
$content = $content -replace '\.user-info', '.shared-user-info'
$content = $content -replace '\.cart-icon\b', '.shared-cart-icon'
$content = $content -replace 'nav ul li \.item', 'nav ul li .shared-item'
Set-Content "src\componentStyle\Header2style.css" $content

# Footer
$content = Get-Content "src\Components\Footer.jsx" -Raw
$content = $content -replace 'className="footer\b', 'className="shared-footer'
$content = $content -replace 'className="footer-', 'className="shared-footer-'
Set-Content "src\Components\Footer.jsx" $content

# Modal
$content = Get-Content "src\Components\modal.jsx" -Raw
$content = $content -replace 'className="modal-overlay\b', 'className="shared-modal-overlay'
$content = $content -replace 'className="modal-content\b', 'className="shared-modal-content'
$content = $content -replace 'className="modal-', 'className="shared-modal-'
Set-Content "src\Components\modal.jsx" $content

$content = Get-Content "src\componentStyle\modalstyle.css" -Raw
$content = $content -replace '\.modal-overlay\b', '.shared-modal-overlay'
$content = $content -replace '\.modal-content\b', '.shared-modal-content'
$content = $content -replace '\.modal-', '.shared-modal-'
Set-Content "src\componentStyle\modalstyle.css" $content

# GlobalLoader
$content = Get-Content "src\Components\GlobalLoader.jsx" -Raw
$content = $content -replace 'className="loader-overlay\b', 'className="shared-loader-overlay'
$content = $content -replace 'className="loader-spinner\b', 'className="shared-loader-spinner'
Set-Content "src\Components\GlobalLoader.jsx" $content

$content = Get-Content "src\componentStyle\GlobalLoader.css" -Raw
$content = $content -replace '\.loader-overlay\b', '.shared-loader-overlay'
$content = $content -replace '\.loader-spinner\b', '.shared-loader-spinner'
Set-Content "src\componentStyle\GlobalLoader.css" $content

Write-Host "Shared components classes renamed successfully!"

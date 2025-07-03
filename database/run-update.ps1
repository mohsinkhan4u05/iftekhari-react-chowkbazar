# PowerShell script to update the BlogPosts table for Unicode support
# Make sure to update the connection string with your actual database details

param(
    [string]$Server = "localhost",
    [string]$Database = "YourDatabaseName",
    [string]$Username = "",
    [string]$Password = "",
    [switch]$WindowsAuth = $false
)

Write-Host "Updating BlogPosts table for Unicode (emoji) support..." -ForegroundColor Green

# Check if SQL Server module is available
if (-not (Get-Module -ListAvailable -Name SqlServer)) {
    Write-Host "Installing SqlServer PowerShell module..." -ForegroundColor Yellow
    Install-Module -Name SqlServer -Force -AllowClobber -Scope CurrentUser
}

Import-Module SqlServer

# Build connection string
if ($WindowsAuth) {
    $connectionString = "Server=$Server;Database=$Database;Integrated Security=True;"
} else {
    if (-not $Username) {
        $Username = Read-Host "Enter SQL Server username"
    }
    if (-not $Password) {
        $securePassword = Read-Host "Enter SQL Server password" -AsSecureString
        $Password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))
    }
    $connectionString = "Server=$Server;Database=$Database;User Id=$Username;Password=$Password;"
}

try {
    # Read the SQL script
    $scriptPath = Join-Path $PSScriptRoot "update_blog_table.sql"
    $sqlScript = Get-Content $scriptPath -Raw
    
    # Replace placeholder with actual database name
    $sqlScript = $sqlScript -replace "\[YourDatabaseName\]", "[$Database]"
    
    Write-Host "Executing database update script..." -ForegroundColor Yellow
    
    # Execute the script
    Invoke-Sqlcmd -ConnectionString $connectionString -Query $sqlScript -Verbose
    
    Write-Host "Database update completed successfully!" -ForegroundColor Green
    Write-Host "Your blog titles with emojis should now save properly." -ForegroundColor Green
    
} catch {
    Write-Host "Error updating database: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check your connection details and try again." -ForegroundColor Red
}

Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Get-Content .env | ForEach-Object {
    if ($_ -match "^\s*#") { return } # Пропустить комментарии
    if ($_ -match "^\s*$") { return } # Пропустить пустые строки
    $parts = $_ -split '=', 2
    if ($parts.Length -eq 2) {
        $key = $parts[0].Trim()
        $value = $parts[1].Trim().Trim("'`"") # Убрать кавычки
        [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

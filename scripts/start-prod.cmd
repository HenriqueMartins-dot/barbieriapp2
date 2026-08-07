@echo off
setlocal

powershell -NoProfile -Command "$pids = Get-NetTCPConnection -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -in 3000,3001 -and $_.State -eq 'Listen' } | Select-Object -ExpandProperty OwningProcess -Unique; if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } }"

next start --port 3000

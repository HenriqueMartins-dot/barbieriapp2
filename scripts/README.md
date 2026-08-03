# Setup scripts

Use this PowerShell script on a new machine to install the dependencies and start both the web app and the API together:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-dev.ps1
```

This script will:
1. Install the root frontend dependencies
2. Install the API dependencies in the `barbieri_api` folder
3. Start the frontend and API in parallel

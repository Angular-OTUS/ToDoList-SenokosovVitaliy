$api = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm", "run", "api" -PassThru -NoNewWindow

try {
  npx nx serve todo-list
} finally {
  Stop-Process -Id $api.Id -Force -ErrorAction SilentlyContinue
}

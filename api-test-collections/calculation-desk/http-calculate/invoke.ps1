$body = Get-Content (Join-Path $PSScriptRoot "sample-data.json") -Raw
$response = Invoke-WebRequest -Method Post -Uri "http://localhost:3000/api/calculate" -ContentType "application/json" -Body $body -UseBasicParsing
if ($response.StatusCode -ne 200) {
    throw "POST /api/calculate returned HTTP $($response.StatusCode)"
}
$payload = $response.Content | ConvertFrom-Json
if ($payload.result -ne 20) {
    throw "Expected result 20, received $($payload.result)"
}
Write-Output "POST /api/calculate -> HTTP $($response.StatusCode), result=$($payload.result)"

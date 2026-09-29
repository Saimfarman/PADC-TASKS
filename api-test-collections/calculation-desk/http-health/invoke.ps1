$response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing
if ($response.StatusCode -ne 200) {
    throw "GET /api/health returned HTTP $($response.StatusCode)"
}
$payload = $response.Content | ConvertFrom-Json
if ($payload.status -ne "healthy") {
    throw "Health status was '$($payload.status)'"
}
Write-Output "GET /api/health -> HTTP $($response.StatusCode), status=$($payload.status)"

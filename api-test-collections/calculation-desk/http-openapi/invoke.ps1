$response = Invoke-WebRequest -Uri "http://localhost:3000/api/openapi.json" -UseBasicParsing
if ($response.StatusCode -ne 200) {
    throw "GET /api/openapi.json returned HTTP $($response.StatusCode)"
}
$payload = $response.Content | ConvertFrom-Json
if ($payload.openapi -ne "3.0.3") {
    throw "Unexpected OpenAPI version '$($payload.openapi)'"
}
Write-Output "GET /api/openapi.json -> HTTP $($response.StatusCode), openapi=$($payload.openapi)"

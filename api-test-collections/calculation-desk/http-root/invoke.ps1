$response = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing
if ($response.StatusCode -ne 200) {
    throw "GET / returned HTTP $($response.StatusCode)"
}
Write-Output "GET / -> HTTP $($response.StatusCode)"

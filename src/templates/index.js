export const templates = {
  javascript: {
    fetch: (method, url, body) => `
fetch('${url}', {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json'
  }${body ? `,\n  body: JSON.stringify(${body})` : ''}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,

    axios: (method, url, body) => `
axios.${method.toLowerCase()}('${url}'${body ? `, ${body}` : ''})
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));`,

    express: (method, path) => `
app.${method.toLowerCase()}('${path}', (req, res) => {
  // Handle the request
  res.json({ message: 'Success' });
});`
  },
  python: {
    requests: (method, url, body) => `
import requests

response = requests.${method.toLowerCase()}('${url}'${body ? `, json=${body}` : ''})
data = response.json()
print(data)`,

    flask: (method, path) => `
@app.route('${path}', methods=['${method}'])
def handler():
    # Handle the request
    return jsonify({'message': 'Success'})`
  },
  go: {
    net_http: (method, url, body) => `
client := &http.Client{}
${body ? `jsonData, _ := json.Marshal(${body})
` : ''}req, err := http.NewRequest("${method}", "${url}", ${body ? 'bytes.NewBuffer(jsonData)' : 'nil'})
if err != nil {
    log.Fatal(err)
}

req.Header.Set("Content-Type", "application/json")
resp, err := client.Do(req)
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()`
  }
}
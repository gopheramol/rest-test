/**
 * Generates a curl command from a request object
 */
export function generateCurlCommand(request: any): string {
  const { method, url, headers, body } = request;
  let curlCmd = `curl -X ${method} '${url}'`;

  // Add headers
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      if (key && value) {
        curlCmd += `\n  -H '${key}: ${value}'`;
      }
    });
  }

  // Add request body if present
  if (body) {
    try {
      // Ensure the body is properly formatted JSON
      const formattedBody = JSON.stringify(JSON.parse(body));
      curlCmd += `\n  -d '${formattedBody}'`;
    } catch {
      curlCmd += `\n  -d '${body}'`;
    }
  }

  return curlCmd;
} 
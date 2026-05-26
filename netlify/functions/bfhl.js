exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // GET request
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ operation_code: 1 }),
    };
  }

  // POST request
  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body || "{}");
      const data = body.data;

      if (!data || !Array.isArray(data)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            is_success: false,
            error: 'Missing or invalid "data" array in request body.',
          }),
        };
      }

      // Separate numbers and alphabets
      const numbers = data.filter((item) => /^\d+$/.test(String(item)));
      const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(String(item)));

      // Find highest lowercase alphabet
      const lowercaseAlphabets = alphabets.filter((c) =>
        /^[a-z]$/.test(String(c))
      );
      const highestLowercaseAlphabet =
        lowercaseAlphabets.length > 0
          ? [
              lowercaseAlphabets.reduce((max, c) =>
                c.charCodeAt(0) > max.charCodeAt(0) ? c : max
              ),
            ]
          : [];

      const response = {
        is_success: true,
        user_id: "diya_wadhwa_26052004",
        email: "diya.wadhwa24@gmail.com",
        roll_number: "BFHL2024001",
        numbers: numbers.map(String),
        alphabets: alphabets.map(String),
        highest_lowercase_alphabet: highestLowercaseAlphabet,
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response),
      };
    } catch (err) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          is_success: false,
          error: "Invalid JSON body: " + err.message,
        }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};

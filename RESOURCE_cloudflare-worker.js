export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };


    // CORS check
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }


    try {

      const body = await request.json();

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",

          headers: {
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: body.messages,
            max_tokens: 300
          })
        }
      );


      const data = await response.json();


      return new Response(
        JSON.stringify(data),
        {
          status: response.status,
          headers: corsHeaders
        }
      );


    } catch (error) {

      return new Response(
        JSON.stringify({
          error: error.message
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );

    }
  }
};
import 'node-fetch';
import { createParser } from 'eventsource-parser';

const completion_endpoint = 'https://api.openai.com/v1/chat/completions';
const embeddings_endpoint = 'https://api.openai.com/v1/embeddings';

/**
 * Embed a string of text
 * @param {string} text - The text to embed
 * @returns {Promise<object|null>} - A Promise that resolves to the embedding object or null if not found.
 */
async function embed(text) {
    const params = { input: text, model: 'text-embedding-ada-002' };
    const headers = {
        Authorization: `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json',
    };

    const response = await fetch(embeddings_endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(params),
    });

    const json = await response.json();
    return json.data[0].embedding;
}

/**
 * Query the GPT Chat API
 * @param {string[]} messages - An array of messages to send to the API
 * @param {string} stopSequence - The sequence of characters to stop the completion at
 * @returns {Promise<string>} - A Promise that resolves to the chat response
 */
async function queryGpt(messages, stopSequence) {
  var model = 'gpt-3.5-turbo';
  var stop = stopSequence;
  // var model = 'gpt-4';
  var temperature = 0.7;
  var maxTokens = 1000;

  const params = { model, messages, stop, temperature, max_tokens: maxTokens };
  const headers = {
    Authorization: `Bearer ${process.env.API_KEY}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(completion_endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  });
  console.log('Response json: ', response);

  const json = await response.json();

  if (json.choices && json.choices[0] && json.choices[0].message) {
    return json.choices[0].message.content;
  } else {
    console.log('Error: Unexpected API response format', json);
    return 'ERROR';
  }
}

/**
 * Stream the Chat Completions API
 * @param {string[]} messages - An array of messages to send to the API
 * @param {function} callback - A callback function to run on each message
 */
async function streamGpt(messages, callback) {
  let response = await fetch(completion_endpoint,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_KEY}`
      },
      method: "POST",
      body: JSON.stringify({
        // model: "gpt-4",
        model: 'gpt-3.5-turbo-1106',
        // model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.9,
        max_tokens: 4000,
        stream: true,
      }),
    });

  console.log("Streaming gpt");


  const parser = createParser(thing => {
    var piece = onParse(thing);
    if (piece) {
      console.log(piece);
      callback(piece);
    }
  });
  for await (const value of response.body?.pipeThrough(new TextDecoderStream())) {
    parser.feed(value);
  }
  callback(null); //Callback with null to indicate that the stream has ended
}

function onParse(event) {
  if (event.type === 'event') {
    if (event.data !== "[DONE]") {
      return JSON.parse(event.data).choices[0].delta?.content || "";
    }
  } else if (event.type === 'reconnect-interval') {
    console.log('We should set reconnect interval to %d milliseconds', event.value)
  }
}

export { queryGpt, streamGpt, embed };
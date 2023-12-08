import { streamGpt } from '../services/gpt.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Create an in memory map to cache wildcardResponsesr
//Attempt to load from disk first
const mapPath = path.join(__dirname, 'wildcardResponses.json');
let wildcardResponses;
if (fs.existsSync(mapPath)) {
    const mapJson = fs.readFileSync(mapPath);
    const mapArray = JSON.parse(mapJson);
    wildcardResponses = new Map(mapArray);
} else {
    wildcardResponses = new Map();
}

//Calls gpt to handle wildcard routes and generate content using streamGpt
function wildcardHandler(req, res) {
  //Check if url is in map
  if (wildcardResponses.has(req.originalUrl)) {
    //If so, return the cached response
    const page = wildcardResponses.get(req.originalUrl);
    res.send(page);
    console.log(page)
    return;
  }

  const prompt = {
    'role': 'system',
    'content': `For the page hosted at /page/${req.params[0]}, start by generating an HTML comment that outlines a context for the page. This backstory should serve as the foundation for the page's theme, style, and content. Do not use placeholders anywhere, all generated content must be unique and interesting. Do not write TODOs or comments in the generated HTML, all content should be final and all javascript should be inlined and completed. 
Then generate the full HTML for the page, using inline CSS and JS as required. Adapt the content, layout and CSS to fit the theme suggested by the generated page context. 
All images must be embedded SVGs or wikimedia embeds, and must align with the page's theme if included. Ensure the page is responsive, beautiful, and contains intuitive navigation. All internal links must be relative and confined within the /page/ subpath.`
  };
  
  const messages = [prompt];
  //Send mime type to browser and keep connection alive with a 5 second timeout
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Connection': 'keep-alive',
    'Keep-Alive': 'timeout=5',
  });
  const callback = (message) => {
    if (message) {
      let currentResponse = wildcardResponses.get(req.originalUrl);
      if (currentResponse === undefined) {
        currentResponse = '';
      }
      //Also cache the streamed response in in-memory map
      wildcardResponses.set(req.originalUrl, currentResponse + message);
      res.write(message);
    } else {
      res.end();
      //Save in-memory map to disk
      const mapJson = JSON.stringify([...wildcardResponses]);
      fs.writeFileSync(mapPath, mapJson);
      
    }
  }
  streamGpt(messages, callback);
}

export { wildcardHandler };


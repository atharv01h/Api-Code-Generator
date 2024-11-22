import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { templates } from './templates/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate', (req, res) => {
  const { language, framework, method, endpoint, body } = req.body;
  
  if (!language || !framework || !method || !endpoint) {
    return res.status(400).json({ 
      error: 'Missing required parameters' 
    });
  }

  try {
    const template = templates[language][framework];
    if (!template) {
      return res.status(404).json({ 
        error: 'Template not found for the specified language and framework' 
      });
    }

    const code = template(method, endpoint, body);
    res.json({ code: code.trim() });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error generating code' 
    });
  }
});

app.get('/supported', (req, res) => {
  const supported = Object.entries(templates).reduce((acc, [lang, frameworks]) => {
    acc[lang] = Object.keys(frameworks);
    return acc;
  }, {});
  
  res.json(supported);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`API Generator running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser to use the web interface`);
});
const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

let requetsNumber = 0;

server.use((req, res, next) => {
  requetsNumber++;

  console.log(`Requisições: ${requetsNumber}`);

  return next();
});

function checkIdExists(req, res, next) {
  if (!projects.find(pj => pj.id === req.body.id)) {
    return res.status(400).json({ error: 'user name is required!' });
  }

  return next();
}

// Cria um novo projeto
server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

// Lista todos os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// Altera titulo do projeto
server.put('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(pj => pj.id === id);

  project.title = title;

  return res.json(project);
});

// Deleta projeto
server.delete('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(pj => pj.id === id);

  projects.splice(index, 1);

  return res.send();
});

// Adiciona nova tarefa
server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { id } = req.params;
  const project = projects.find(pj => pj.id === id);

  project.tasks.push(req.body.title);

  return res.json(project);
});

server.listen(3000);

const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', (request, response, next) => {
  const { id } = request.params

  if (!isUuid(id))
    return response.status(400).json({ error: 'Invalid repository ID.' })

  return next()
})

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repo = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repo)

  return response.status(201).json(repo)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repo = repositories.find(repo => repo.id === id)

  if (repo == null)
    return response.status(400).json({ error: 'Invalid repository ID.' })

  Object.assign(repo, { title, url, techs })

  return response.json(repo)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if (repoIndex === -1)
    return response.status(400).json({ error: 'Invalid repository ID.' })

  repositories.splice(repoIndex, 1)

  return response.sendStatus(204);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  
  const repo = repositories.find(repo => repo.id === id)

  if (repo == null)
    return response.status(400).json({ error: 'Invalid repository ID.' })

  repo.likes++

  return response.json(repo)
});

module.exports = app;

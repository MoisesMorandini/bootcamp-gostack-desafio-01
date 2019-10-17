const express = require("express");
const server = express();
server.use(express.json());
const projects = [];
let numberOfReqs = 0;
server.use((req, res, next) => {
  numberOfReqs++;
  console.log(`Number of reqs: ${numberOfReqs}`);
  next();
});

function checkIdExistsInProject(req, res, next) {
  var present = false;
  projects.find(element => {
    if (element.id === req.params.id) {
      present = true;
    }
  });
  if (!present) {
    return res.status(400).json({ error: "Este ID não esta presente no projeto" });
  }
  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title, task } = req.body;
  projects.push({ id, title, task });
  return res.json(projects);
});

server.put("/projects/:id", checkIdExistsInProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  // dentro de project busco aquele que  contem o ID que da requisicao
  // entao pego o title do body, e recebo ele no title do array
  projects.find(element => {
    if (element.id === id) {
      return (element.title = title);
    }
  });
  return res.json(projects);
});

server.delete("/projects/:id", checkIdExistsInProject, (req, res) => {
  const { id } = req.params;
  for (i = 0; i < projects.length; i++) {
    if (projects[i].id == id) {
      projects.splice(i, 1);
    }
    break;
  }
  return res.send();
});

server.post("/projects/:id/tasks", checkIdExistsInProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projects.find(element => {
    if (element.id === id) {
      element.task.push(title);
    }
  });
  return res.json(projects);
});
server.listen(3001);

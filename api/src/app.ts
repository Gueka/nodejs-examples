
import express from 'express';
import { Store } from './service/store';

const app = express();
const port = 3000;
const store = Store.getInstance();

// Use express json middleware so it transform the request into json.
app.use(express.json());


app.get('/ping', (req, res) => {
  res.send({code:200, message:'Pong!'});
});

app.get('/article/:id', (req, res) => {
  let id = req.params.id;
  console.log(`Getting article with id ${id}`);
  let article = store.getArticle(id);
  if(article == undefined){
    console.warn("Request id not found.");
    res.status(404).send({status: 404, message:`Article with id ${id} was not found.`});
  }else{
    res.send(article);
  }
});

app.post('/article', (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let link = req.body.link;
  let newArticle = store.setArticle(title, description, link);

  if(newArticle != null){
    res.send({code:200, message:`New article has been created.`, article: newArticle});
  }else{
    res.status(400).send({code:400, message:'Missing a mandatory parameter: title, description or link'})
  }
});

app.put('/article/:id', (req, res) => {
  let id = req.params.id;
  let title = req.body.title;
  let description = req.body.description;
  let link = req.body.link;

  const article = store.updateArticle(id, title, description, link);
  if(article != undefined){
    res.send({code:200, message:`Article id ${id} has been updated.`, article: article});
  }else{
    res.status(404).send({code:404, message:`Article with id ${id} was not found`});
  }
});

app.delete('/article/:id', (req, res) => {
  let id = req.params.id;
  if(store.deleteArticle(id)){
    res.send({code:200, message:`Article id ${id} has been deleted.`});
  }else{
    res.status(404).send({code:404, message:`Article with id ${id} was not found`});
  }
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});

export default app;
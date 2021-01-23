
import express from 'express';
import { Store } from './service/store';

/*
  This app typescript file was create as an example of an CRUD (Create, Read, Update and Delete) API build with nodejs using expressjs.
  If you are familiar with postman you can import the postman_collection.json found in the docs folder,
  that way you will found much easier to test some request examples for this API.

  This API is an example of a backend service, imagine the requirement for a simple web page that shows articles as cards,
  it could contain a title, a description, a link to the article, and in the future an image.

  I wrote an article about this process and you can find it here: https://medium.com/p/93049979f1aa
*/

const app = express();
const port = 3000;
// Initialize of Store service singleton
const store = Store.getInstance();

// Use express json middleware so it transform the request into json.
app.use(express.json());

// Simple test method PING to make sure the API is working
app.get('/ping', (req, res) => {
  res.send({code:200, message:'Pong!'});
});

// Using method .get we are able to expose a GET API to retrieve an article by it's id.
// Web browser use GET method to open web pages. Ex: http://localhost:3000/article/379acb20-fe70-4ecc-a814-633c587df0b7
app.get('/article/:id', (req, res) => {
  let id = req.params.id;
  console.log(`Getting article with id ${id}`);
  // Use the store service to retrieve the article requested.
  let article = store.getArticle(id);
  // Validate if the article exist
  if(article == undefined){
    console.warn("Request id not found.");
    // status is used to set the http status code to be return
    // send will send any json formatted response
    res.status(404).send({status: 404, message:`Article with id ${id} was not found.`});
  }else{
    // Return a 200 with the article.
    res.send({status:200, message:`Article with id ${id} was found.`, article:article});
  }
});

// Expose post method to create a new article, a new ID will be generated
app.post('/article', (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let link = req.body.link;
  // Send data to store new article in our service layer
  let newArticle = store.setArticle(title, description, link);
  if(newArticle != null){
    // Successful article created, we return it with the id assigned
    res.send({code:200, message:`New article has been created.`, article: newArticle});
  }else{
    // If any mandatory parameter is missing we return a 400 error
    console.warn("Missing mandatory parameter.");
    res.status(400).send({code:400, message:'Missing a mandatory parameter: title, description or link'})
  }
});

// PUT method is used to update an existing article with the data provided.
// only the id is mandatory, if the id is not found in the store it will return a 404 NOT_FOUND status code
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

// DELETE method is used to delete an existing article.
// only the id is mandatory, if the id is not found in the store it will return a 404 NOT_FOUND status code
app.delete('/article/:id', (req, res) => {
  let id = req.params.id;
  if(store.deleteArticle(id)){
    res.send({code:200, message:`Article id ${id} has been deleted.`});
  }else{
    res.status(404).send({code:404, message:`Article with id ${id} was not found`});
  }
});

// Start our web service to listen in the port provided
app.listen(port, () => {
  // You will find some logs with `` instead of "", this way I can use ${} to log variables
  return console.log(`Server is listening on ${port}`);
});

export default app;
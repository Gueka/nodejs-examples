import app from '../src/app';
import { Store, Article } from '../src/service/store';
import chai from 'chai';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);

// Our test container, here we will define the integration test for the API
describe('API article test', () => {

  // We need a test property to reference in our cases
  let article:Article;

  // We set a default article in our store (memory db), to be able to test GET, PUT and DELETE methods
  before(function() {
    console.log("Test initialization");
    const title = "Get article";
    const desc = "This test is to ensure an article is stored and retrieved.";
    article = Store.getInstance().setArticle(title, desc, "http://localhost:80/test");
  });

  // Testing post to ensure an article is created
  it('should create a new article to /article/', async function () {
    return chai.request(app)
      .post('/article/')
      .send({
        "title":"Title test",
        "description": "Some example description",
        "link": "http://localhost:80/test"
      })
      .then(res => {
        chai.expect(res.body.code).to.eql(200);
        chai.expect(res.body.message).to.eql('New article has been created.');
      })
  });
  it('should FAIL to create a new article and returns a BAD_REQUEST status', async function () {
    return chai.request(app)
      .post('/article/')
      .send({
        "title":"Title test",
        "link": "http://localhost:80/test"
      })
      .then(res => {
        chai.expect(res.status).to.eql(400);
        chai.expect(res.body.message).to.eql('Missing a mandatory parameter: title, description or link');
      })
  });


  // Test to search article by id
  it('should GET a created article by id to /article/:id', async function () {
    return chai.request(app).get('/article/' + article.getId())
      .then(res => {
        chai.expect(res.body.article.title).to.eql(article.getTitle());
        chai.expect(res.body.article.description).to.eql(article.getDescription());
      });
  });
  it('should FAIL to GET a created article by random id', async function () {
    let randomString = Math.random().toString(36).replace(/[^a-z]+/g, '');
    return chai.request(app).get('/article/' + randomString)
      .then(res => {
        chai.expect(res.status).to.eql(404);
      });
  });
  it('should GET all created articles /articles', async function () {
    return chai.request(app).get('/articles')
      .then(res => {
        chai.expect(res.status).to.eql(200);
        chai.expect(res.body.list.length).to.eql(2);
      });
  });

  // Test of updating part of an article
  it('should PUT or update a created article by id /article/:id', async function () {
    let title = "New title";
    let desc = "New description to test update.";
    return chai.request(app).put('/article/' + article.getId())
      .send({
        "title": title,
        "description": desc,
        "link": "http://localhost:80/test"
      })
      .then(res => {
        chai.expect(res.body.article.title).to.eql(title);
        chai.expect(res.body.article.description).to.eql(desc);
      });
  });
  it('should FAIL to PUT or update a created article by id /article/:id', async function () {
    let title = "New title";
    let randomString = Math.random().toString(36).replace(/[^a-z]+/g, '');
    return chai.request(app).put('/article/' + randomString)
      .send({
        "title-wrong": title,
      })
      .then(res => {
        chai.expect(res.status).to.eql(404);
        chai.expect(res.body.message).to.eql(`Article with id ${randomString} was not found`);
      });
  });


  // Delete an article test
  it('should DELETE a created article by id /article/:id', async function () {
    return chai.request(app).delete('/article/' + article.getId())
      .send()
      .then(res => {
        chai.expect(res.body.code).to.eql(200);
        chai.expect(res.body.message).to.eql(`Article id ${article.getId()} has been deleted.`);
      });
  });
  it('should FAIL to DELETE a created article by id /article/:id', async function () {
    let randomString = Math.random().toString(36).replace(/[^a-z]+/g, '');
    return chai.request(app).delete('/article/' + randomString)
      .send()
      .then(res => {
        chai.expect(res.status).to.eql(404);
        chai.expect(res.body.message).to.eql(`Article with id ${randomString} was not found`);
      });
  });
});
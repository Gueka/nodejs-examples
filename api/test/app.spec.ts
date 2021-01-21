import app from '../src/app';
import { Store, Article } from '../src/service/store';
import chai from 'chai';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('API article test', () => { // the tests container 

  let article:Article;

  before(function() {
    const title = "Get article";
    const desc = "This test is to ensure an article is stored and retrieved.";
    article = Store.getInstance().setArticle(title, desc, "http://localhost:80/test");
  });

  it('should create a new article /article/', async function () {
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

  it('should GET a created article by id /article/:id', async function () {
    return chai.request(app).get('/article/' + article.getId())
      .then(res => {
        chai.expect(res.body.title).to.eql(article.getTitle());
        chai.expect(res.body.description).to.eql(article.getDescription());
      });
  });

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

  it('should DELETE a created article by id /article/:id', async function () {
    return chai.request(app).delete('/article/' + article.getId())
      .send()
      .then(res => {
        console.log(res.body);
        chai.expect(res.body.code).to.eql(200);
        chai.expect(res.body.message).to.eql(`Article id ${article.getId()} has been deleted.`);
      });
  });
});
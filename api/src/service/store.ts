
export class Article {
    id: string;
    title: string;
    description: string;
    link: string;
  
    constructor(id: string, title: string, description:string, link:string) {
      this.id = id;
      this.title = title;
      this.description =  description;
      this.link = link;
    }
  
    getId():string{
        return this.id;
    }
    getTitle():string{
        return this.title;
    }
    getDescription():string{
        return this.description;
    }
    getLink():string{
        return this.link;
    }

    setTitle(title: string){
        this.title = title;
    }
    setDescription(description: string){
        this.description = description;
    }
    setLink(link: string){
        this.link = link;
    }
}
const { v4: uuidv4 } = require("uuid");

export class Store {

    private static instance: Store;
    private map = new Map();

    private constructor() {
    }
  
    public static getInstance(): Store {
      if (!Store.instance) {
        Store.instance = new Store();
      }
  
      return Store.instance;
    }


    public getArticle(id: string): Article{
        return this.map.get(id);
    }
    
    public setArticle(title: string, description:string, link:string): Article {
        let id = this.generateID();
        let article = new Article(id, title, description, link);
        this.map.set(id, article);

        return article;
    }

    updateArticle(id: string, title: string, description:string, link:string): boolean {
        let article = this.map.get(id);
        if(title != undefined){
            article.setTitle(title);
        }
        if(description != undefined){
            article.setDescription(description);
        }
        if(link != undefined){
            article.setLink(link);
        }

        return article;
    }

    deleteArticle(id: string): boolean {
        this.map.delete(id);
        return true;
    }
    
    private generateID():string {
        return uuidv4();
    }
}
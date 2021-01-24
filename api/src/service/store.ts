

/*
    This is our model class Article, also know as definition or DTO object
*/
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
// Library used to generate Universal unique identifiers. https://en.wikipedia.org/wiki/Universally_unique_identifier
const { v4: uuidv4 } = require("uuid");

/*
    The Store class is using a design pattern call Singleton.
    Singletons are used to have a single instance of this objects across all the application
    It force to use the static method getInstance and hide it's contrutor so none can initialize another Store class (! new Store());
    For more information about this pattern go here: https://en.wikipedia.org/wiki/Singleton_pattern

    Instead of a map propery the proper thing to do would be to change the map to a database connection.
*/
export class Store {

    getall(): Article[] {
        let list = Array.from( this.map.values() );
        return list;
    }

    private static instance: Store;
    // This is a very, very simple in memory store. https://en.wikipedia.org/wiki/Storage_(memory)
    // In memory means that if the application is restarted or stopped, the data will be lost.
    private map = new Map();

    private constructor() {}
    public static getInstance(): Store {
      if (!Store.instance) {
        Store.instance = new Store();
      }
      return Store.instance;
    }

    // Exposing a read method to retrieve an article
    public getArticle(id: string): Article{
        if(this.map.has(id)){
            return this.map.get(id);
        }
        return null;
    }
    
    // Exposing a store article method, some basic validation for mandatory parameters.
    // If we have a database connection we should check if the characters are valid to avoid SQL injections https://en.wikipedia.org/wiki/SQL_injection
    public setArticle(title: string, description:string, link:string): Article {
        if(title == null || description == null || link == null){
            return null;
        }

        let id = this.generateID();
        let article = new Article(id, title, description, link);
        this.map.set(id, article);

        return article;
    }

    // Exposing a method to update an existing article properties
    updateArticle(id: string, title: string, description:string, link:string): boolean {
        let article = this.map.get(id);
        if(article != null){
            if(title != undefined){
                article.setTitle(title);
            }
            if(description != undefined){
                article.setDescription(description);
            }
            if(link != undefined){
                article.setLink(link);
            }
        }

        return article;
    }

    // Exposing method to delete an existing article
    deleteArticle(id: string): boolean {
        if(this.map.has(id)){
            this.map.delete(id);
            return true;
        }
        return false;
    }
    
    private generateID():string {
        return uuidv4();
    }
}
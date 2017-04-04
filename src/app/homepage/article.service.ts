import { Injectable } from '@angular/core';
import { FirebaseObjectObservable,AngularFire} from 'angularfire2';

@Injectable()
export class ArticleService {
  article: FirebaseObjectObservable<any>;
  constructor(private af: AngularFire) { }

  getArticle(aritcleId): Promise<FirebaseObjectObservable<any>>{

    this.af.database.object('/ARTICLES/'+aritcleId).subscribe(article => {
      this.article=article;
      localStorage.setItem('currentArticle', JSON.stringify({anArticle: article}));
      });

    return Promise.resolve(this.article);

}

}
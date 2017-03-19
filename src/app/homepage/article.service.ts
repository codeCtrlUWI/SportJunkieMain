import { Injectable } from '@angular/core';
import { FirebaseObjectObservable,AngularFire} from 'angularfire2';

@Injectable()
export class ArticleService {
  article: FirebaseObjectObservable<any>;
  constructor(private af: AngularFire) { }

  getArticle(aritcleID): Promise<FirebaseObjectObservable<any>>{

    this.af.database.object('/ARTICLES/'+aritcleID).subscribe(article => {
      this.article=article;

      });

    return Promise.resolve(this.article);

}

}

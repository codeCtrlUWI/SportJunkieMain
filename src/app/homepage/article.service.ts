import { Injectable } from '@angular/core';
import { FirebaseObjectObservable,AngularFire} from 'angularfire2';

@Injectable()
export class ArticleService {
  article: FirebaseObjectObservable<any>;
  constructor(private af: AngularFire) { }

  getArticle(aritcleId): void{

    this.af.database.object('/ARTICLES/'+aritcleId).subscribe(article => {
      this.article=article;
      sessionStorage.setItem('currentArticle', JSON.stringify({anArticle: article}));
      });

}

setArticleImages(articleImages){
  sessionStorage.setItem('images', JSON.stringify({articleImages: articleImages}));
}

}
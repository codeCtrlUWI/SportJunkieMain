import {Component, OnInit, ViewEncapsulation, Inject} from '@angular/core';
import {FirebaseApp, AngularFire, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})


export class HomepageComponent {



  firebaseApp;
  _opened;
    articles: FirebaseListObservable<any>;
    article: FirebaseObjectObservable<any>;

  constructor(private af:AngularFire, private router:Router, @Inject(FirebaseApp) firebaseApp:any) {

    this.firebaseApp= firebaseApp;
   this._opened= false;

      this.articles=this.af.database.list('/ARTICLES');


      this.articles.subscribe(
          val => console.log(val)
      );

  }
    viewArticle(articleId){
        this.router.navigate(['view']);
    }


  logout() {
    this.af.auth.logout().then(
        (success) => {
          this.router.navigate(['/signup']);
          this.af.auth.unsubscribe();
          window.location.reload();
        })
  }



}

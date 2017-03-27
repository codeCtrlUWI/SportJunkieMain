import {Component, OnInit, ViewEncapsulation, Inject, Pipe, ChangeDetectionStrategy} from '@angular/core';
import {FirebaseApp, AngularFire, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {ArticleService} from "../homepage/article.service";
import "rxjs/add/operator/map";
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'app-football',
  templateUrl: './football.component.html',
  styleUrls: ['./football.component.css'],
})




export class FootballComponent implements OnInit{



  firebaseApp;
  _opened;
  featuredArticles: FirebaseListObservable<any>;
  articles: FirebaseListObservable<any>;
  article: FirebaseObjectObservable<any>;
  orderBy;
  componentCompleted:boolean=false;
  uid;

  constructor(private as:ArticleService, private af:AngularFire, private router:Router, @Inject(FirebaseApp) firebaseApp:any) {

    this.firebaseApp= firebaseApp;
    this._opened= false;

    this.articles=this.af.database.list('/ARTICLES',{
      query:{
        limitToLast:10000000
      }
    }).map((array)=>array.reverse())as FirebaseListObservable<any[]>;


    this.articles.subscribe(
        val => console.log(val)
    );


    this.featuredArticles=this.af.database.list('/ARTICLES',{
      query:{
        orderByChild:'numberOfClicks'
      }
    }).map((array)=>array.reverse())as FirebaseListObservable<any[]>;

    this.featuredArticles.subscribe(
        val => console.log(val)
    );



  }

  ngOnInit(){
    this.componentCompleted=true;
    this.af.auth.subscribe(authData=>this.uid=authData.uid);
    console.log(this.uid);
  }

  viewArticle(articleId){
    this.as.getArticle(articleId);
    this.router.navigate(['football/view/',articleId]);
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

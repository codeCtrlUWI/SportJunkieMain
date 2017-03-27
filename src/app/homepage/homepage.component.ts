import {
    Component, OnInit, ViewEncapsulation, Inject, Pipe, ChangeDetectionStrategy,
    ChangeDetectorRef, ApplicationRef, Input, NgZone
} from '@angular/core';
import {FirebaseApp, AngularFire, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {ArticleService} from "./article.service";
import "rxjs/add/operator/map";
declare var $: any;
import { OnChanges } from '@angular/core';
import * as firebase from 'firebase'


@Component({
  moduleId: module.id,
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})




export class HomepageComponent implements OnInit{



  firebaseApp;
  _opened;
    featuredArticles: any[];
    articles:any[];
    multipleArticles: FirebaseListObservable<any>;
    uid;
    show=0;
    firstName;
    lastName;
    pushArray:any[];

    user: FirebaseObjectObservable<any>;

  constructor(private as:ArticleService, private af:AngularFire, private router:Router, @Inject(FirebaseApp) firebaseApp:any,private zone: NgZone) {

      this.firebaseApp = firebaseApp;


      var articlesref= firebase.database().ref('/ARTICLES');

      articlesref.on('value', (snap) => {
          // snap.val() comes back as an object with keys
          // these keys need to be come "private" properties
          let data = snap.val();
          let dataWithKeys = Object.keys(data).map((key) => {
              var obj = data[key];
              obj._key = key;
              return obj;
          });
          this.articles=dataWithKeys; // This is a synchronized array
          console.log(this.articles);
          this.articles.reverse();
      });
  }

  ngOnInit(){
      var that = this;
      this.af.auth.subscribe(authData=>this.uid = authData.uid);
      console.log(this.uid);
      this.show = 1;

      this.user = this.af.database.object('/USERS/' + this.uid, {preserveSnapshot: true});
      this.user.subscribe(snapshot => {
          this.firstName = snapshot.val().firstName;
          this.lastName = snapshot.val().lastName;
      });


      var rArray=[];

          var farticlesref= firebase.database().ref('/ARTICLES');
      farticlesref.orderByChild("numberOfClicks").on("value",function(data) {
          rArray=[];
          data.forEach(function(snapshot) {
              let featuredData= snapshot.val();
              rArray.push(featuredData);
              return false;
              });
              console.log(rArray);
          that.featuredArticles= rArray;
          that.featuredArticles.reverse();
          return false;
          });
      };














    viewArticle(articleId){
        this.as.getArticle(articleId);
        this.router.navigate(['home/view/',articleId]);
    }

    viewProfile(){
        this.router.navigate(['/profile']);
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

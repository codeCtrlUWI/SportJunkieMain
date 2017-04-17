import {Component, OnInit, ViewEncapsulation, Inject, Pipe, ChangeDetectionStrategy} from '@angular/core';
import {FirebaseApp, AngularFire, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2";
import {Router} from "@angular/router";
import {ArticleService} from "../homepage/article.service";
import "rxjs/add/operator/map";
declare var $: any;
import * as firebase from 'firebase'

@Component({
  moduleId: module.id,
  selector: 'app-cricket',
  templateUrl: './cricket.component.html',
  styleUrls: ['./cricket.component.css'],
  encapsulation: ViewEncapsulation.None
})




export class CricketComponent implements OnInit{




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
  galleryImages;
  images;
  scores;

  user: FirebaseObjectObservable<any>;

  constructor(private as:ArticleService, private af:AngularFire, private router:Router, @Inject(FirebaseApp) firebaseApp:any) {


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
        if(snapshot.val().category=='Cricket'){
          let featuredData= snapshot.val();
          rArray.push(featuredData);
          return false;
        }
      });
      console.log(rArray);
      that.featuredArticles= rArray;
      that.featuredArticles.reverse();
      return false;
    });


    var score= firebase.database().ref('/SCORES');
    score.on('value', (snap) => {
      // snap.val() comes back as an object with keys
      // these keys need to be come "private" properties
      let data = snap.val();
      let dataWithKeys = Object.keys(data).map((key) => {
        var obj = data[key];
        obj._key = key;
        return obj;
      });
      this.scores=dataWithKeys; // This is a synchronized array
      console.log(this.scores);
      this.scores.reverse();
    });

  };














  viewArticle(articleID){
    var galleryIDS= firebase.database().ref('/ARTICLES/'+articleID+'/galleryID');
    galleryIDS.once('value').then(snapshotter=>{
      var images=[];
      var galleryRef= firebase.database().ref('/GALLERY/'+snapshotter.val());
      galleryRef.once('value').then(snapshots=>{
        snapshots.forEach(snapshot=>{
          images.push(snapshot.val());
          console.log(snapshot.val());
        })
      }).then(()=>{
        this.images=images;
        console.log(this.images.length);
        console.log(images.length);
        this.as.setArticleImages(images);
      }).then(()=>{
        this.as.getArticle(articleID);
        this.router.navigate(['/view/',articleID]);
      })

    })

  }

  viewProfile(){
    this.router.navigate(['/profile']);
  }

  increaseClicks(articleID,numberOfClicks,category){
    var databaseRef= firebase.database().ref('/ARTICLES').child(articleID).child('numberOfClicks');

    databaseRef.transaction(function(clicks) {

      return (clicks || 0) + 1;

    });

    var databaseRef= firebase.database().ref('/MICRO-ARTICLES').child(articleID).child('numberOfClicks');

    databaseRef.transaction(function(clicks) {

      return (clicks || 0) + 1;

    });

    var userRef= firebase.database().ref('/USERS').child(this.uid).child('categoriesClicked').child(category);

    userRef.transaction(function (clicks) {
      return (clicks||0)+1;
    })


  }


  logout() {
    this.af.auth.logout().then(
        (success) => {
          this.router.navigate(['/signin']);
          this.af.auth.unsubscribe();
          window.location.reload();
        })
  }


}

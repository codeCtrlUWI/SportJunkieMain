import 'rxjs/add/operator/switchMap';
import {Component, OnInit, ElementRef, OnDestroy, AfterViewChecked, NgZone, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params, Router, NavigationEnd, NavigationStart} from '@angular/router';
import { FirebaseObjectObservable, AngularFire} from 'angularfire2';
import {Location }  from '@angular/common';
import {ArticleService} from "../homepage/article.service";
import * as firebase from 'firebase'
declare var $: any;
declare var Galleria: any;

@Component({
  moduleId: module.id,
  selector: 'app-view',
  templateUrl: './view-article.component.html',
  styleUrls:['./view-article.component.css'],
  encapsulation:ViewEncapsulation.None
})



export class ViewArticleComponent implements OnInit{


  uid;
  show=0;
  firstName;
  lastName;
  user: FirebaseObjectObservable<any>;
  scrollUp;
  authorProfilePic;
  author:any[];
  object;
  authorProfile: FirebaseObjectObservable<any>;
  userFavorite: FirebaseObjectObservable<any>;
  removeUserFavorite;
  articleID;
  favorited=0;
  addUserFavorite;
  x;
  favorites;
  keys:any[];
  images: any[];
  galleryImages;
  showGallery=1;



  article;

  constructor(private af:AngularFire, private as: ArticleService, private route:ActivatedRoute, private location: Location,private element: ElementRef, private router:Router){
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    })


  }


  ngOnInit(){

    this.af.auth.subscribe(authData=>this.uid = authData.uid);
    this.show = 1;

    this.user = this.af.database.object('/USERS/' + this.uid, {preserveSnapshot: true});
    this.user.subscribe(snapshot => {
      this.firstName = snapshot.val().firstName;
      this.lastName = snapshot.val().lastName;
    });

    var currentUser = JSON.parse(sessionStorage.getItem('currentArticle'));
    this.article= currentUser.anArticle;

    for(var i in this.article){
      if(i=='authorUID'){
        this.author= this.article[i];
        this.authorProfile= this.af.database.object('/USERS/'+this.author,{preserveSnapshot:true});
        this.authorProfile.subscribe(snapshot=>{
          this.authorProfilePic= snapshot.val().profilePicURL;
        })
      }
      if(i=='articleID'){
        this.articleID= this.article[i];
      }
    }

    this.favorites= this.af.database.object('/USERS/'+this.uid+'/favorites/');
    this.favorites.subscribe(()=>{
      var ref= firebase.database().ref('/USERS/'+this.uid+'/favorites/');
      ref.once('value').then(snapshots=>{
        snapshots.forEach(snapshot=>{
          if(this.articleID==snapshot.val()){
            this.favorited=1;
          }
        });
      });
    });

    var getImages= JSON.parse(sessionStorage.getItem('images'));
    this.images= getImages.articleImages;


         var galleryIDS= firebase.database().ref('/ARTICLES/'+this.articleID+'/galleryID');
      galleryIDS.once('value').then(snapshotter=>{
        var images=[];
        var bgimage=[];
        var galleryRef= firebase.database().ref('/GALLERY/'+snapshotter.val());
        galleryRef.once('value').then(snapshots=>{
          snapshots.forEach(snapshot=>{
            images.push(snapshot.val());
            console.log(snapshot.val());
            bgimage.push({src:snapshot.val()})
          })
        }).then(()=>{
          if(images!=null){
            this.images=images;
            this.as.setArticleImages(images);
          }
          console.log(bgimage);
          Galleria.loadTheme('https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.6/themes/classic/galleria.classic.min.js');
          Galleria.configure({
            lightbox: true,
            transition: 'fade',
            autoplay: 4000
          });
          Galleria.run('.galleria');
          if(images.length==0){
            this.showGallery=0;
          }
          $("#background").vegas({
            slides:bgimage,
            overlay:'https://cdnjs.cloudflare.com/ajax/libs/vegas/2.4.0/overlays/06.png'

          });
        });

    this.addUserFavorite= this.af.database.object('/USERS/'+this.uid+'/favorites/',{preserveSnapshot:true});



  })
  }



  goBack(){
    this.location.back();
  }

  addToFavorite(articleID){
    this.x=0;
    var ref= firebase.database().ref('/USERS/'+this.uid+'/favorites/');
    ref.once('value')
        .then((snapshots) => {
          this.x=0;
          snapshots.forEach(snapshot=>{
              if(snapshot.val()!=articleID){
                this.addUserFavorite.update({[this.x]:snapshot.val()});
                this.x= this.x+1;
              }else{
                this.addUserFavorite.update({[snapshot.key]:articleID});
              }

            });
          this.addUserFavorite.update({[this.x]:articleID});
          });
        }




  removeFavorite(articleID){

  this.removeUserFavorite= this.af.database.object('/USERS/'+this.uid+'/favorites/',{preserveSnapshot:true});
  var ref= firebase.database().ref('/USERS/'+this.uid+'/favorites/');
  ref.once('value')
      .then((snapshots) => {
        this.x=0;
        snapshots.forEach(snapshot=>{
          if(snapshot.val()===articleID){
            console.log(snapshot.val());
            this.removeUserFavorite= this.af.database.object('/USERS/'+this.uid+'/favorites/'+snapshot.key);
            this.removeUserFavorite.remove();
            this.x= this.x+1;
          }
        })
      }).then(()=>{
    this.removeUserFavorite= this.af.database.object('/USERS/'+this.uid+'/favorites/',{preserveSnapshot:true});
    var ref= firebase.database().ref('/USERS/'+this.uid+'/favorites/');
    ref.once('value')
        .then((snapshots) => {
          this.x=0;
          snapshots.forEach(snapshot=>{
            if(snapshot.key){
              console.log(snapshot.val());
              this.removeUserFavorite.update({[this.x]:snapshot.val()});
              console.log(this.x);
              this.x= this.x+1;
            }
          });
          this.removeUserFavorite= this.af.database.object('/USERS/'+this.uid+'/favorites/'+this.x,{preserveSnapshot:true});
          this.removeUserFavorite.remove();
        });
  });







    this.favorited=0;
  }

  ngOnDestroy(){
this.favorites.subscribe().unsubscribe();
  }



  viewProfile(){
    this.router.navigate(['/profile']);
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
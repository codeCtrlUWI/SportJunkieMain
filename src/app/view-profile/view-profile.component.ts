import {
    Component, OnInit, ElementRef, Inject, ViewEncapsulation, AfterViewChecked, DoCheck,
    OnDestroy
} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {ArticleService} from "../homepage/article.service";
import {AngularFire, FirebaseApp} from "angularfire2/index";
import {CredentialService} from "./credential.service";
declare var $: any;
import { UUID } from 'angular2-uuid';
import * as firebase from 'firebase'
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {Message, ConfirmationService} from "primeng/primeng";

@Component({
  moduleId: module.id,
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'],
  providers: [ConfirmationService],
  encapsulation: ViewEncapsulation.None,
})
export class ViewProfileComponent implements OnInit,AfterViewChecked,DoCheck,OnDestroy {

  firstName;
  lastName;
  profilePic;
  email;
  uid;
  userEmail;
  user;
  file;
  filename;
  firebaseApp;
  provider;
  Password;
  storage;
  path;
  storageref;
  uuid;
  imageLink;
  googleProvider;
  msgs: Message[] = [];
  progress;
  favArticles:any[];
  keys:any[];
  data:any;
  cricket;
  football;
  swimming;
  display=true;
  isDataAvailable: boolean = false;
  nullcheck;
  removeUserFavorite;
  x;


  public doughnutChartLabels:string[] = ['Cricket', 'Football', 'Swimming'];
  public doughnutChartData:number[] = [0, 0, 0];
  public doughnutChartType:string = 'doughnut';

  public options: any= {
    title: {
      display: true,
      text: 'Category History Statistics',
      fontColor:"#000000",
      fontSize:25,
      fontFamily:'Open Sans',
      padding:20,
    },
    defaultFontSize:400,
    defaults:{
      global:{
        defaultFontFamily:"Open Sans",
      }
    },
    legend:{
      labels:{
        fontSize : 19,
        fontFamily:'Open Sans',
        padding:40,
        fontStyle:'bold',
        fontColor:"#000000",
      },
      position:'bottom',
    }
  };

  constructor(private confirmationService: ConfirmationService,private credentials:CredentialService, private as: ArticleService, private af:AngularFire, private route:ActivatedRoute, private router:Router,@Inject(FirebaseApp) firebaseApp:any,
              ) {



    this.msgs=[];
    this.firebaseApp= firebaseApp;
    this.uuid = UUID.UUID();

    this.af.auth.subscribe(authData=>this.uid=authData.uid);
    console.log(this.uid);
    this.user = this.af.database.object('/USERS/'+this.uid, { preserveSnapshot: true });
    this.user.subscribe(snapshot => {
      this.firstName= snapshot.val().firstName;
      this.lastName= snapshot.val().lastName;
      this.userEmail= snapshot.val().email;
      this.profilePic= snapshot.val().profilePicURL;
    });
    var that= this;
    var user = this.firebaseApp.auth().currentUser;
    if (user != null) {
      user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: " + profile.providerId);
        that.provider= profile.providerId;
      })
    }
    this.googleProvider = new firebase.auth.GoogleAuthProvider();
    this.googleProvider.addScope('profile');
    this.googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');


var keys=[];
    var that=this;


    var favSubscribe= this.af.database.object('/USERS/'+this.uid+'/favorites');

    favSubscribe.subscribe(()=>{
      var ref= firebase.database().ref('/USERS/'+this.uid+'/favorites/');
      ref.on('value', (snapshot) => {
        keys=[];
        console.log(snapshot.val());
        this.nullcheck= snapshot.val();
        for(var i in snapshot.val()){
          var articlesref= firebase.database().ref('/ARTICLES/'+snapshot.val()[i]);
          articlesref.once('value', (snap) => {
            keys.unshift(snap.val());
          });
        }
      return Promise.resolve(keys);
        });
      setTimeout(()=>{
        this.favArticles= keys;
      },300);
      });



    var cricketref= firebase.database().ref('/USERS/'+this.uid+'/categoriesClicked/Cricket');
    var footballref= firebase.database().ref('/USERS/'+this.uid+'/categoriesClicked/Football');
    var swimmingref= firebase.database().ref('/USERS/'+this.uid+'/categoriesClicked/Swimming');
    console.log(cricketref);

    var categorySubscribe= this.af.database.object('/USERS/'+this.uid+'/categoriesClicked');
    categorySubscribe.subscribe(()=>{

      cricketref.once('value',snapshot=>{
        this.cricket= snapshot.val();
        this.cricket= parseFloat(this.cricket);

      }).then(()=>{
        footballref.once('value',snapshot=>{
          this.football= snapshot.val();
          this.football= Number(this.football);
        });
      }).then(()=>{
        swimmingref.once('value',snapshot=>{
          this.swimming= parseInt(snapshot.val());
        });
      }).then(()=>{
        this.doughnutChartData = [this.cricket, this.football, this.swimming];
      }).then(()=>{
        this.isDataAvailable = true;
      })


    });



  }

  ngOnInit() {
  }

  ngAfterViewChecked(){

    $('#particleRow').particleground(
        {
          dotColor: 'black',
          lineColor:'#c91010'
        });
  }

  ngDoCheck() {

  }

  viewProfile(){
    this.router.navigate(['/profile']);
  }

  getFile(event:EventTarget) {
    let eventObj:MSInputMethodContext = <MSInputMethodContext> event;
    let target:HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files:FileList = target.files;
    this.file = files[0];
    this.filename = this.file.name;

    var reader = new FileReader();

    reader.onload = function (e:any) {
      $('#blah')
          .attr('src', e.target.result)
          .width(300)
          .height(200);
    };
    reader.readAsDataURL(this.file);
  }


  updateFirstName(){
    this.user.update({firstName:this.firstName})
        .then(()=>{
      this.msgs.push({severity:'success', summary:'First Name Updated', detail:'Your First Name has been changed!'});
    })
  }

  updateLastName(firstName){
    this.user.update({lastName:this.lastName}).then(()=>{
      this.msgs.push({severity:'success', summary:'Last Name Updated', detail:'Your Last Name has been changed!'});
    })
  }

  updateEmail(){
    var user = this.firebaseApp.auth().currentUser;
    var returnedEmail= this.credentials.returnEmail();
    var returnedPassword=  this.credentials.returnPassword();
    var credential = firebase.auth.EmailAuthProvider.credential(returnedEmail,returnedPassword);
    user.reauthenticate(credential).then(()=> {
      user.updateEmail(this.userEmail);
      this.msgs.push({severity:'success', summary:'Email Updated', detail:'Your Email has been changed!'});
    }, function(error) {
      this.msgs.push({severity:'error', summary:'Updating Email failed', detail:'An error occurred.'});
    });

    user.updateEmail(this.userEmail).then(()=> {
      this.user.update({email:this.userEmail});
    }, function(error) {
      // An error happened.
    });
    this.credentials.storeEmail(this.userEmail);
  }

  updatePassword(){
    console.log(this.Password);

    var user = this.firebaseApp.auth().currentUser;
    var returnedEmail= this.credentials.returnEmail();
    var returnedPassword=  this.credentials.returnPassword();
    var credential= firebase.auth.EmailAuthProvider.credential(returnedEmail,returnedPassword);
    user.reauthenticate(credential).then(()=> {
      user.updatePassword(this.Password);
      this.msgs.push({severity:'success', summary:'Password Updated', detail:'Password has been changed!'});
    }, function(error) {
      this.msgs.push({severity:'error', summary:'Updating Password failed', detail:'An error occurred.'});
    });
    user.updatePassword(this.Password).then(function() {
      // Update successful.
    }, function(error) {
      // An error happened.
    });
    this.credentials.storePassword(this.Password);
  }

  updateProfilePicture(){
    this.msgs.push({severity:'warn', summary:'Updating Profile Picture...', detail:'Please Wait'});
    this.storage = this.firebaseApp.storage().ref();
    this.path = "Profile Pictures/" + this.userEmail + "-" + this.uid + "-" + this.uuid;
    this.storageref = this.storage.child(this.path);
    var uploadTask = this.storageref.put(this.file);
    var that=this;

    var uploader = uploadTask.on('state_changed', function (snapshot) {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      that.progress=progress;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function (error) {
      this.msgs.push({severity:'error', summary:'Updating Profile Picture failed', detail:'An error occurred.'});
    }, function () {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      var imglink = uploadTask.snapshot.downloadURL;
      that.imageLink = imglink;
      that.user.update({profilePicURL:imglink});
      this.
      this.msgs.push({severity:'success', summary:'Profile Picture Updated', detail:'Profile Picture has been updated!'});
  });
  }

  deleteAccount(){
    this.confirmationService.confirm({
      header: 'SportJunkie Account Deletion...',
      message: 'Are you sure that you want to delete your account? :(',
      accept: () => {

    var user = this.firebaseApp.auth().currentUser;
    var that=this;

    if(this.provider=="google.com"){
      console.log("Hello");
      this.firebaseApp.auth().signInWithPopup(this.googleProvider).then(()=>{
        this.user.remove().then(()=>{
          user.delete().then(()=> {
            reloadAndRoute();
          }, function(error) {
            // An error happened.
          });
        });

      }, function(error) {
        // An error happened.
      });

    }else if(this.provider=="password"){
      var returnedEmail= this.credentials.returnEmail();
      var returnedPassword=  this.credentials.returnPassword();
      var credential = firebase.auth.EmailAuthProvider.credential(returnedEmail,returnedPassword);
      user.reauthenticate(credential).then(()=> {
        user.delete().then(function() {
          // User deleted.
        }, function(error) {
          // An error happened.
        });

      }, function(error) {
        // An error happened.
      });

      user.delete().then(function() {
        // User deleted.
      }, function(error) {
        // An error happened.
      });
      this.user.remove().then(()=>{
        this.msgs = [];
        this.msgs.push({severity:'info', summary:':(', detail:'Delete account in progress...'});
        setTimeout(()=>{
          reloadAndRoute();
        },1500);


      });

    }
    function reloadAndRoute(){
      that.router.navigate(['/signin']);
      location.reload();
    }
      }
    });




  }

  ngOnDestroy(){

  }


  viewArticle(articleID,category){
    if(category=='Cricket'){
      this.as.getArticle(articleID);
      this.router.navigate(['cricket/view/',articleID]);
    }else if(category=='Football'){
      this.as.getArticle(articleID);
      this.router.navigate(['football/view/',articleID]);
    }else if(category=='Swimming'){
      this.as.getArticle(articleID);
      this.router.navigate(['swimming/view/',articleID]);
    }

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

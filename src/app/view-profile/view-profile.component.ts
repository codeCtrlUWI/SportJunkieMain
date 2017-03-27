import {Component, OnInit, ElementRef, Inject} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {ArticleService} from "../homepage/article.service";
import {AngularFire, FirebaseApp} from "angularfire2/index";
import {CredentialService} from "./credential.service";
declare var $: any;
import { UUID } from 'angular2-uuid';
import * as firebase from 'firebase'
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

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
  passwordCheck;
  Password;
  storage;
  path;
  storageref;
  uuid;
  imageLink;
  googleProvider;

  constructor(private credentials:CredentialService, private as: ArticleService, private af:AngularFire, private route:ActivatedRoute, private router:Router,@Inject(FirebaseApp) firebaseApp:any) {
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
  }

  ngOnInit() {
    $('#particleRow').particleground(
    {
      dotColor: 'black',
          lineColor:'#c91010'
    });


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
    this.user.update({firstName:this.firstName});
  }

  updateLastName(firstName){
    this.user.update({lastName:this.lastName});
  }

  updateEmail(){
    var user = this.firebaseApp.auth().currentUser;
    var returnedEmail= this.credentials.returnEmail();
    var returnedPassword=  this.credentials.returnPassword();
    var credential = firebase.auth.EmailAuthProvider.credential(returnedEmail,returnedPassword);
    user.reauthenticate(credential).then(()=> {
      user.updateEmail(this.userEmail)
    }, function(error) {
      // An error happened.
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
    console.log(this.credentials.returnEmail(),
        this.credentials.returnPassword());
    var returnedEmail= this.credentials.returnEmail();
    var returnedPassword=  this.credentials.returnPassword();
    var credential= firebase.auth.EmailAuthProvider.credential(returnedEmail,returnedPassword);
    user.reauthenticate(credential).then(()=> {
      user.updatePassword(this.Password)
    }, function(error) {
      // An error happened.
    });
    user.updatePassword(this.Password).then(function() {
      // Update successful.
    }, function(error) {
      // An error happened.
    });
    this.credentials.storePassword(this.Password);
  }

  updateProfilePicture(){
    this.storage = this.firebaseApp.storage().ref();
    this.path = "Profile Pictures/" + this.userEmail + "-" + this.uid + "-" + this.uuid;
    this.storageref = this.storage.child(this.path);
    var uploadTask = this.storageref.put(this.file);
    var that=this;

    var uploader = uploadTask.on('state_changed', function (snapshot) {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
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
      // Handle unsuccessful uploads
    }, function () {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      var imglink = uploadTask.snapshot.downloadURL;
      console.log(imglink);
      that.imageLink = imglink;
      that.user.update({profilePicURL:imglink});
  });
  }

  deleteAccount(){
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
        reloadAndRoute();
      });

    }
    function reloadAndRoute(){
      that.router.navigate(['/signup']);
      location.reload();
    }




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

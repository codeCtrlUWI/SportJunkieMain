import {Component, Inject, OnInit, ViewEncapsulation} from "@angular/core";
import {AngularFire, FirebaseApp, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import * as firebase from 'firebase'
import { UUID } from 'angular2-uuid';
import {Message} from "primeng/primeng";
import {MdSnackBar} from '@angular/material';
import { ChangeDetectorRef } from '@angular/core';
import {CredentialService} from "../view-profile/credential.service";

declare var $:any;


@Component({
    moduleId: module.id,
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
    encapsulation: ViewEncapsulation.None
})



export class SignupComponent implements OnInit{

    msgs: Message[] = [];

    file;
    filename;
    Fname;
    Lname;


    users:FirebaseObjectObservable<any[]>;

    afState:AngularFire;
    googleProvider;
    firebaseApp;
    firstName;
    lastName;
    emailAndPass;
    email;
    password;
    profilepic;
    uid;
    progress;


    imageLink;
    storage;
    path;
    storageref;
    uuid;
    indicator;
    tokenData;
    googleUID;
    data;
    authorExist;

    private  pathToImg;

    constructor(private credentials:CredentialService, private af:AngularFire, private router:Router, @Inject(FirebaseApp) firebaseApp:any,private ref: ChangeDetectorRef) {

        this.msgs=[];
        this.afState = this.af;
        this.googleProvider = new firebase.auth.GoogleAuthProvider();
        this.googleProvider.addScope('profile');
        this.googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
        this.googleProvider.setCustomParameters(
            {prompt:'select_account'}

        );
        this.firebaseApp = firebaseApp;
        this.indicator=false;
        this.emailAndPass = new firebase.auth.EmailAuthProvider();

        this.uuid = UUID.UUID();


         this.pathToImg= ("assets/mainLogo.png");

        let user= firebaseApp.auth().currentUser;

    }

    ngOnInit(){
        this.ref.markForCheck();
    }


    googleSignup(event) {

        var that = this;
        this.firebaseApp.auth().signInWithPopup(this.googleProvider)
            .then(function (result) {
                var token = result.credential.accessToken;
                that.credentials.storeOAuthToken(token);
                console.log(token);
                console.log(result);
                event.preventDefault();
                $.getJSON('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token, function (data) {
                    that.tokenData = data;
                    that.firstName = data.given_name;
                    that.lastName = data.family_name;
                    that.email = data.email;
                    that.profilepic = data.picture;
                    that.afState.auth.subscribe(authData=>
                        that.uid = authData.uid,
                    );
                    that.googleUID = data.id;
                    console.log(that.firstName);
                    console.log(that.lastName);
                    console.log(that.email);
                    console.log(that.profilepic);
                    console.log(that.uid);
                    setUser();
                })
            })

            .then((result)=> {
            })
            .catch(function (error) {
                console.log(error);
            });

        function setUser() {
            var snaps = that.afState.database.object('USERS/' + that.uid, {preserveSnapshot: true});

            var snapref = firebase.database().ref('/USERS/' + that.uid);
            snapref.once('value').then(snapshot=> {
                    console.log(snapshot.val());
                    if (snapshot.val()!=null) {
                        that.router.navigate(['/home']);
                        location.reload();
                    } else if (snapshot.val()==null) {
                        that.afState.database.object('USERS/' + that.uid).update(
                            {
                                email: that.email,
                                firstName: that.firstName,
                                lastName: that.lastName,
                                profilePicURL: that.profilepic,
                                uid: that.uid,
                                author: false

                            }
                        ).then(()=>{
                            that.router.navigate(['/home']);
                            location.reload();
                        });
                    }
                }
            )
        }
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
                .width(150)
                .height(100);
        };
        reader.readAsDataURL(this.file);

    };


    onSubmit(formData, event:Event) {
        event.preventDefault();

        //For getting profilepicURL

        if(this.filename==null){
            this.imageLink="https://firebasestorage.googleapis.com/v0/b/official-sjapp.appspot.com/o/Profile%20Pictures%2Fplaceholder_person.png?alt=media&token=954a2e28-802e-4b5d-9381-aac26c521d20";
        }

        this.email = formData.value.email;
        this.Fname = formData.value.Fname;
        this.Lname = formData.value.Lname;

        var that = this;
        this.firebaseApp.auth().createUserWithEmailAndPassword(formData.value.email, formData.value.password)
            .catch(function (error) {
            console.log(error.code);
                if(error.code=="auth/email-already-in-use"){
                    that.msgs = [];
                    that.msgs.push({severity:'error', summary:'Account Creation Failed', detail:'Email already in use.Please try another.'});
                }else if(error.code=="auth/invalid-email"){
                    that.msgs = [];
                    that.msgs.push({severity:'error', summary:'Account Creation Failed', detail:'Invalid email.\nPlease use a valid email.'});
                }
        })
            .then(result=> {
                that.uid = result.uid;
                console.log(that.uid
                )
            }).then(function upload() {
                if (that.filename==null){
                    setUser();
                    return;
                }else
            that.storage = firebase.storage().ref();
            that.path = that.path = "Profile Pictures/" + that.email + "-" + that.uid + "-" + that.uuid;
            that.storageref = that.storage.child(that.path);
            var uploadTask = that.storageref.put(that.file);

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
                // Handle unsuccessful uploads
            }, function () {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                var imglink = uploadTask.snapshot.downloadURL;
                console.log(imglink);
                that.imageLink = imglink;
                setUser();
            })
        });
        function setUser() {
            if (that.imageLink == null) {
                setTimeout(setUser(), 200)
            } else
                console.log(that.imageLink);
            that.afState.database.object('USERS/' + that.uid).set(
                {
                    email: that.email,
                    firstName: that.Fname,
                    lastName: that.Lname,
                    profilePicURL: that.imageLink,
                    uid: that.uid,
                    author:false,
                }
            );
            that.msgs = [];
            that.msgs.push({severity:'success', summary:'Account Created', detail:'You can now Sign In!'});
            $('#closeButton').click();
        }
    }

        signIn(signInForm, event)
        {
            var that= this;
            this.email= signInForm.value.email;
            this.password= signInForm.value.password;
            this.credentials.storeEmail(this.email);
            this.credentials.storePassword(this.password);
            console.log(this.email);
            console.log(this.password);
            this.firebaseApp.auth().signInWithEmailAndPassword(this.email,this.password)
                .then(result=> {
                this.uid = result.uid;
                console.log(this.uid);
                    $('.modal-backdrop').remove();
                })
                .then((success)=>{
                    this.router.navigate(['/home']);
                    location.reload();
                })
                .catch(function (error) {
                    var errorCode= error.code;
                    console.log(errorCode);
                    var errorMessage = error.message;
                    console.log(errorMessage);
                    if(errorCode=="auth/user-not-found"){
                        that.msgs = [];
                        that.msgs.push({severity:'error', summary:'Authentication Failed', detail:'Please create an Account!'});
                    }else if(errorCode=="auth/wrong-password"){
                        that.msgs = [];
                        that.msgs.push({severity:'error', summary:'Authentication Failed', detail:'Wrong Password was entered!'});
                    }else if(errorCode=="auth/too-many-requests"){
                        that.msgs = [];
                        that.msgs.push({severity:'error', summary:'Authentication Failed', detail:'Server is experiencing technical difficulties, Please Try Again Later!'});
                    }
                })

        }

        clicked(){
            this.msgs = [];
            this.msgs.push({severity:'warn', summary:'Creating Account...', detail:'Please Wait.'});
        }


}





        //Setting data in database







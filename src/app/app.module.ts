import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import {AngularFireModule, AuthMethods, AuthProviders}  from 'angularfire2';
import { AppComponent } from './app.component';
import { AppRoutingModule} from './app-routing';
import {SignupRoutingModule} from './signup/signup-routing.module';
import {SignupModule} from './signup/signup.module';
import 'hammerjs';
import {MaterialModule} from "@angular/material";
import {ButtonModule, InputTextModule} from "primeng/primeng";
import {AuthGuardService} from "./AuthGuard/auth-guard.service";
import {HomepageModule} from "./homepage/homepage.module";
import {HomepageRoutingModule} from "./homepage/homepage-routing-module";
import { NgSemanticModule } from 'ng-semantic/ng-semantic';
import {SidebarModule} from "ng-sidebar/";
import {NgbModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import { ViewArticleComponent } from './view-article/view-article.component';






export const firebaseConfig = {
  apiKey: "AIzaSyCk_oQCj08uydAWGPGDi6lGDKmhrJuBtAQ",
  authDomain: "official-sjapp.firebaseapp.com",
  databaseURL: "https://official-sjapp.firebaseio.com",
  storageBucket: "official-sjapp.appspot.com",
  messagingSenderId: "800945379816"
};

export const firebaseAuthConfig ={
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};

export const GoogleAuthConfig={
  provider: AuthProviders.Google,
  method: AuthMethods.Popup
};


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig,firebaseAuthConfig),
    AngularFireModule.initializeApp(firebaseConfig,GoogleAuthConfig),
    MaterialModule.forRoot(),
    ButtonModule,
    InputTextModule,
    AppRoutingModule,
      SignupRoutingModule,
      SignupModule,
      HomepageRoutingModule,
      HomepageModule,
      NgSemanticModule,
      SidebarModule,
      ReactiveFormsModule,
      NgbModule.forRoot(),



  ],
  exports: [
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
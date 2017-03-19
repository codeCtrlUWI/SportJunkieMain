import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SignupComponent} from "./signup.component";
import {SignupRoutingModule} from "./signup-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {InputTextModule} from 'primeng/primeng';
import {PasswordModule} from 'primeng/primeng';
import {MaterialModule} from "@angular/material";
import {HomepageModule} from "../homepage/homepage.module";
import {GrowlModule} from 'primeng/primeng';
import {NgSemanticModule} from "ng-semantic/ng-semantic";





@NgModule({
  imports: [
      BrowserModule,
    CommonModule,
      SignupRoutingModule,
      FormsModule,
      InputTextModule,
      PasswordModule,
      MaterialModule,
      HomepageModule,
      GrowlModule,
      ReactiveFormsModule,
      NgSemanticModule

  ],
  declarations: [SignupComponent],
})
export class SignupModule { }

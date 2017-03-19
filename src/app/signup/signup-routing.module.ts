
import { NgModule}  from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SignupComponent} from "./signup.component";
import {AuthGuardService} from "../AuthGuard/auth-guard.service";
import {HomepageComponent} from "../homepage/homepage.component";


const signupRoute: Routes = [
  {path: 'signup', component: SignupComponent, children:[
    {path: 'home', component: HomepageComponent, canActivate:[AuthGuardService]},
  ]},




];


@NgModule({
  imports: [ RouterModule.forChild(signupRoute)],
  exports: [RouterModule],
  providers:[AuthGuardService]
})

export class SignupRoutingModule {

}


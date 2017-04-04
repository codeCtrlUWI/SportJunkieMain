
import { NgModule } from '@angular/core'
import {  Routes ,RouterModule} from '@angular/router';
import {SignupComponent} from "./signup/signup.component";

const appRoutes: Routes =[
    {path: '', redirectTo: '/signin', pathMatch: 'full' },
  {path: 'signin', component:SignupComponent },

];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}






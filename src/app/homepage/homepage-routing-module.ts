
import { NgModule}  from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuardService} from "../AuthGuard/auth-guard.service";
import {HomepageComponent} from "../homepage/homepage.component";
import {ViewArticleComponent} from "../view-article/view-article.component";


const homepageRoute: Routes = [
  {path: 'home', component: HomepageComponent,canActivate:[AuthGuardService],children:[
    {path: 'view/:id', component: ViewArticleComponent}
  ]}];



@NgModule({
  imports: [ RouterModule.forChild(homepageRoute)],
  exports: [RouterModule],
  providers:[AuthGuardService]
})

export class HomepageRoutingModule {

}



import { NgModule}  from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from "../AuthGuard/auth-guard.service";
import {HomepageComponent} from "../homepage/homepage.component";
import {ViewArticleComponent} from "../view-article/view-article.component";
import {NavbarComponent} from "./navbar.component";
import {CricketComponent} from "../cricket/cricket.component";
import {FootballComponent} from "../football/football.component";
import {SwimmingComponent} from "../swimming/swimming.component";
import {EmptyComponent} from "../empty/empty.component";


const signupRoute: Routes = [
  {path: 'home', component: EmptyComponent,canActivate:[AuthGuardService],
  children:[
      {path:'',component:HomepageComponent},
    {path:'view/:id',component:ViewArticleComponent}
      ]
  },
  {path:'cricket', component:NavbarComponent,canActivate:[AuthGuardService],
    children:[
      {path:'',component:CricketComponent},
        {path:'view/:id',component:ViewArticleComponent}
    ]
  },
    {path:'football', component:NavbarComponent,canActivate:[AuthGuardService],
        children:[
            {path:'',component:FootballComponent},
            {path:'view/:id',component:ViewArticleComponent}
        ]
    },
    {path:'swimming', component:NavbarComponent,canActivate:[AuthGuardService],
        children:[
            {path:'',component:SwimmingComponent},
            {path:'view/:id',component:ViewArticleComponent}
        ]
    }
  ];






@NgModule({
  imports: [ RouterModule.forRoot(signupRoute)],
  exports: [RouterModule],
  providers:[AuthGuardService]
})

export class NavbarRoutingModule {

}


import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {InputTextModule} from 'primeng/primeng';
import {PasswordModule} from 'primeng/primeng';
import {MaterialModule} from "@angular/material";
import {GrowlModule} from 'primeng/primeng';
import {NgSemanticModule} from "ng-semantic/ng-semantic";
import {AuthGuardService} from "../AuthGuard/auth-guard.service";
import {HomepageComponent} from "../homepage/homepage.component";
import {ArticleService} from  "../homepage/article.service";
import {ViewArticleComponent} from "../view-article/view-article.component";
import {NavbarComponent} from "./navbar.component";
import {NavbarRoutingModule} from "./navbar-routing-module";
import {PanelModule} from 'primeng/primeng';
import {CricketComponent} from "../cricket/cricket.component";
import {FootballComponent} from "../football/football.component";
import {SwimmingComponent} from "../swimming/swimming.component";
import {EmptyComponent} from "../empty/empty.component";
import {CredentialService} from "../view-profile/credential.service";




@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    NavbarRoutingModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    MaterialModule.forRoot(),
    GrowlModule,
    ReactiveFormsModule,
    NgSemanticModule,
      PanelModule,
  ],
  providers:[ArticleService, AuthGuardService,CredentialService],
  declarations: [ViewArticleComponent,NavbarComponent, HomepageComponent, CricketComponent,FootballComponent,SwimmingComponent,EmptyComponent],
})
export class NavbarModule { }

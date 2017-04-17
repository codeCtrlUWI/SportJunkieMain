import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SignupComponent} from "./signup.component";
import {SignupRoutingModule} from "./signup-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {InputTextModule, PanelModule} from 'primeng/primeng';
import {PasswordModule} from 'primeng/primeng';
import {MaterialModule} from "@angular/material";
import {GrowlModule} from 'primeng/primeng';
import {NgSemanticModule} from "ng-semantic/ng-semantic";
import {AuthGuardService} from "../AuthGuard/auth-guard.service";
import {ArticleService} from  "../homepage/article.service";
import {ViewArticleComponent} from "../view-article/view-article.component";
import {HomepageComponent} from "../homepage/homepage.component";
import {CricketComponent} from "../cricket/cricket.component";
import {FootballComponent} from "../football/football.component";
import {SwimmingComponent} from "../swimming/swimming.component";
import {EmptyComponent} from "../empty/empty.component";
import {NavbarComponent} from "../navbar/navbar.component";
import { CustomFormsModule } from 'ng2-validation'
import {TabViewModule} from 'primeng/primeng';
import {ViewProfileComponent} from "../view-profile/view-profile.component";
import {AccordionModule} from 'primeng/primeng';
import {CredentialService} from "../view-profile/credential.service";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmDialogModule} from 'primeng/primeng';
import {TooltipModule} from 'primeng/primeng';
import { AmChartsModule } from "amcharts3-angular2";
import { ChartsModule } from 'ng2-charts/ng2-charts';
import {GalleriaModule} from 'primeng/primeng';
import { LocationStrategy, HashLocationStrategy} from '@angular/common';




@NgModule({
  imports: [
      BrowserModule,
    CommonModule,
      SignupRoutingModule,
      FormsModule,
      CustomFormsModule,
      InputTextModule,
      PasswordModule,
      MaterialModule,
      GrowlModule,
      ReactiveFormsModule,
      NgSemanticModule,
      PanelModule,
      TabViewModule,
      AccordionModule,
      NgbModule,
      ConfirmDialogModule,
      TooltipModule,
      AmChartsModule,
      ChartsModule,
      GalleriaModule

  ],
  providers:[ArticleService, AuthGuardService,CredentialService,{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  declarations: [SignupComponent,ViewArticleComponent, HomepageComponent, CricketComponent,FootballComponent,SwimmingComponent,EmptyComponent,NavbarComponent,ViewProfileComponent],
})
export class SignupModule { }

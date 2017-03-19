import { NgModule } from '@angular/core';
import {HomepageComponent} from "./homepage.component";
import {HomepageRoutingModule} from "./homepage-routing-module";
import {MaterialModule} from "@angular/material";
import {BrowserModule} from "@angular/platform-browser";
import {NgSemanticModule} from 'ng-semantic/ng-semantic';
import {SidebarModule} from "ng-sidebar/";
import {NgbDropdownModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ViewArticleComponent} from "../view-article/view-article.component";
import {ArticleService} from "./article.service";




@NgModule({
  imports: [
      BrowserModule,
      HomepageRoutingModule,
      MaterialModule,
      NgSemanticModule,
      SidebarModule,
      NgbModule,
      NgbDropdownModule.forRoot(),

  ],
    providers:[ArticleService],
  declarations: [HomepageComponent,   ViewArticleComponent]
})
export class HomepageModule { }

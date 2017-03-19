import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';
import { FirebaseObjectObservable, AngularFire} from 'angularfire2';
import {Location }  from '@angular/common';
import {ArticleService} from "../homepage/article.service";

@Component({
  selector: 'app-view',
  templateUrl: './view-article.component.html',
  styleUrls:['./view-article.component.css']
})

export class ViewArticleComponent implements OnInit {

  article: FirebaseObjectObservable<any>;
  constructor(private as: ArticleService, private route:ActivatedRoute, private location: Location){}
  ngOnInit(): void {

    this.route.params.switchMap((params:Params)=>this.as.getArticle(params['id'])).subscribe(article => this.article=article);
    console.log(this.article)
  }

  goBack(){
    this.location.back();
  }
}
import 'rxjs/add/operator/switchMap';
import {Component, OnInit, ElementRef} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { FirebaseObjectObservable, AngularFire} from 'angularfire2';
import {Location }  from '@angular/common';
import {ArticleService} from "../homepage/article.service";

@Component({
  selector: 'app-view',
  templateUrl: './view-article.component.html',
  styleUrls:['./view-article.component.css']
})



export class ViewArticleComponent implements OnInit {
  scrollUp;

  article: FirebaseObjectObservable<any>;
  constructor(private as: ArticleService, private route:ActivatedRoute, private location: Location,private element: ElementRef, private router:Router){
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
  }
  ngOnInit(): void {

    var currentUser = JSON.parse(localStorage.getItem('currentArticle'));
    this.article= currentUser.anArticle;
    console.log(this.article);
  }

  goBack(){
    this.location.back();
  }
}
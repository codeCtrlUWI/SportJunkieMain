import {Component, OnInit, ApplicationRef, NgZone, ChangeDetectorRef} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.css']
})
export class EmptyComponent implements OnInit {

  constructor(private cdr:ChangeDetectorRef,private router:Router) { }

  ngOnInit(){


}

}

import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AngularFire} from "angularfire2/index";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})


export class NavbarComponent{




  constructor( private af:AngularFire, private router:Router) {

  }


logout() {
  this.af.auth.logout().then(
      (success) => {
        this.router.navigate(['/signup']);
        this.af.auth.unsubscribe();
        window.location.reload();
      })
}
}

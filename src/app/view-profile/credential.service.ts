import { Injectable } from '@angular/core';

@Injectable()
export class CredentialService {

  email;
  password;
  constructor() {
  }

  returnEmail(){
    var currentUser = JSON.parse(localStorage.getItem('email'));
    return currentUser.email;
  }
  returnPassword(){
    var currentUser = JSON.parse(localStorage.getItem('password'));
    return currentUser.password;
  }
  returnOAuthToken(){
    var currentUser = JSON.parse(localStorage.getItem('token'));
    return currentUser.token;
  }

  storeEmail(email){
    this.email=email;
    localStorage.setItem('email', JSON.stringify({email: email}));
  }
  storePassword(password){
    this.password=password;
    localStorage.setItem('password', JSON.stringify({password: password}));
  }

  storeOAuthToken(token){
    localStorage.setItem('token', JSON.stringify({token: token}));
  }

}

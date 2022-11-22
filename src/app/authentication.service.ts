import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  jwtToken: string;
  username: string;
  roles: Array<string>;
  public dateInscription: string;
  // ONESIGNAL_APP_ID = 'aae32a83-7763-456f-a85f-843bf1ed816d';
  ANDROID_ID = '728954725867';
  ONESIGNAL_APP_IOS_ID = '3b198f55-61e5-4dd3-9d71-70eceb61ca01';
  ONESIGNAL_APP_ID = '3b198f55-61e5-4dd3-9d71-70eceb61ca01';

  constructor(

  ) { }


  saveToken(jwt: string) {
    if(jwt != null) {
      localStorage.setItem('Token', jwt);
      // console.log(jwt);
      this.jwtToken = jwt;
      this.parseJWT();
    }
  }

  saveRegisterDate(d: string) {
    if(d !== null) {
      localStorage.setItem('Date', d);
      this.dateInscription = d;
    }
  }

  checkedTokenExpiry() {
    let jwtHelper = new JwtHelperService();
    if(jwtHelper.isTokenExpired(this.jwtToken)) {
      return true;
    } else {
      return false;
    }
  }


  parseJWT() {
    let jwtHelper = new JwtHelperService();
    let objWT = jwtHelper.decodeToken(this.jwtToken);
    this.username = objWT.sub; //sub représente withSubject qui est le username récupéré du côté serveur
    // console.log('****** Contenu de username: '+ this.username);
    this.roles = objWT.Roles; // Roles ici est la valeur du Claim définie du côté serveur
    // console.log('Role '+this.roles);
  }

  getHeader() {
    let header = new HttpHeaders({'Authorization': this.jwtToken});
    // console.log(this.jwtToken);
    // console.log(header);
    return header;
  }

  getHeaderForTree() {
    return this.jwtToken;
  }

  getRoles() {
    // console.log(this.roles);
    return this.roles;
  }

  loadCurrentUser() {
    // console.log(this.username);
    return this.username;
  }

  isAdmin() {
    if(this.roles) {
      return this.roles.indexOf('ADMIN')>=0;
    }
  }

  isUser() {
    if(this.roles) {
      return this.roles.indexOf('USER') >= 0;
    }
    // return this.roles.includes('USER');
  }


  isAuthenticated() {
    if(this.roles) {
      return this.roles && (this.isAdmin() || this.isUser());
    }
  }

  loadToken() {
    if(localStorage.getItem('Token')!= null) {
      this.jwtToken = localStorage.getItem('Token');
      this.parseJWT();
    }
  }

  initCredentials() {
    this.jwtToken = undefined;
    this.username = undefined;
    this.roles = undefined;
  }
}

import { Injectable } from '@angular/core';
import {Urls} from "./urls";
import {Platform} from "@ionic/angular";
import {UtilisateurDto} from "./utilisateur/utilisateur.model";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs";
import {OSNotification} from "@ionic-native/onesignal/ngx";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  urlRegister = this.urls.urlUsedRes+'api/saveUserId';
  urlNotificationToAll = this.urls.urlUsedRes+'api/sendNotificationToAllUsers';
  urlNotificationToOne = this.urls.urlUsedRes+'api/sendNotificationToUser';
  urlNotificationUsers = this.urls.urlUsedRes+'api/getNotificationUsers';

  constructor(
      private http: HttpClient,
      private authService: AuthenticationService,
      private urls: Urls,
      private platform: Platform
  ) {
  }

  saveUserId(ospush: OneSignalPushNotification) {
    return this.http.post(this.urlRegister, ospush, {headers:this.authService.getHeader(), observe: 'response'});
  }

  sendNotifToOne(ospush: OneSignalPushNotification) {
    return this.http.post(this.urlNotificationToOne, ospush, {headers:this.authService.getHeader(), observe: 'response'});
  }

  getNotifUsers() {
    return this.http.get(this.urlNotificationUsers, {headers:this.authService.getHeader(), observe: 'response'});
  }

  sendNotifToAll(ospush: OneSignalPushNotification) {

    return this.http.post<any>(this.urlNotificationToAll, ospush, {headers:this.authService.getHeader(), observe: 'response'});
  }



}

export class OneSignalPushNotification {

  idUtilisateur?: number;
  idU?: number;
  userID?: string;
  title?: string;
  message?: string;
  // data?: string;
  data?: any;
  action?: string;
}

export class PushNotification {
  pushNotificationRequest?: OneSignalPushNotification;
  data?: any;
}


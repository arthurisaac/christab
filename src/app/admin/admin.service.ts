import { Injectable } from '@angular/core';
import {Admin} from "./admin.model";
import {AuthenticationService} from "../authentication.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Urls} from "../urls";

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  private resourceAllUrl = this.urls.urlUsedSec+'api/users/findUsers';
  private resourceUrl = this.urls.urlUsedSec+'api/users/findUser';
  private resourceCreateUrl = this.urls.urlUsedSec+'api/register';
  private resourceUpdateUrl = this.urls.urlUsedSec+'api/users/updateUser';
  private resourceUpdatePwdUrl = this.urls.urlUsedSec+'api/users/updateUserPass';
  private resourceDisableUrl = this.urls.urlUsedSec+'api/users/disableUser';
  private resourceReactivateUrl = this.urls.urlUsedSec+'api/users/reactivateUser';
  private resourceEmailUrl = this.urls.urlUsedSec+'api/findUserByEmail';
  private resourceCheckEmailUrl = this.urls.urlUsedSec+'api/checkUserByEmail/';
  private  resourceCheckAllEmailUrl = this.urls.urlUsedSec+'api/checkUserByEmailV2/';

  user: Admin;

  constructor(
      private authService: AuthenticationService,
      private http: HttpClient,
      private urls: Urls
  ) { }

  ngOnInit() {
  }

  create(user: Admin){ // : Observable<Admin> {
    const copy = this.convert(user);
    return this.http.post<Admin>(this.resourceCreateUrl, copy, {observe: 'response'}); // , {headers:this.authService.getHeader()});
  }

  update(user: Admin): Observable<Admin> {
    const copy = this.convert(user);
    return this.http.post(this.resourceUpdateUrl, copy, {headers:this.authService.getHeader()});
  }

  reactivate(user): Observable<Admin> {
    const copy = this.convert(user);
    return this.http.post(this.resourceReactivateUrl, copy, {headers:this.authService.getHeader()});
  }

  updatePassword(user: Admin): Observable<Admin> {
    const copy = this.convert(user);
    return this.http.post(this.resourceUpdatePwdUrl, copy, {headers:this.authService.getHeader()});
  }

  getAll() {
    return this.http.get<any>(this.resourceAllUrl, {headers:this.authService.getHeader()});
  }

  getOne(user: Admin): Observable<Admin> {
    const copy = this.convert(user);
    return this.http.post(this.resourceUrl, copy, {headers:this.authService.getHeader()});
  }

  getByEmail(name: string): Observable<Admin> {
    return this.http.post(`${this.resourceEmailUrl}`, name, {headers:this.authService.getHeader()});
  }

  /*checkEmail(name: string) {
    return this.http.post(`${this.resourceCheckEmailUrl}`, name, {observe: 'response'});
  }*/

  checkEmail(name: string) {
    return this.http.get<Boolean>(`${this.resourceCheckEmailUrl+name}`, {observe: 'response'});
  }

  checkAllEmail(email: string) {
    return this.http.get<Boolean>(this.resourceCheckAllEmailUrl+email, {observe: 'response'});
  }

  query(req?: any) {
    return this.http.get(this.resourceUrl);
  }

  disable(user): Observable<Admin> {
    const copy = this.convert(user);
    return this.http.post(this.resourceDisableUrl, copy, {headers:this.authService.getHeader()});
  }
  /*delete(id: number): Observable<User> {
      return this.http.delete(`${this.resourceDeleteUrl}/${Number(id)}`,{headers:this.authService.getHeader()});
  }*/

  search(motCle: string, page: number, size: number) {
    console.log(motCle);
    return this.http.get('http://localhost:8087/chercherUsers?mot =' + motCle);
  }

  private convert(user: Admin): Admin {
    const copy: Admin = Object.assign({}, user);
    return copy;
  }
}

import { Injectable } from '@angular/core';
import {Admin} from "../admin/admin.model";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../authentication.service";
import {Observable} from "rxjs";
import {Urls} from "../urls";
import {UtilisateurDto} from "../utilisateur/utilisateur.model";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    private resourceUrl = this.urls.urlUsedSec+'login';
    private resourceRecupPassUrl = this.urls.urlUsedSec+'api/recupPassword';
    private resourceVerifCUrl = this.urls.urlUsedSec+'api/verifCode';
    private resourceReInitPassUrl = this.urls.urlUsedSec+'api/reInitPassword';

    username: string;
    user: Admin;
    role: Array<number> = [];
    idLogin: number;
    utilisateurs:UtilisateurDto;

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthenticationService,
        private urls: Urls
    ) {

    }

    login(data) {
        // console.log(data);
        return this.http.post(this.resourceUrl, data, {observe: 'response'}) ;// permet de récupérer toute la réponse à savoir l'entête, le corps
    }

    loadCurrentUserId(id: number) {
        localStorage.setItem('ID_User', id.toString());
        this.idLogin = +localStorage.setItem('ID_User', id.toString());
        // console.log(this.idLogin);
        return this.idLogin;
    }

    loadCurrentUserF(f: number) {
        this.role.push(f);
        localStorage.setItem('Role', f.toString());
        return this.role;
    }

    loadUser(u: UtilisateurDto) {
        return this.utilisateurs = u;
    }

    isConductor() {
        if(this.role) {
            // console.log('******* Conducteur *******');
            return this.role.indexOf(1)>=0;
        }
    }
    isPassager() {
        if(this.role) {
            // console.log('******* Passager *******');
            return this.role.indexOf(2)>=0;
        }
    }

    recupPass(email: string) {
        return this.http.post(this.resourceRecupPassUrl, email, {observe: 'response'});
    }

    verifCode(email: string, code: number) {
        // console.log(code);
        return this.http.post(`${this.resourceVerifCUrl}/${code}`, email);
    }

    /*reInitPass(u: Admin, c: number): Observable<Admin> {
        const copy = this.convert(u);
        // console.log(copy);
        return this.http.post(`${this.resourceReInitPassUrl}/${c}`, copy); // , {headers:this.authService.getHeader()});
    }*/

    reInitPass(u: Admin) { // : Observable<Admin> {
        const copy = this.convert(u);
        // console.log(copy);
        return this.http.post(this.resourceReInitPassUrl, copy, {observe: 'response'}); // , {headers:this.authService.getHeader()});
    }

    logout() {
        this.authService.initCredentials();
        this.idLogin = undefined;
        localStorage.clear();
        /*localStorage.removeItem('Token');
        localStorage.removeItem('Role');
        localStorage.removeItem('ID_User');*/
    }

    private convert(user: Admin): Admin {
        const copy: Admin = Object.assign({}, user);
        return copy;
    }

    upload(e, f:any){
        console.log(e.target.name);
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload =  (e: any) => {
            console.log(e.target.result);
            return f = e.target.result;
        };
        reader.readAsDataURL(file);
        reader.onerror = function (error) {
            // console.log('Error: ', error);
        };
    }
  
}

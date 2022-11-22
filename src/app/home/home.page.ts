import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  id: number;

  constructor(
      private authService: AuthenticationService,
      private router: Router
  ) {}

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.id = +localStorage.getItem('ID_User');
    this.isAuthenticated();
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  goRegister() {
    this.router.navigate(['/utilisateur']);
  }

}

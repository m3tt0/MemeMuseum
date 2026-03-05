import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RestBackendService } from '../../services/rest-backend.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar{  
  authService = inject(AuthService);
  restService = inject(RestBackendService);

  backendBaseUrl = 'http://localhost:3030/';
  pfp = this.authService.getUserPfp();
  userProfilePicture = this.pfp ? this.backendBaseUrl + this.pfp : '/defaultPfp.png';

  handleLogoutClick(){
    this.authService.logout();
  }

}

import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RestBackendService } from '../../services/rest-backend.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgOptimizedImage, ReactiveFormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar{  
  authService = inject(AuthService);
  restService = inject(RestBackendService);
  private fb = inject(FormBuilder);

  backendBaseUrl = 'http://localhost:3030/';
  pfp = this.authService.getUserPfp();
  userProfilePicture = this.pfp ? this.backendBaseUrl + this.pfp : '/defaultPfp.png';

  searchForm: FormGroup = this.fb.group({
    searchText: [''],
    sort: ['newest'],
    from: [''],
    to: ['']
  });

  filtersOpen = signal(false);

  toggleFilters(): void {
    this.filtersOpen.update(v => !v);
  }

  resetFilters(): void {
    this.searchForm.patchValue({
      sort: 'newest',
      from: '',
      to: '',
    });
  }


  onSearch(): void {
    const { searchText, sort, from, to } = this.searchForm.getRawValue();

    this.filtersOpen.set(false);
  }




  handleLogoutClick(){
    this.authService.logout();
  }





}

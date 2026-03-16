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
  private router = inject(Router);

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
    const searchText = this.searchForm.value.searchText?.trim() || null;
    const sort = this.searchForm.value.sort || null;
    const from = this.searchForm.value.from || null;
    const to = this.searchForm.value.to || null;

    this.router.navigate(['/'], {
      queryParams: {
        tag: searchText,
        sort: sort,
        from: from,
        to: to 
      },
      queryParamsHandling: ''
    });
  }


  handleLogoutClick(){
    this.authService.logout();
  }





}

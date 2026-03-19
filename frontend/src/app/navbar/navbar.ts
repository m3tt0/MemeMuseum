import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth/auth.service';
import { RestBackendService } from '../_services/backend/rest-backend.service';
import { UpdatePfpModal } from "../update-pfp-modal/update-pfp-modal";
import { UpdatePwdModal } from '../update-pwd-modal/update-pwd-modal';
import { UpdateUsernameModal } from '../update-username-modal/update-username-modal';
import { DeleteUserModal } from '../delete-user-modal/delete-user-modal';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgOptimizedImage, ReactiveFormsModule, UpdatePfpModal, UpdatePwdModal, UpdateUsernameModal, DeleteUserModal],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar{  
  authService = inject(AuthService);
  restService = inject(RestBackendService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  backendBaseUrl = 'http://localhost:3030/';
  
  searchForm: FormGroup = this.fb.group({
    searchText: [''],
    sort: ['newest'],
    from: [''],
    to: ['']
  });

  filtersOpen = signal(false);
  isUpdatePfpModalOpen = signal(false);
  isUpdatePwdModalOpen = signal(false);
  isUpdateUsernameModalOpen = signal(false);
  isDeleteUserModalOpen = signal(false);


  get userProfilePicture(): string {
    const pfp = this.authService.getUserPfp();
    return pfp ? this.backendBaseUrl + pfp : '/defaultPfp.png';
  }

  toggleFilters(){
    this.filtersOpen.update(v => !v);
  }

  resetFilters(){
    this.searchForm.patchValue({
      sort: 'newest',
      from: '',
      to: '',
    });
  }


  onSearch(){
    const searchText = this.searchForm.value.searchText?.trim() || null;
    const sort = this.searchForm.value.sort || null;
    const from = this.searchForm.value.from || null;
    const to = this.searchForm.value.to || null;

    this.router.navigate(['/home'], {
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

  openUpdatePfpModal(){
    this.isUpdatePfpModalOpen.set(true);
  }

  closeUpdatePfpModal(){
    this.isUpdatePfpModalOpen.set(false);
  }

  openUpdatePwdModal(){
    this.isUpdatePwdModalOpen.set(true);
  }

  closeUpdatePwdModal(){
    this.isUpdatePwdModalOpen.set(false);
  }

  openUpdateUsernameModal(){
    this.isUpdateUsernameModalOpen.set(true);
  }

  closeUpdateUsernameModal(){
    this.isUpdateUsernameModalOpen.set(false);
  }

  openDeleteUserModal(){
    this.isDeleteUserModalOpen.set(true);
  }

  closeDeleteUserModal(){
    this.isDeleteUserModalOpen.set(false);
  }
}

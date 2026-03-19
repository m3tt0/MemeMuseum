import { Routes } from '@angular/router';
import { Homepage } from "./homepage/homepage";
import { AuthLayout } from './auth-layout/auth-layout';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { CreateMeme } from './create-meme/create-meme';
import { authGuard } from './_guards/auth/auth-guard';
import { guestGuard } from './_guards/guest/guest-guard';

export const routes: Routes = [
    {
      path: "home",
      component: Homepage,
    },
    {
      path: "auth",
      component: AuthLayout,
      children: [
        {
          path: "",
          redirectTo: "login",
          pathMatch: "full"
        },
        {
          path: "login",
          component: Login,
          canActivate: [guestGuard]
        },
        {
          path: "signup",
          component: Signup,
          canActivate: [guestGuard]
        }
      ],
    },
    {
      path: "create-meme",
      component: CreateMeme,
      canActivate: [authGuard]
    },
     {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "**",
    redirectTo: "home"
  }
];

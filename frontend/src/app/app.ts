import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./shared/footer/footer";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Footer],
  template: `
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
    <!-- <app-navbar class="sticky top-0"/> -->
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer/>
  </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `],
})
export class App {}


import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./footer/footer"

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Footer],
  templateUrl: './app.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `],
})
export class App {}


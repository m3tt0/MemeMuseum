import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="p-10">
      <h1 class="text-4xl text-center text-red-500 font-bold">
        Tailwind is working!
      </h1>
      <button class="btn btn-primary">Click me</button>
    </div>
  `,
})
export default class Home {}
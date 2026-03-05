import { Component, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RestBackendService, Meme } from '../services/rest-backend.service';
import { Navbar } from "../shared/navbar/navbar";
import { MemeFeed } from '../shared/meme-feed/meme-feed';


@Component({
  standalone: true,
  selector: 'home-page',
  imports: [CommonModule, Navbar, MemeFeed],
  templateUrl: './index.page.html'
})
export default class HomePage implements OnInit{
  private restService = inject(RestBackendService);
  backendBaseUrl = 'http://localhost:3030/';
  memes = this.restService.getMemes({ feed: true });

  ngOnInit(): void {
  // this.restService.getMemes({feed:true}).subscribe({
  //   next: (data) => {
  //     console.log('Memes:', data);
  //     this.memes = data; // data deve essere Meme[]
  //     console.log(this.memes);
  //   },
  //   error: (err) => console.error(err),
  // });
   }

}

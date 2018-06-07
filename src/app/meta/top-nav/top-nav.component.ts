import { Component, HostListener, OnInit } from '@angular/core';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})

export class TopNavComponent implements OnInit{
  resolution: any;
  version: string = "0.1.1";

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resolution = window.innerWidth;
  }

  ngOnInit(){
    this.resolution = window.innerWidth;
    }
}

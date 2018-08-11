import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() menuToggle = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  menuClick() {
    this.menuToggle.emit();
  }
}

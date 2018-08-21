import { Directive, Input, HostBinding, OnChanges } from '@angular/core';

const COLOR = {
  up: '#46ad2c',
  down: '#d4481b'
};

@Directive({ selector: '[cpeChangePercent]' })
export class ChangePercentDirective implements OnChanges {
  @HostBinding('style.color') color: string;
  @HostBinding('innerHTML') html: string;
  @Input() cpeChangePercent: number;

  ngOnChanges() {
    if (typeof this.cpeChangePercent !== 'number') { return; }
    this.color = this.cpeChangePercent >= 0 ? COLOR.up : COLOR.down;
    this.html = (this.cpeChangePercent * 100).toFixed(2) + '%';
  }
}

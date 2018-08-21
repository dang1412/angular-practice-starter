import { Directive, OnChanges, Input, Renderer2, ElementRef } from '@angular/core';

const defaultOptions: UpDownAnimateOptions = {
  upClass: 'up',
  downClass: 'down',
  duration: 1200
};

@Directive({ selector: '[cpeUpDownAnimate]' })
export class UpDownAnimateDirective implements OnChanges {
  @Input() value: number;
  @Input() options: UpDownAnimateOptions;
  private previousValue: number;
  private timeout;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnChanges() {
    this.options = Object.assign({}, defaultOptions, this.options);
    this.value = +this.value;
    this.element.nativeElement.innerHTML = this.value > 1 ? this.value.toLocaleString() : this.value;
    if (typeof(this.value) === 'number' && typeof(this.previousValue) === 'number') {
      this.update(this.value, this.previousValue);
    }
    this.previousValue = this.value;
  }

  private update(currentValue: number, previousValue: number) {
    this.reset();

    let addClass = '';
    if (currentValue > previousValue) {
      addClass = this.options.upClass;
    } else if (currentValue < previousValue) {
      addClass = this.options.downClass;
    }
    setTimeout(() => { this.renderer.addClass(this.element.nativeElement, addClass); });

    this.timeout = setTimeout(() => { this.reset(); }, this.options.duration); // animation end
  }

  private reset() {
    clearTimeout(this.timeout);
    this.renderer.removeClass(this.element.nativeElement, this.options.upClass);
    this.renderer.removeClass(this.element.nativeElement, this.options.downClass);
  }
}

export interface UpDownAnimateOptions {
  upClass: string;
  downClass: string;
  duration: number;
}

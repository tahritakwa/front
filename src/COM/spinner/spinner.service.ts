import { Injectable } from '@angular/core';

@Injectable()
export class SpinnerService {
  private show = false;
  constructor() { }
  public showLoader() {
    this.show = true;
  } public hideLaoder() {

    this.show = false;
  }
  public getLoaderStatus(): boolean {
    return this.show;
  }
  ngDoCheck() {
    this.show = this.getLoaderStatus();
  }
}

import { Injectable } from '@angular/core';

@Injectable()
export class DataTransferService {

  private saveAndCloseModal = false;

  getStateStateModal () {
    return this.saveAndCloseModal;
  }

  setStateStateModal (state) {
    this.saveAndCloseModal = state;

  }


}

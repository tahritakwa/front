import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AnonymousSubject, BehaviorSubject } from 'rxjs';

@Injectable()
export class ReconciliationBankBehaviorSubjectService {

  private message = new BehaviorSubject({ account: Number, closeMonth: null , isFromHistoric : false });
  sharedMessage = this.message.asObservable();

  constructor() { }

  
  nextMessage(message: any) {
    this.message.next(message)
  }

}

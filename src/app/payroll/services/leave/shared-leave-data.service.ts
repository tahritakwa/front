import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PredicateFormat} from '../../../shared/utils/predicate';

@Injectable()
export class SharedLeaveData {

  private sharedPredicate = new BehaviorSubject<PredicateFormat>(new PredicateFormat());
  public currentPredicate = this.sharedPredicate.asObservable();

  constructor() {
  }

  setPredicateValue(predicate: PredicateFormat) {
    this.currentPredicate = new BehaviorSubject<PredicateFormat>(predicate);
    this.sharedPredicate.next(predicate);
  }
}

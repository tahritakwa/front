import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class StarkPermissionsStore {

    public permissionsSource = new BehaviorSubject({});
    public permissions$ = this.permissionsSource.asObservable();


    constructor() {}
}

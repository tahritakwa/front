import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class StarkRolesStore {

    public rolesSource = new BehaviorSubject({});

    public roles$ = this.rolesSource.asObservable();
}

import { Resource } from '../shared/ressource.model';
import { MachineOperation } from './machine-operation.model';
import { Post } from './post.model';
import { ReducedOperation } from './reduced-operation.model';

export class Machine extends Resource {
    Name: string;
    State: string;
    Constructor: string;
    Model: string;
    ReducedOperation: Array<ReducedOperation>;
    MachineOperation: Array<MachineOperation>;
    IdPost: number;
    IdPostNavigation: Post;
}

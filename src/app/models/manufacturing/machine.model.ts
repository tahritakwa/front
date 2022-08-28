import { StateMachine } from '../enumerators/state-machine.enum';

import { FamilyMachineEnum } from '../enumerators/family-machine.enum';
import {FormControl, Validators} from '@angular/forms';
import {TypeMachineEnum} from '../enumerators/type-machine.enum';
export class Machine {

    id: number;
    reference: number;
    description: string;
    machineImage: string;
    brand: string;
    serialNumber: string;
    typeMachine: TypeMachineEnum;
    costPerHour: number;
    sectionId: number;
    responsibleId: number;
    productId: number;
    stateMachine: StateMachine;
    responsibleFullName: string;
    price: number;
    purchaseDate: string;
    endDateAmortisation: string;
    periodAmortisation: number;
    operations: any[];
    familyMachine: FamilyMachineEnum;
}

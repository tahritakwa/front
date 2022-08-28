import { UserCurrentInformationsService } from "../../shared/services/utility/user-current-informations.service";
import {LocalStorageService} from '../../login/Authentification/services/local-storage-service';

export class TecDocMseries {
    ModelId: number;
    ModelName: string;
    yearOfConstrFrom: number;
    yearOfConstrTo: number;
    UserMail: string;
    constructor(private localStorageService : LocalStorageService) {
        this.UserMail = this.localStorageService.getEmail();
    }
}

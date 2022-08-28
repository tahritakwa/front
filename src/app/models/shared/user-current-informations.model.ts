import { Resource } from './ressource.model';

export class UserCurrentInformations extends Resource {
    public IdUser: number;
    public Language: string;
    public ActivityArea: number;
    public UserMail: string;
    public CompanyCode: string;
    public IdEmployee: number;

}
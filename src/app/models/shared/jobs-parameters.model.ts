import { Resource } from './ressource.model';

export class JobsParameters extends Resource {
    Keys?: string;
    Field?: string;
    Value: string;
    Description: string;
}

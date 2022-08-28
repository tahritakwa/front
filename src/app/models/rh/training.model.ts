import { Resource } from '../shared/ressource.model';
import { TrainingByEmployee } from './training-by-employee.model';
import { TrainingExpectedSkills } from './training-expected-skills.model';
import { TrainingRequest } from './training-request.model';
import { TrainingRequiredSkills } from './training-required-skills.model';
import { Tiers } from '../achat/tiers.model';
import { TrainingSession } from './training-session.model';
import { FileInfo } from '../shared/objectToSend';

export class Training extends Resource {
    Name: string;
    Description: string;
    Duration: number;
    IsCertified: boolean;
    IsInternal: boolean;
    IdSupplier?: number;
    DeletedToken: string;
    TrainingPictureUrl: string;
    TrainingPictureFileInfo: FileInfo;
    IdSupplierNavigation: Tiers;
    TrainingByEmployee: Array<TrainingByEmployee>;
    TrainingExpectedSkills: Array<TrainingExpectedSkills>;
    TrainingRequest: Array<TrainingRequest>;
    TrainingRequiredSkills: Array<TrainingRequiredSkills>;
    TrainingSession: Array<TrainingSession>;
}

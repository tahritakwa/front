import {Resource} from '../shared/ressource.model';
import {Tiers} from './tiers.model';
import { FileInfo } from '../shared/objectToSend';

export class TiersPictures extends Resource {
    UrlPicture: string;
    PictureFileInfo: FileInfo;
    IsDeleted: boolean;
    IdTiers: number;
    IdTiersNavigation: Tiers;
}

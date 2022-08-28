import { UserCurrentInformationsService } from '../../shared/services/utility/user-current-informations.service';
import { Resource } from '../shared/ressource.model';
import { Item } from './item.model';
import { LocalStorageService } from '../../login/Authentification/services/local-storage-service';
import { OemNumber } from './TedDocRowItem';

export class TecDocArticleModel extends Resource {
  Reference: string;
  Code: string;
  Description: string;
  Supplier: string;
  ItemInDB: Item;
  IdSupplier: number;
  PassengerCarList: Array<string>;
  BarCode: string;
  oem: string;
  UserMail: string;
  ImagesUrl: string;
  Image: any;
  TecDocIdSupplier: number;
  TecDocRef: string;
  TecDocImageList: Array<string>;
  OemNumbers: Array<OemNumber>;
  GlobalSearch: string;

  constructor(private localStorageService: LocalStorageService) {
    super();
    this.UserMail = this.localStorageService.getEmail();
  }
}

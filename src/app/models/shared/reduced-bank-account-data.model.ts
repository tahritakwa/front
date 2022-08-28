import { Resource } from '../shared/ressource.model';

export class ReducedBankAccountData extends Resource {
  BankName: string;
  Rib: string;
  Iban: string;
  Bic: string;
  Agency: string;
  Code: string;
  Entitled: string;
  Email: string;
  Telephone: string;
  Fax: string;
  CurrentBalance: number;
  InitialBalance: number;
  TypeAccount: number;
  Precision: number;
  CodeCurrency: string;
  CurrencyDescription: string;
  BankAttachmentUrl: string;
  BankCountryNameFr: string;
  BankCountryNameEn: string;
  BankCityName: string;
  ZipCode: string;
  Locality: string;
  BankLogoFileInfo: any;
}

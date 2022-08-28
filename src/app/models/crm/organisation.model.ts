import {Address} from './address.model';
import {DateToRemember} from './dateToRemember';
import {Tiers} from '../achat/tiers.model';

export class Organisation {
  id: number;
  name: string;
  idClient: number;
  email: string;
  description: string;
  telephone: string;
  fax: string;
  linkedIn: string;
  facebook: string;
  twitter: string;
  postalAddress: string;
  dates: Date[];
  type: String;
  datesToRemember: Array<DateToRemember>;
  addresses: Address[];
  contacts: any[];
  activitySector: string;
  isClient: boolean;
  dateRememberTodelete: number [] = [];
  currencyId: number;

  constructor(id?: any, name?: any, email?: any, telephone?: string[] | any | string,
              postalAddress?: any, description?: any, fax?: string | any, linkedIn?: string, facebook?: string, twitter?: string,
              datesToRemember?: Array<DateToRemember>, addresses?: Address[], type?: String, idClient?: number, activitySector?: string ,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.telephone = telephone;
    this.postalAddress = postalAddress;
    this.description = description;
    this.fax = fax;
    this.linkedIn = linkedIn;
    this.facebook = facebook;
    this.twitter = twitter;
    this.datesToRemember = datesToRemember;
    this.addresses = addresses;
    this.type = type;
    this.activitySector = activitySector;
    this.idClient = idClient;
  }

  public static convertToTiers(organisation: Organisation) {

    const tiers: Tiers = new Tiers();

    tiers.Id = 0;
    tiers.Name = organisation.name;
    tiers.Email = organisation.email;
    tiers.Phone = organisation.telephone;
    tiers.Fax = organisation.fax;
    tiers.Facebook = organisation.facebook;
    tiers.Linkedin = organisation.linkedIn;
    tiers.Twitter = organisation.twitter;
    tiers.DateToRemember = organisation.datesToRemember;
    tiers.Address = this.convertTOTierAddress(organisation.addresses);
    tiers.Description = organisation.description;
    tiers.AuthorizedAmountInvoice = null;
    tiers.CodeTiers = '';
    tiers.IdTaxeGroupTiers = 2;
    tiers.IdTypeTiers = 1;
    tiers.ActivitySector = organisation.activitySector;
    tiers.IdCurrency = organisation.currencyId;
    return tiers;
  }


  static convertTOTierAddress(addresses) {
    const convertedAddress = [];
    addresses.forEach(address => {
      convertedAddress.push({
        Id :  0 ,
        City : address.city,
        Country : address.country,
        IdCountry : address.idCountry,
        IdCity : address.idCity,
        Label : address.label,
        PrincipalAddress : address.principalAddress,
        Region : address.region,
        CodeZip : address.zipCode,
        ExtraAdress : address.extraAddress,
        IdZipCodeNavigation : {
          Region: address.region,
          Code: address.zipCode,
          IdCity: address.idCity,
          IdCityNavigation: null,
          Id: 0,
          IsDeleted: false,
          TransactionUserId: 0,
          CanEdit: true,
          CanDelete: true,
          CanShow: true,
          CanValidate: true,
          CanPrint: true,
          EntityName: null
        }
      })
    });
    return convertedAddress;
  }
}

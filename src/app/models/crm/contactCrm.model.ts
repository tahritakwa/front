import {DateToRemember} from './dateToRemember';
import {Address} from './address.model';

export class ContactCrm {


  id: number;
  idClient: number;
  mail: string;
  phone: any;
  homePhone: string;
  otherPhone: string;
  assistantName: string;
  assistantPhone: string;
  fax: string;
  facebook: string;
  twitter: string;
  photo: string;
  type: string;
  name: string;
  linkedIn: string;
  lastName: string;

  organisationId;
  poste: string;
  dateOfBirth: Date;
  description: string;
  currencyId: number;
  region: string;
  address: string;
  datesToRemember: Array<DateToRemember>;
  adress: Address;
  organisationName: string;
  prefix: string;
  fullName: string;
  IdTiers;
  isClient: boolean;
  dateRememberTodelete: number [] = [];

  constructor(id?: number, mail?: string, phone?: string, homePhone?: string, otherPhone?: string, assistantName?: string,
              assistantPhone?: string, fax?: string, facebook?: string, twitter?: string, name?: string,
              linkedIn?: string, lastName?: string, poste?: string, dateOfBirth?: Date, description?: string, adress?: Address,
              organisationName?: string) {
    this.id = id ? id : 0;
    this.mail = mail ? mail : ' ';
    this.phone = phone ? phone : ' ';
    this.homePhone = homePhone ? homePhone : ' ';
    this.otherPhone = otherPhone ? otherPhone : ' ';
    this.assistantName = assistantName ? assistantName : ' ';
    this.assistantPhone = assistantPhone ? assistantPhone : ' ';
    this.fax = fax ? fax : ' ';
    this.facebook = facebook ? facebook : ' ';
    this.twitter = twitter ? twitter : ' ';
    this.name = name ? name : ' ';
    this.linkedIn = linkedIn ? linkedIn : ' ';
    this.lastName = lastName ? lastName : ' ';
    this.poste = poste ? poste : ' ';
    this.dateOfBirth = dateOfBirth ? dateOfBirth : null;
    this.description = description ? description : ' ';
    this.adress = adress ? adress : null;
    this.organisationName = organisationName ? organisationName : ' ';
  }
}

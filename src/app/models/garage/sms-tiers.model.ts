import { Tiers } from "../achat/tiers.model";
import { Resource } from "../shared/ressource.model";
import { Sms } from "./sms.model";

export class SmsTiers extends Resource {
  IdTiers: number;
  IdSms: number;

  IdTiersNavigation: Tiers;
  IdSmsNavigation: Sms;
}
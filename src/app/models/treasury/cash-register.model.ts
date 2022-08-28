import { City } from "../administration/city.model";
import { Country } from "../administration/country.model";
import { User } from "../administration/user.model";
import { Warehouse } from "../inventory/warehouse.model";
import { SessionCash } from "../payment/session-cash.model";
import { Resource } from "../shared/ressource.model";

export class CashRegister extends Resource {
  Id: number;
  Code: string;
  Name: string;
  Type: number;
  Address: string;
  AgentCode: string;
  IdResponsible?: number;
  IdResponsibleNavigation : User;
  IdParentCash?: number;
  IdCity?: number;
  IdCountry?: number;
  IdParentCashNavigation?: CashRegister;
  IdCountryNavigation?: Country;
  IdCityNavigation?: City;
  IdUserNavigation?: User;
  IdWarehouse: number;
  IdWarehouseNavigation : Warehouse;
  SessionCash: SessionCash[];
}

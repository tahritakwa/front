import { Resource } from '../shared/ressource.model';
import { Worker } from './worker.model';
import { Post } from './post.model';
import { ReducedCountry } from '../administration/reduced-country.model';
import { ReducedCity } from '../administration/reduced-city.model';
import { Warehouse } from '../inventory/warehouse.model'; 
import { RepairOrder } from './repair-order.model';

export class Garage extends Resource {
   Name: string;
   Phone: string;
   Address: string;
   IdResponsible: number;
   IdCountry: number;
   IdCity: number;
   IdWarehouse: number;
   PhoneNumber: string;
   IdWarehouseNavigation: Warehouse;
   IdCountryNavigation: ReducedCountry;
   IdCityNavigation: ReducedCity;
   IdResponsibleNavigation: Worker;
   NumberOfPosts: number;
   Worker: Array<Worker>;
   Post: Array<Post>;
   IdPhone: Number;
   IdPhoneNavigation: any;
   RepairOrder: Array<RepairOrder>;
}

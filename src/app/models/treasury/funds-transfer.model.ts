import { Currency } from "../administration/currency.model";
import { User } from "../administration/user.model";
import { Resource } from "../shared/ressource.model";
import { CashRegister } from "./cash-register.model";
import { FundsTransferStateEnum } from "./funds-transfer-state";
import { FundsTransferTypeEnum } from "./funds-transfer-type";

export class FundsTransfer extends Resource {
    Id: number;
    Code: string;
    TransferDate: Date;
    Type: FundsTransferTypeEnum;
    IdSourceCash: number;
    IdDestinationCash: number;
    Status?: FundsTransferStateEnum;
    Amount: number;
    AmountWithCurrency: number;
    IdCurrency: number;
    IdCashier?: number;
    IdCashierNavigation: User;
    IdCurrencyNavigation: Currency;
    IdSourceCashNavigation: CashRegister;
    IdDestinationCashNavigation: CashRegister;
  }
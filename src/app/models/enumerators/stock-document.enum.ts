export class StockDocumentEnumerator {

  public static InputMovement = 'IM';
  public static OutputMovement = 'OM';
  public static TransferMovement = 'TM';
  public static TransferShelfStorage = 'TShSt';
  public static Inventory = 'INV';

  get InputMovement() {
    return StockDocumentEnumerator.InputMovement;
  }
  get TransferShelfStorage() {
    return StockDocumentEnumerator.TransferShelfStorage;
  }

  get OutputMovement() {
    return StockDocumentEnumerator.OutputMovement;
  }

  get TransferMovement() {
    return StockDocumentEnumerator.TransferMovement;
  }

  get Inventory() {
    return StockDocumentEnumerator.Inventory;
  }
}

export function isBetweenKendoDropdowns(event: any): boolean {
  return isKendoAutocomplete(event) || isKendoKombobox(event) || isKendoDropdownlist(event) || isKendoMultiselect(event);
}

export function isKendoAutocomplete(event: any): boolean {
  return isEventPathContainingElementByName(event, 'kendo-autocomplete');
}

export function isKendoKombobox(event: any): boolean {
  return isEventPathContainingElementByName(event, 'kendo-combobox');
}

export function isKendoDropdownlist(event: any): boolean {
  return isEventPathContainingElementByName(event, 'kendo-dropdownlist');
}

export function isKendoMultiselect(event: any): boolean {
  return isEventPathContainingElementByName(event, 'kendo-multiselect');
}

export function isEventPathContainingElementByName(event: any, elementName: string): boolean {
  return event && event.path &&
    event.path.find((element: any) => element.localName && element.localName === elementName);
}

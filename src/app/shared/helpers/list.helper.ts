export function copyOfListByValue(listToCopy: any[]): any[] {
    const listToPaste = [];
    listToCopy.forEach(x => {
        listToPaste.push(x);
    });
    return listToPaste;
}
export function pushIfNotExist(listToPush: any[], elementToPush: any) {
    if (!listToPush.find(y => y === elementToPush)) {
        listToPush.push(elementToPush);
    }
}

/**
 * remove html tags from string
 * @param text
*/
export function htmlToPlaintext(textContainsHtmlTags): string {
    return textContainsHtmlTags ? String(textContainsHtmlTags).replace(/<[^>]+>/gm, '') : '';
}
export function checkStringRespectRegEx(myString: string, regEx: RegExp): boolean {
    return regEx.test(myString);
}

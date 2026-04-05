/**
 * doGet controller for serving the web application
 * This function is called when the web app URL is accessed
 * 
 * @returns HtmlOutput containing the React SPA
 * 
 * Note: XFrameOptionsMode.ALLOWALL is set to allow the web app to be
 * embedded in Google Workspace contexts (Sheets, Docs, etc.).
 * This is a standard pattern for Google Apps Script web applications.
 */
export function doGet(): GoogleAppsScript.HTML.HtmlOutput {
    const html = HtmlService.createHtmlOutputFromFile('index');
    return html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * doGet controller for serving the web application
 * This function is called when the web app URL is accessed
 */
export function doGet(): GoogleAppsScript.HTML.HtmlOutput {
    const html = HtmlService.createHtmlOutputFromFile('index');
    return html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

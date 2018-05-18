
import parser from 'ua-parser-js';
import generateMobileConfigFile from './generateMobileConfigFile';
import getCredentialsFromUrl from './getCredentialsFromUrl';

export default function(credentialTags, ua) {
  var fileSaveSupported = true;
  if (
    ua.browser.name.includes('Firefox') && ua.browser.major < 20
    || ua.browser.name.includes('Opera') && ua.browser.major < 15
    || ua.browser.name.includes('Safari') && ua.browser.major < 10
  ) {
    fileSaveSupported = true;
  }

  if (fileSaveSupported) {
    downloadLinkSupported();
  } else {
    downloadLinkUnsupported(ua);
  }

}


function downloadLinkSupported() {


  var credentials = getCredentialsFromUrl()
    , userAgent = parser(navigator.userAgent)
    , optionsOS = {
      MacOS: 'MacOS',
      Windows: 'Windows',
      iOS: 'iOS',
      Android: 'Android',
      Chromebook: 'Chromebook',
      Others: 'Others'
    };
  var file_text = generateMobileConfigFile(credentials)
  console.log(file_text)
  var a = document.createElement('a');
  a.href = 'data:application/x-apple-aspen-config; Charset=utf-8,' + encodeURIComponent(file_text);
  a.textContent = 'Download configuration file!';

  document.getElementById("downloadLink").innerHTML =
    '<ol>'
    + '<li>Download the automatic config file</li>'
    + '<div id=\'downloadLinkFile\'></div>'
    + '<li>Execute the file and follow the steps</li>'
    + '</ol>';
  document.getElementById("credentials").appendChild(a);

}


function downloadLinkForSafari() {

  // Generate html
  document.getElementById("downloadLink").innerHTML =
    '<h3>Hit download and cmd + S to save the file as "dappnode.mobileconfig"</h3>';
  + '<button class="btn" onclick="downloadMobileConfig()" id="btn_DL">DOWNLOAD</button>';

}


function downloadLinkUnsupported(ua) {

  // Generate html
  document.getElementById("downloadLink").innerHTML =
    '<ol>'
    + '<li>If you want to setup the VPN automatically, please open this page in any of these browsers:</li>'
    + '<p>Chrome, Firefox 20+, Safari 10.1+, Opera 15+, Edge</p>'
    + '<p>Your browser: <strong>' + ua.browser.name + '</strong> ' + ua.browser.version + '</p>'
    + '</ol>';

}
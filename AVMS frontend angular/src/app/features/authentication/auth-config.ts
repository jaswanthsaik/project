import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;
 
export const b2cPolicies = {
     names: {
         signUpSignIn: environment.signUpSignIn,
     },
     authorities: {
         signUpSignIn: {
             authority: environment.signUpSignInAuthority,
         }
     },
     authorityDomain: environment.authorityDomain,
 };
 
 
export const msalConfig: Configuration = {
     auth: {
         clientId: environment.clientId,
         authority: b2cPolicies.authorities.signUpSignIn.authority,
         knownAuthorities: [b2cPolicies.authorityDomain],
         redirectUri: environment.redirectUri, 
     },
     cache: {
         cacheLocation: BrowserCacheLocation.LocalStorage,
         storeAuthStateInCookie: isIE, 
     },
     system: {
         loggerOptions: {
            loggerCallback: (logLevel, message, containsPii) => {
                //console.log(message);
             },
             logLevel: LogLevel.Verbose,
             piiLoggingEnabled: false
         }
     }
 }

export const protectedResources = {
    testDataApi: {
      endpoint: "https://jsonplaceholder.typicode.com/posts",
      scopes: ["https://app.advancedvmsolutions.io"],
    },
    todoListApi: {
      endpoint: "https://localhost:8057/accounts",
      scopes: ["https://avmsqab2c.onmicrosoft.com/api/tasks.read"],
    },
}
export const loginRequest = {
  scopes: []
};
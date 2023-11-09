export const environment = {
  production: true,
  appVersion: require('../../package.json').version,
  
  clientId: '9d4a81aa-a156-43f4-9001-bac023f19289',
  redirectUri: 'https://app.kalibr8.io/',
  signUpSignIn: 'B2C_1_SignIn',
  signUpSignInAuthority: 'https://appkalibr8.b2clogin.com/appkalibr8.onmicrosoft.com/B2C_1_SignIn',
  authorityDomain: 'appkalibr8.b2clogin.com',

  baseLoginApiUrl: 'https://kalibr8prodwebapilogin.salmonrock-4e636d19.northeurope.azurecontainerapps.io/', 
  baseAccountApiUrl: 'https://kalibr8prodwebapiaccount.salmonrock-4e636d19.northeurope.azurecontainerapps.io/',
  baseResourceApiUrl: 'https://kalibr8prodwebapiresource.salmonrock-4e636d19.northeurope.azurecontainerapps.io/',
  baseReportApiUrl: 'https://kalibr8prodwebapireport.salmonrock-4e636d19.northeurope.azurecontainerapps.io/',
  dashboardApiUrl: 'https://kalibr8prodwebapiaccount.salmonrock-4e636d19.northeurope.azurecontainerapps.io/Dashboard/VVVVV/XXXXX',
  accountsApiUrl: 'https://kalibr8prodwebapiaccount.salmonrock-4e636d19.northeurope.azurecontainerapps.io/XXXXX/VVVVV',
  apiVersion: 'v2',
  qlikWebIntegrationId:'nVJKIACZcz5LdOgy3RappKJSxPDKrlr0',
  qlik_baseUrl: 'https://qnomwjd3u973b8f.eu.qlikcloud.com'
};
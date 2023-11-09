export const environment = {
  production: true,
  appVersion: require('../../package.json').version,
  
  clientId: '#{clientId}#', // 'cdc787f0-b9f4-4ca0-af29-31154b657b40',
  redirectUri: '#{redirectUri}#', // 'http://localhost:8057/',
  signUpSignIn: '#{signUpSignIn}#', // 'B2C_1_avms_qa_azure',
  signUpSignInAuthority: '#{signUpSignInAuthority}#', // 'https://avmsqab2c.b2clogin.com/avmsqab2c.onmicrosoft.com/B2C_1_avms_qa_azure',
  authorityDomain: '#{authorityDomain}#', // 'avmsqab2c.b2clogin.com',

  baseLoginApiUrl: '#{baseLoginApiUrl}#', // 'https://localhost:5007/',
  baseAccountApiUrl: '#{baseAccountApiUrl}#', // 'https://localhost:5001/',
  baseResourceApiUrl: '#{baseResourceApiUrl}#', // 'https://localhost:5003/',
  baseReportApiUrl: '#{baseReportApiUrl}#', // 'https://localhost:5005/',

  // Next two lines will be removed soon - KF 20220804
  dashboardApiUrl: '#{dashboardApiUrl}#', // 'https://localhost:5001/Dashboard/VVVVV/XXXXX',
  accountsApiUrl: '#{accountsApiUrl}#', // 'https://localhost:5001/XXXXX/VVVVV',

  apiVersion: '#{apiVersion}#', // 'v2'
  qlikWebIntegrationId:'nVJKIACZcz5LdOgy3RappKJSxPDKrlr0',

};
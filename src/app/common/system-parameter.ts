import { environment } from '../../environments/environment';

// regular expression
//export const REG_EXP_PROG_ID = /[A-Z]{2,2}_[0-9]{2,2}_[0-9]{4,4}[A-Z]/;

// jwt
export const JWT_ACCESS_TOKEN = 'access_token';
export const JWT_REFRESH_TOKEN = 'refresh_token';

// i18n
// export const I18N_PREFIX = 'assets/i18n/';
// export const I18N_SHARED_PREFIX = I18N_PREFIX + 'shared/';
// export const I18N_SUFFIX = '.json';
// export const I18N_ERROR_CODE = 'common.request.error.code.';

// frontend route
// export const MAIN_ROUTE = '/main';
// export const LOGIN_ROUTE = MAIN_ROUTE + '/LOGIN';

// rest api
export const REST_SERVER_URL = environment.APIUrl;
export const LOGIN_API = REST_SERVER_URL + '/login';
export const REST_API = REST_SERVER_URL + '/api/';

export const CAR_MODEL = 'XC40 Recharge';

// request & response option
export const HTTP_OPTION = {
  headers: { 'Content-Type': 'application/json' },
};
export const HTTP_OPTION_OBSERVE_RESPONSE = {
  headers: { 'Content-Type': 'application/json' },
  observe: 'response' as 'response'
};
export const HTTP_OPTION_URLENCODED = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
};
export const HTTP_OPTION_URLENCODED_OBSERVE_RESPONSE = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  observe: 'response' as 'response'
};
export const HTTP_OPTION_RESPONSE_BUFFER = {
  responseType: 'arraybuffer' as 'arraybuffer'
};

// error code
// export const ERROR_CODE_0 = 0;
// export const ERROR_CODE_401 = 401;
// export const ERROR_CODE_403 = 403;
// export const ERROR_CODE_500 = 500;
// export const ERROR_CODE_999 = 999;

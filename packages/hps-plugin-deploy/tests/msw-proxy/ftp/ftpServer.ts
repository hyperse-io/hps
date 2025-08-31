import { http, HttpResponse } from 'msw';
import { FTP_DEPLOY_API } from '../../constant.js';

export const ftpDeployApi = () => {
  return http.post(`${FTP_DEPLOY_API}/authorize`, () => {
    return HttpResponse.json({});
  });
};

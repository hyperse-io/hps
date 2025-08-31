import { http, HttpResponse } from 'msw';
import { ALIYUN_DEPLOY_API } from '../../constant.js';

export const aliyunDeployApi = () => {
  return http.post(`${ALIYUN_DEPLOY_API}/authorize`, () => {
    return HttpResponse.json({});
  });
};

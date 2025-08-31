import { http, HttpResponse } from 'msw';
import { AWS_DEPLOY_API } from '../../constant.js';

export const aswDeployApi = () => {
  return http.post(`${AWS_DEPLOY_API}/authorize`, () => {
    return HttpResponse.json({});
  });
};

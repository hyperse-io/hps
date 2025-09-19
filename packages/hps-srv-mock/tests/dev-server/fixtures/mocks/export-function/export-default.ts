import { type MockRequest, type MockResponse } from '@hyperse/hps-srv-mock';

export default {
  // without `/` prefix
  getExportDefaultFn1(_req: MockRequest, res: MockResponse): void {
    res.json({
      code: '0000',
      message: 'export default {...}',
      data: ['export default { getExportDefaultFn1:()=>{} }'],
    });
  },
  // with `/` prefix

  '/getExportDefaultFn2': (_req: MockRequest, res: MockResponse) => {
    res.json({
      code: '0000',
      message: 'export default {...}',
      data: ['export default { getExportDefaultFn2:()=>{} }'],
    });
  },
};

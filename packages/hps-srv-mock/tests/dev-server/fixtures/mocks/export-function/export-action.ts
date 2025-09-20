import { type MockRequest, type MockResponse } from '@hyperse/hps-srv-mock';

export function exportAction(_req: MockRequest, res: MockResponse): void {
  res.json({
    code: '0000',
    message: 'export function exportAction(...){...}',
    data: ['export function exportAction...'],
  });
}

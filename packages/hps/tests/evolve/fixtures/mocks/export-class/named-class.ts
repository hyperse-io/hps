import { getStr } from '@/utils';
import {
  alias,
  mockable,
  MockBase,
  type MockRequest,
  type MockResponse,
} from '@hyperse/hps-srv-mock';

@mockable()
export class MockExportClassService extends MockBase {
  constructor() {
    super({
      strategy: 'FileSystem',
    });
  }
  @alias('/export-named-class')
  async getCatalogs(_req: MockRequest, res: MockResponse) {
    await this.$cache.set('export-default-class', 'default-class');
    const cachedData = await this.$cache.get('export-default-class');
    const values = Object.values({ nane: 'ddd' });
    res.json(
      this.$mock({
        code: '0000',
        message: getStr('export named @mockable () class'),
        data: {
          cachedData,
          values,
        },
      })
    );
  }
}

import { getStr } from '@/utils';
import { alias, MockBase, type MockRequest, type MockResponse } from '@hyperse/hps-srv-mock';

// without @mockable()
class MockExportClassService extends MockBase {
  @alias('/new-instance-export-named-class')
  getCatalogs(_req: MockRequest, res: MockResponse): void {
    res.json(
      this.$mock({
        code: '0000',
        message: getStr(
          'export default new MockExportClassService(); without @mockable()'
        ),
        data: ['https://www.dev.hps.com/blog/img/hps_avatar.png'],
      })
    );
  }
}

export default new MockExportClassService();

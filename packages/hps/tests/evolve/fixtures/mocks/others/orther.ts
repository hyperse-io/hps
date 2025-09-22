import {
  alias,
  mockable,
  MockBase,
  type MockRequest,
  type MockResponse,
} from '@hyperse/hps-srv-mock';

@mockable()
export class MockService extends MockBase {
  @alias('other')
  test(_: MockRequest, res: MockResponse): void {
    res.json(
      this.$mock({
        code: '0000',
        message: 'other',
        data: {
          name: 'other',
        },
      })
    );
  }
}

import {
  alias,
  mockable,
  MockBase,
  type MockRequest,
  type MockResponse,
} from '@hyperse/hps-srv-mock';

@mockable()
export class MockService extends MockBase {
  @alias('queryProductListItem')
  test(_: MockRequest, res: MockResponse): void {
    res.json(
      this.$mock({
        code: '0000',
        message: 'queryProductListItem',
        data: {
          cname: '@cname',
          datetime: '@datetime',
          image: '@image',
          color: '@color',
          url: '@url',
          email: '@email',
          ip: '@ip',
          address: '@county(true)',
          idcard: '@id',
          guid: '@guid',
        },
      })
    );
  }
}

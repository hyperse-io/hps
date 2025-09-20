import { IsNumber, IsString } from 'class-validator';
import { getStr } from '@/utils';
import {
  alias,
  mockable,
  MockBase,
  type MockRequest,
  type MockResponse,
  validation,
} from '@hyperse/hps-srv-mock';

class Dto {
  @IsString()
  name: string;

  @IsNumber()
  pwd: string;
}

class Dto2 {
  @IsString()
  sex: string;

  @IsNumber()
  famale: string;
}

@mockable()
export default class MockDefaultExportClassService extends MockBase {
  // `pure` variable
  private pureList = ['1', '2', '3'];

  // `normal` help function
  private normalFn() {
    return `hello`;
  }

  @alias('/export-default-class')
  async getCatalogs(
    @validation(Dto, {
      bodyResolver(req) {
        return req.body.xxx;
      },
    })
    @validation(Dto2)
    _req: MockRequest,
    res: MockResponse
  ): Promise<void> {
    res.json(
      this.$mock({
        code: '0000',
        message: getStr(
          `export default @mockable () class ${this.normalFn()} ${JSON.stringify(
            this.pureList
          )}`
        ),
        data: ['https://www.hps.com/blog/img/hps_avatar.png'],
      })
    );
  }
}

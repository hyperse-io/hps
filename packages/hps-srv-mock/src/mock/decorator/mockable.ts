/**
 * @Mockable()
 * Indicates this class is used as mock service, it will auto instance.
 * Allow us define mock service as below `·`scenarios`
 * @example
 * ```ts
 * // The first scenario
 * `@mockable()`
 * export default class MockProductService extends MockBase {
 * }
 * // The second scenario
 * `@mockable()`
 * export class MockCatalogService extends MockBase {}
 *
 * // The third scenario
 * class MockUserService extends MockBase{}
 * module.exports = new MockUserService()
 *
 * // The forth scenario
 * export function getAds(_req: MockRequest, res: MockResponse): void {
 * }
 *
 * // The five scenario
 * module.exports = {
 *    banner: (req, res) => {
 *       ... res.json()
 *    }
 * }
 * ```
 */
export const mockable = () => {
  return function (target: any): void {
    Object.defineProperty(target, 'mockable', {
      value: true,
      writable: false,
    });
  };
};

import { server } from '../index.js';

describe('Update', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should render', () => {
    expect(true).toBe(true);
  });
});

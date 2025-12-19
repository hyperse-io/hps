import { combineUrls, isHttpUrl, modifyQueryString } from '@dimjs/utils';

type FetcherOptions = {
  timeout?: number;
  headers?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, string>;
};

class FetcherClient {
  private baseURL: string = '';
  private headers: Record<string, string> = {};

  async request<T>(
    endpoint: string,
    options: FetcherOptions & { body?: string } = {}
  ): Promise<T> {
    let url: string;
    if (isHttpUrl(endpoint)) {
      url = endpoint;
    } else {
      url = combineUrls(this.baseURL, endpoint);
    }
    const headers = { ...this.headers, ...options.headers };

    const timeout = options.timeout || 30000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return (await response.json()) as T;
      } else {
        return (await response.text()) as T;
      }
    } catch (error: any) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Request timed out');
      } else {
        console.error(error.message);
      }
      return {} as T;
    }
  }

  get<T>(endpoint: string, options: FetcherOptions = {}): Promise<T> {
    const { params = {}, ...rest } = options;
    const url = modifyQueryString(endpoint, params);
    return this.request<T>(url, {
      ...rest,
      method: 'GET',
    });
  }

  post<T>(endpoint: string, options: FetcherOptions = {}): Promise<T> {
    const { params = {}, ...rest } = options;
    return this.request<T>(endpoint, {
      ...rest,
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  put<T>(endpoint: string, options: FetcherOptions = {}): Promise<T> {
    const { params = {}, ...rest } = options;
    return this.request<T>(endpoint, {
      ...rest,
      method: 'PUT',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  delete<T>(endpoint: string, options: FetcherOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

const fetcher = new FetcherClient();

export { fetcher };

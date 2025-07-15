import type { RequestOptions, RequestParams } from "../types";

async function request<TData = unknown, TResult = unknown>({
    method,
    url,
    data,
    options = {},
}: RequestParams<TData>): Promise<TResult | undefined> {
    const config: RequestInit = {
        ...options,
        method: method !== 'GET' ? method : 'GET',
        headers: {
            ...(options.headers || {}),
        },
    };

    if (data && method !== 'GET') {
        config.headers = {
            'Content-Type': 'application/json',
            ...config.headers,
        };
        config.body = JSON.stringify(data);
    }

    const authRaw = localStorage.getItem('auth');
    if (authRaw) {
        try {
            const auth = JSON.parse(authRaw);
            if (auth?.accessToken) {
                config.headers = {
                    'X-Authorization': auth.accessToken,
                    ...config.headers,
                };
            }
        } catch {
            console.warn('Invalid auth data in localStorage');
        }
    }

    const response = await fetch(url, config);
    const contentType = response.headers.get('Content-Type');

    if (!contentType) return;

    if (contentType.includes('application/json')) {
        return (await response.json()) as TResult;
    }

    return undefined;
}

const http = {
    get<TResult = unknown>(url: string, options?: RequestOptions) {
        return request<undefined, TResult>({ method: 'GET', url, options });
    },
    post<TData = unknown, TResult = unknown>(url: string, data: TData, options?: RequestOptions) {
        return request<TData, TResult>({ method: 'POST', url, data, options });
    },
    put<TData = unknown, TResult = unknown>(url: string, data: TData, options?: RequestOptions) {
        return request<TData, TResult>({ method: 'PUT', url, data, options });
    },
    delete<TResult = unknown>(url: string, options?: RequestOptions) {
        return request<undefined, TResult>({ method: 'DELETE', url, options });
    },
    baseRequest: request,
};

export default http;
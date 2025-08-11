import type { RequestOptions, RequestParams } from "../types";

async function request<TData = unknown, TResult = unknown>({
    method,
    url,
    data,
    options = {},
}: RequestParams<TData>): Promise<TResult | undefined> {
    const headers: HeadersInit = {
        ...(options.headers || {}),
    };

    const authRaw = localStorage.getItem('auth');
    if (authRaw) {
        try {
            const auth = JSON.parse(authRaw);
            if (auth?.accessToken) {
                headers['Authorization'] = `Bearer ${auth.accessToken}`;
            }
        } catch {
            console.warn('Invalid auth data in localStorage');
        }
    }

    const config: RequestInit = {
        ...options,
        method: method !== 'GET' ? method : 'GET',
        signal: options.signal,
        headers,
    };

    if (data && method !== 'GET') {
        headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
        switch (response.status) {
            case 401: return "Unauthorized" as unknown as TResult;
            case 500: return "Internal Server Error" as unknown as TResult;
        }
        const error = await response.json();
        throw error;
    }

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

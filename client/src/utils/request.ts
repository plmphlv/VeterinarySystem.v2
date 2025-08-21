import type { RequestOptions, RequestParams } from "../types";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    const authRaw = localStorage.getItem("auth");
    if (!authRaw) return null;

    const auth = JSON.parse(authRaw);
    if (!auth?.refreshToken) return null;

    isRefreshing = true;

    refreshPromise = fetch(`${import.meta.env.VITE_BASE_API_URL}/Users/RefreshToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: auth.refreshToken }),
    })
        .then(async (res) => {
            if (!res.ok) throw new Error("Refresh failed");
            const data = await res.json();

            const newAuth = {
                ...auth,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken ?? auth.refreshToken,
            };
            localStorage.setItem("auth", JSON.stringify(newAuth));

            return newAuth.accessToken;
        })
        .catch(() => null)
        .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
        });

    return refreshPromise;
}

async function request<TData = unknown, TResult = unknown>({
    method,
    url,
    data,
    options = {},
}: RequestParams<TData>): Promise<TResult | undefined> {
    const headers: HeadersInit = {
        ...(options.headers || {}),
    };

    const authRaw = localStorage.getItem("auth");
    if (authRaw) {
        try {
            const auth = JSON.parse(authRaw);
            if (auth?.accessToken) {
                headers["Authorization"] = `Bearer ${auth.accessToken}`;
            }
        } catch {
            console.warn("Invalid auth data in localStorage");
        }
    }

    const config: RequestInit = {
        ...options,
        method: method !== "GET" ? method : "GET",
        signal: options.signal,
        headers,
    };

    if (data && method !== "GET") {
        headers["Content-Type"] = "application/json";
        config.body = JSON.stringify(data);
    }

    let response = await fetch(url, config);

    // ⚡ Ако токенът е изтекъл → пробваме refresh
    if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            headers["Authorization"] = `Bearer ${newToken}`;
            response = await fetch(url, config);
        }
    }

    if (!response.ok) {
        if (response.status === 401) {
            // ❌ refresh-а е паднал -> редирект към logout
            // Тук няма navigate, просто хвърляме специална грешка
            localStorage.removeItem("auth");
            window.location.href = "/logout";
        }

        if (response.status === 500) {
            return "Internal Server Error" as unknown as TResult;
        }

        const error = await response.json();
        throw error;
    }

    const contentType = response.headers.get("Content-Type");
    if (!contentType) return;

    if (contentType.includes("application/json")) {
        return (await response.json()) as TResult;
    }

    return undefined;
}

const http = {
    get<TResult = unknown>(url: string, options?: RequestOptions) {
        return request<undefined, TResult>({ method: "GET", url, options });
    },
    post<TData = unknown, TResult = unknown>(
        url: string,
        data: TData,
        options?: RequestOptions
    ) {
        return request<TData, TResult>({ method: "POST", url, data, options });
    },
    put<TData = unknown, TResult = unknown>(
        url: string,
        data: TData,
        options?: RequestOptions
    ) {
        return request<TData, TResult>({ method: "PUT", url, data, options });
    },
    delete<TResult = unknown>(url: string, options?: RequestOptions) {
        return request<undefined, TResult>({ method: "DELETE", url, options });
    },
    baseRequest: request,
};

export default http;

import type { RequestOptions, RequestParams } from "../types";
import { getJwtDecodedData } from "./getJwtDecodedData";

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
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({ refreshToken: auth.refreshToken }),
    })
        .then(async (res) => {
            if (!res.ok) throw new Error("Refresh failed");

            const data = await res.json();

            if (!data.isSuccessful || !data.accessToken) {
                throw new Error("Invalid refresh response");
            }

            const newAuth = {
                ...auth,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            };

            localStorage.setItem("auth", JSON.stringify(newAuth));
            return newAuth.accessToken;
        })
        .catch(() => {
            localStorage.removeItem("auth");
            window.location.href = "/login";
            return null;
        })
        .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
        });

    return refreshPromise;
}

async function ensureValidAccessToken(): Promise<string | null> {
    const authRaw = localStorage.getItem("auth");
    if (!authRaw) return null;

    const auth = JSON.parse(authRaw);
    const accessToken = auth?.accessToken;
    if (!accessToken) return null;

    const decodedData = getJwtDecodedData();

    if (!decodedData) {
        return null;
    }

    const now = Math.floor(Date.now() / 1000);
    const timeLeft = decodedData.exp - now;

    if (timeLeft >= 0 && timeLeft <= 300) {
        return await refreshAccessToken();
    }

    return accessToken;
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

    const accessToken = await ensureValidAccessToken();
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
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

    const response = await fetch(url, config);

    if (!response.ok) {
        const errorObject = await response.json();

        if (response.status === 400 || response.status === 404 || response.status === 500) {
            throw errorObject;
        }

        if (response.status === 401) {
            localStorage.removeItem("auth");
            window.location.href = "/login";
            return;
        }

        // if (response.status === 500) {
        //     throw "Internal server error, please try again later!";
        // }

        let message: string;
        try {
            const errorBody = await response.json();
            message = errorBody?.message || JSON.stringify(errorBody);
        } catch {
            message = response.statusText || "Unknown error";
        }
        throw new Error(message || `HTTP error: ${response.status}`);
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

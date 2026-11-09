// Cliente para componentes do navegador. O Next.js encaminha para o Express.
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest(path, { token, body, headers, ...options } = {}) {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("Use um caminho relativo da API, como /perfis.");
  }
  const requestHeaders = new Headers(headers);
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`/api/backend${path}`, {
    ...options,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : null; }
  catch { data = null; }
  if (!response.ok) {
    throw new ApiError(data?.erro || data?.mensagem || `Erro na API (${response.status}).`, response.status);
  }
  return data;
}

export const authApi = {
  login: (email, senha) => apiRequest("/auth/login", { method: "POST", body: { email, senha } }),
};

export const saudeApi = {
  listar: (token) => apiRequest("/saude", { token }),
};

export const perfilApi = {
  obter: (token) => apiRequest("/perfis", { token }),
};

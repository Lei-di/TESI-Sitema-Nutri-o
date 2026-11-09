// Cliente para componentes do navegador. O Next.js encaminha para o Express.
export class ApiError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

const unavailableMessage = "O serviço está indisponível no momento. Tente novamente em instantes.";

export async function apiRequest(path, { token, body, headers, ...options } = {}) {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("Use um caminho relativo da API, como /perfis.");
  }
  const requestHeaders = new Headers(headers);
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`/api/backend${path}`, {
      ...options,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch (error) {
    if (error.name === "AbortError" || error.name === "TimeoutError") {
      throw new ApiError("A solicitação demorou mais que o esperado. Tente novamente.", 0);
    }
    throw new ApiError("Não foi possível conectar. Verifique sua conexão e tente novamente.", 0);
  }

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    if (response.ok) {
      throw new ApiError("O serviço retornou uma resposta inesperada. Tente novamente.", response.status);
    }
  }

  if (!response.ok) {
    if (response.status >= 500) {
      throw new ApiError(unavailableMessage, response.status);
    }
    const errors = Array.isArray(data?.erros)
      ? data.erros.filter((message) => typeof message === "string" && message.trim())
      : [];
    const message = errors.length
      ? errors.join(" ")
      : [data?.erro, data?.mensagem].find((value) => typeof value === "string" && value.trim())
        || "Não foi possível concluir a solicitação. Tente novamente.";
    throw new ApiError(message, response.status, errors);
  }
  return data;
}

export const usuarioApi = {
  criar: (dados, { signal } = {}) => apiRequest("/usuarios", {
    method: "POST",
    body: dados,
    signal,
  }),
};

export const authApi = {
  login: (email, senha, { signal } = {}) => apiRequest("/auth/login", { method: "POST", body: { email, senha }, signal }),
};

export const saudeApi = {
  listar: (token) => apiRequest("/saude", { token }),
};

export const perfilApi = {
  obter: (token) => apiRequest("/perfis", { token }),
};

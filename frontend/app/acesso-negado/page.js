
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AcessoNegadoPage() {
  const [temSessao, setTemSessao] = useState(false);

  useEffect(() => {
    try {
      const sessao = JSON.parse(
        sessionStorage.getItem("healthlog-session") || "null"
      );

      setTemSessao(Boolean(sessao?.token));
    } catch {
      setTemSessao(false);
    }
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#f5f7f6",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "48px 32px",
          borderRadius: "20px",
          background: "#ffffff",
          textAlign: "center",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: "76px",
            height: "76px",
            margin: "0 auto 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: "#fff0ed",
            color: "#c94b38",
            fontSize: "36px",
            fontWeight: "bold",
          }}
        >
          !
        </div>

        <span
          style={{
            color: "#668477",
            fontSize: "12px",
            fontWeight: "bold",
            letterSpacing: "2px",
          }}
        >
          HEALTHLOG
        </span>

        <h1
          style={{
            margin: "14px 0",
            color: "#243b32",
            fontSize: "28px",
          }}
        >
          Acesso não autorizado
        </h1>

        <p
          style={{
            margin: "0 auto 28px",
            maxWidth: "360px",
            color: "#66736d",
            fontSize: "15px",
            lineHeight: 1.7,
          }}
        >
          Você não tem permissão para acessar este conteúdo.
          Se acredita que isso aconteceu por engano, entre em
          contato com o administrador do sistema.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {temSessao && (
            <Link
              href="/dashboard"
              style={{
                padding: "14px 20px",
                borderRadius: "10px",
                background: "#527c68",
                color: "#ffffff",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Voltar ao Dashboard
            </Link>
          )}

          <Link
            href="/login"
            style={{
              padding: "14px 20px",
              borderRadius: "10px",
              border: "1px solid #dce5df",
              color: "#365b49",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Entrar novamente
          </Link>
        </div>

        <p
          style={{
            marginTop: "28px",
            color: "#89948e",
            fontSize: "12px",
          }}
        >
          HealthLog — Seu acompanhamento de saúde.
        </p>
      </section>
    </main>
  );
}

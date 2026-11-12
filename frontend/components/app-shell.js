"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./app-shell.module.css";

const navegacao = [
  { href: "/dashboard", label: "Dashboard", simbolo: "▦" },
  { href: "/perfil", label: "Perfil de saúde", simbolo: "♡" },
  { href: "/diario", label: "Diário de saúde", simbolo: "▤" },
  { href: "/relatorios", label: "Relatórios", simbolo: "▥" },
];

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    try {
      const sessaoSalva = sessionStorage.getItem("healthlog-session");

      if (!sessaoSalva) {
        router.replace("/login");
        return;
      }

      const sessao = JSON.parse(sessaoSalva);

      if (!sessao.token) {
        sessionStorage.removeItem("healthlog-session");
        router.replace("/login");
        return;
      }

      setUsuario(sessao.usuario || null);
      setCarregando(false);
    } catch {
      sessionStorage.removeItem("healthlog-session");
      router.replace("/login");
    }
  }, [router]);

  function sair() {
    sessionStorage.removeItem("healthlog-session");
    router.replace("/login");
  }

  if (carregando) {
    return (
      <div className={styles.loading}>
        Carregando HealthLog...
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <Link href="/dashboard" className={styles.brand}>
          <span className={styles.brandIcon}>H</span>
          <span>HealthLog</span>
        </Link>

        <p className={styles.menuTitle}>MENU PRINCIPAL</p>

        <nav
          className={styles.navigation}
          aria-label="Menu principal"
        >
          {navegacao.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${
                pathname === item.href ? styles.active : ""
              }`}
            >
              <span
                className={styles.navIcon}
                aria-hidden="true"
              >
                {item.simbolo}
              </span>

              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {(usuario?.nome || usuario?.email || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className={styles.userText}>
              <strong>{usuario?.nome || "Usuário"}</strong>
              <span>{usuario?.email || "Conta HealthLog"}</span>
            </div>
          </div>

          <button
            type="button"
            className={styles.logout}
            onClick={sair}
          >
            ↪ Sair da conta
          </button>
        </div>
      </aside>

      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <div>
            <span className={styles.topbarLabel}>
              ESPAÇO DE SAÚDE
            </span>

            <strong>Seu acompanhamento diário</strong>
          </div>

          <span className={styles.status}>
            <span className={styles.statusDot} />
            Área pessoal
          </span>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
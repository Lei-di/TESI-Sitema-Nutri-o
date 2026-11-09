import Link from "next/link";
import LoginForm from "@/components/login-form";
import styles from "@/app/cadastro/cadastro.module.css";

export const metadata = {
  title: "Entrar | HealthLog",
  description: "Acesse sua conta no HealthLog com seu e-mail e sua senha.",
};

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="HealthLog, página inicial">HealthLog<span aria-hidden="true">.</span></Link>
        <Link href="/" className={styles.backLink}><span aria-hidden="true">←</span> Voltar ao início</Link>
      </header>
      <div className={styles.content}>
        <section className={styles.intro} aria-labelledby="login-welcome-title">
          <p className="eyebrow">CONTINUE A CUIDAR DE VOCÊ</p>
          <h1 id="login-welcome-title">Bom ter você<br /><span>de volta.</span></h1>
          <p className={styles.description}>Cada dia é uma nova oportunidade de cuidar da sua rotina. Entre com seu e-mail e sua senha para acessar sua conta.</p>
          <p className={styles.note}>No seu tempo. Do seu jeito.</p>
        </section>
        <LoginForm />
      </div>
      <footer className={styles.footer}>HealthLog · Seu diário de saúde</footer>
    </main>
  );
}

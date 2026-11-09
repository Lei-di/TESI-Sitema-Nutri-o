import Link from "next/link";
import CadastroForm from "@/components/cadastro-form";
import styles from "./cadastro.module.css";

export const metadata = {
  title: "Crie sua conta | HealthLog",
  description: "Crie sua conta no HealthLog e dê o primeiro passo para acompanhar seus hábitos e sua saúde.",
};

export default function CadastroPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="HealthLog, página inicial">HealthLog<span aria-hidden="true">.</span></Link>
        <Link href="/" className={styles.backLink}><span aria-hidden="true">←</span> Voltar ao início</Link>
      </header>
      <div className={styles.content}>
        <section className={styles.intro} aria-labelledby="welcome-title">
          <p className="eyebrow">SEU BEM-ESTAR COMEÇA AQUI</p>
          <h1 id="welcome-title">Um novo hábito.<br /><span>Um novo começo.</span></h1>
          <p className={styles.description}>Pequenos cuidados fazem diferença. Crie sua conta e dê o primeiro passo para conhecer melhor sua rotina.</p>
          <div className={styles.benefits}>
            <div className={styles.benefit}>
              <span className={styles.icon} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Z" /><path d="M9 15a3 3 0 0 0 3 3" /></svg></span>
              <div><h2>Cuide dos seus hábitos</h2><p>Água, sono e movimento no seu dia a dia.</p></div>
            </div>
            <div className={styles.benefit}>
              <span className={styles.icon} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="m12 12 8-8M16 4h4v4" /></svg></span>
              <div><h2>Encontre seu ritmo</h2><p>Metas que acompanham a sua jornada.</p></div>
            </div>
            <div className={styles.benefit}>
              <span className={styles.icon} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 5v15h16M7 15l5-5 4 3 5-7M16 6h5v5" /></svg></span>
              <div><h2>Valorize cada passo</h2><p>Seu progresso começa com o cuidado de hoje.</p></div>
            </div>
          </div>
          <p className={styles.note}>No seu tempo. Do seu jeito.</p>
        </section>
        <CadastroForm />
      </div>
      <footer className={styles.footer}>HealthLog · Seu diário de saúde</footer>
    </main>
  );
}

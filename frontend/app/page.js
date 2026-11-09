import Link from "next/link";

export default function Home() {
  return (
    <main>
      <header>
        <span className="brand">HealthLog</span>
        <nav className="home-nav" aria-label="Acesso à conta">
          <Link className="home-login" href="/login">Entrar</Link>
          <Link className="home-signup" href="/cadastro">Criar conta <span aria-hidden="true">→</span></Link>
        </nav>
      </header>
      <section className="intro">
        <p className="eyebrow">UM PASSO DE CADA VEZ</p>
        <h1>Mais cuidado com você, todos os dias.</h1>
        <p>Um espaço para seus hábitos, registros e metas. Dê o primeiro passo para uma rotina com mais cuidado.</p>
        <Link className="home-cta" href="/cadastro">Começar agora <span aria-hidden="true">→</span></Link>
      </section>
      <div className="cards">
        <article><span>01</span><h2>Seus hábitos</h2><p>Água, sono e exercícios para acompanhar a rotina.</p></article>
        <article><span>02</span><h2>Suas metas</h2><p>Um perfil de saúde para orientar seus próximos passos.</p></article>
        <article><span>03</span><h2>Sua evolução</h2><p>Um histórico para conhecer melhor seu progresso.</p></article>
      </div>
      <footer>HealthLog · Seu diário de saúde</footer>
    </main>
  );
}

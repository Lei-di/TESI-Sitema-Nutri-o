export default function Home() {
  return (
    <main>
      <header><span className="brand">HealthLog</span><span>Diário de saúde</span></header>
      <section className="intro">
        <p className="eyebrow">UM PASSO DE CADA VEZ</p>
        <h1>Mais cuidado com você, todos os dias.</h1>
        <p>A base do seu diário de saúde está pronta. Em breve, acompanhe seus hábitos, registros e metas em um só lugar.</p>
      </section>
      <div className="cards">
        <article><span>01</span><h2>Seus hábitos</h2><p>Água, sono e exercícios para acompanhar a rotina.</p></article>
        <article><span>02</span><h2>Suas metas</h2><p>Um perfil de saúde para orientar seus próximos passos.</p></article>
        <article><span>03</span><h2>Sua evolução</h2><p>Um histórico para conhecer melhor seu progresso.</p></article>
      </div>
      <footer>HealthLog · Estrutura inicial do projeto</footer>
    </main>
  );
}

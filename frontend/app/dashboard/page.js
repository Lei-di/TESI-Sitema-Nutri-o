
import AppShell from "../../components/app-shell";

export default function DashboardPage() {
  return (
    <AppShell>
      <section>
        <p className="eyebrow">VISÃO GERAL</p>
        <h1>Dashboard</h1>
        <p>
          Acompanhe seus hábitos e consulte sua evolução em saúde.
        </p>

        <div className="dashboard-placeholder">
          <h2>Seu acompanhamento começa aqui</h2>
          <p>
            Os indicadores de água, sono e atividade física serão
            apresentados nesta área a partir dos seus registros.
          </p>
        </div>
      </section>
    </AppShell>
  );
}

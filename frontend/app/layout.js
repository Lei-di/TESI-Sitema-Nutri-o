import "./globals.css";

export const metadata = {
  title: "HealthLog | Diário de saúde",
  description: "Acompanhe seus hábitos e sua evolução com o HealthLog.",
};

export default function RootLayout({ children }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}

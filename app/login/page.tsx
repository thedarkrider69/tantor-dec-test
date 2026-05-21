import Link from "next/link";
import { loginAction } from "@/lib/actions";
import { ErrorMessage } from "@/components/forms";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <Link className="logo" href="/"><span className="logo-mark">T</span><span>Tantor Déc</span></Link>
        <h1>Connectez-vous à votre compte</h1>
        <p>Accédez à vos entreprises, déclarations, factures et à votre tableau de bord fiscal.</p>
      </aside>
      <main className="auth-panel">
        <form className="auth-card form" action={loginAction}>
          <h2>Connexion</h2>
          <ErrorMessage message={searchParams.error} />
          <label className="label">Adresse email<input name="email" className="input" type="email" placeholder="user@tantordec.fr" required /></label>
          <label className="label">Mot de passe<input name="password" className="input" type="password" placeholder="••••••••" required /></label>
          <button className="btn btn-primary" type="submit">Se connecter</button>
          <p><Link href="/forgot-password">Mot de passe oublié ?</Link></p>
          <p>Vous n'avez pas de compte ? <Link href="/register"><strong>Créer un compte</strong></Link></p>
          <div className="card" style={{padding: 14}}>
            <strong>Comptes de test</strong>
            <p style={{margin: 0}}>user@tantordec.fr / User123!</p>
            <p style={{margin: 0}}>admin@tantordec.fr / Admin123!</p>
          </div>
        </form>
      </main>
    </div>
  );
}

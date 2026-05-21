import Link from "next/link";
import { registerAction } from "@/lib/actions";
import { ErrorMessage } from "@/components/forms";

export default function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <Link className="logo" href="/"><span className="logo-mark">T</span><span>Tantor Déc</span></Link>
        <h1>Simplifiez vos déclarations fiscales</h1>
        <p>Créez votre espace et commencez à organiser vos entreprises et déclarations.</p>
      </aside>
      <main className="auth-panel">
        <form className="auth-card form" action={registerAction}>
          <h2>Créer un compte</h2>
          <ErrorMessage message={searchParams.error} />
          <label className="label">Nom complet<input name="fullName" className="input" placeholder="Jean Dupont" required /></label>
          <label className="label">Nom du cabinet<input name="cabinet" className="input" placeholder="Cabinet Comptable" /></label>
          <label className="label">Adresse email<input name="email" className="input" type="email" placeholder="votre@email.com" required /></label>
          <label className="label">Mot de passe<input name="password" className="input" type="password" minLength={8} required /></label>
          <label className="label">Confirmer le mot de passe<input name="confirmPassword" className="input" type="password" minLength={8} required /></label>
          <button className="btn btn-primary" type="submit">Créer un compte</button>
          <p>Vous avez déjà un compte ? <Link href="/login"><strong>Se connecter</strong></Link></p>
        </form>
      </main>
    </div>
  );
}

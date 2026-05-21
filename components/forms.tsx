export function SubmitButton({ children = "Enregistrer" }: { children?: React.ReactNode }) {
  return <button className="btn btn-primary" type="submit">{children}</button>;
}

export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <div className="error">{message}</div>;
}

export function Notice({ children }: { children: React.ReactNode }) {
  return <div className="notice">{children}</div>;
}

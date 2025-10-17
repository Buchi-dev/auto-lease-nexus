import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Access denied</h1>
        <p className="text-muted-foreground mb-6">You do not have permission to view this page.</p>
        <div className="space-x-3">
          <Link className="underline" to="/dashboard">Go to dashboard</Link>
          <Link className="underline" to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

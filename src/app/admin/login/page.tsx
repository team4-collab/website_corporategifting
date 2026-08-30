import { redirect } from "next/navigation";
import { login } from "@/lib/actions/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function loginAction(formData: FormData) {
    "use server";
    const result = await login(formData);
    if (result?.error) {
      redirect(`/admin/login?error=${encodeURIComponent(result.error)}`);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="text-xl font-semibold">Admin Login</h1>
      <p className="mt-1 text-sm text-muted">Sign in to manage the site.</p>

      <form action={loginAction} className="mt-6 space-y-3">
        <input
          required
          type="email"
          name="email"
          placeholder="Email"
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
        <input
          required
          type="password"
          name="password"
          placeholder="Password"
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

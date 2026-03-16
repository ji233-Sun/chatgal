"use client";

export default function LoginButton() {
  return (
    <a
      href="/api/auth/login"
      className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
      </svg>
      使用 SecondMe 登录
    </a>
  );
}

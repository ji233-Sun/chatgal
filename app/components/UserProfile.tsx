"use client";

import { useEffect, useState } from "react";

interface UserProfileProps {
  user: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
    route: string | null;
  };
}

interface Shade {
  name?: string;
  label?: string;
  description?: string;
}

export default function UserProfile({ user }: UserProfileProps) {
  const [shades, setShades] = useState<Shade[]>([]);
  const [loadingShades, setLoadingShades] = useState(true);

  useEffect(() => {
    fetch("/api/user/shades")
      .then((res) => res.json())
      .then((result) => {
        if (result.code === 0 && result.data?.shades) {
          setShades(result.data.shades);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingShades(false));
  }, []);

  const secondmeUrl = user.route
    ? `https://second.me/${user.route}`
    : null;

  return (
    <div className="flex w-full max-w-md flex-col items-center">
      {/* Avatar Card */}
      <div className="w-full rounded-3xl bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || "用户头像"}
              className="h-24 w-24 rounded-full border-4 border-primary-light object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-light text-3xl font-bold text-primary">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
          )}

          {/* Name */}
          <h2 className="mt-4 text-xl font-bold">
            {user.name || "SecondMe 用户"}
          </h2>

          {/* SecondMe Link */}
          {secondmeUrl && (
            <a
              href={secondmeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              访问 SecondMe 主页
            </a>
          )}
        </div>
      </div>

      {/* Shades / Interest Tags */}
      <div className="mt-6 w-full rounded-3xl bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-muted">兴趣标签</h3>
        {loadingShades ? (
          <div className="flex justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : shades.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {shades.map((shade, index) => (
              <span
                key={index}
                className="inline-block rounded-full bg-accent/50 px-4 py-1.5 text-sm font-medium text-foreground/80"
              >
                {shade.name || shade.label || "未知"}
              </span>
            ))}
          </div>
        ) : (
          <p className="py-2 text-center text-sm text-muted">
            还没有兴趣标签
          </p>
        )}
      </div>
    </div>
  );
}

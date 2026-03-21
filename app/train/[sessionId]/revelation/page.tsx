"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "arcadeui";
import RevelationEffect from "@/app/components/train/RevelationEffect";

export default function RevelationPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F23]">
      <RevelationEffect
        active
        isPhantom
        stranger={null}
        resonanceScore={null}
        onComplete={() => router.push(`/train/${sessionId}`)}
      />
      <div className="relative z-[2100] flex flex-col items-center gap-4">
        <p className="font-pixel text-xs text-white/50">REVELATION_PREVIEW</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push(`/train/${sessionId}`)}
          className="!font-pixel !text-[10px]"
        >
          返回观测页
        </Button>
      </div>
    </div>
  );
}

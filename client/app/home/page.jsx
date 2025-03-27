'use client'
import TokenValidator from "@/components/TokenValidator";

export default function Home() {
  return (
    <TokenValidator>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-8">
        <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
      </div>
    </TokenValidator>
  );
}

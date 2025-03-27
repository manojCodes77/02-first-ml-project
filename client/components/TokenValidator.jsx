'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Loader from "@/components/Loader";

export default function TokenValidator({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          setLoading(false); // Token is valid
        } else {
          // Token expired
          localStorage.removeItem("Authorization");
          router.push("/login");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("Authorization");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-8">
        <Loader />
        <Loader />
        <Loader />
      </div>
    ); // Show loader while checking token
  }

  return <>{children}</>;
}

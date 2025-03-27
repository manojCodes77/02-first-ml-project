"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { TimeGenerator } from "@/components/CurrentTime";
import Loader from "@/components/Loader";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = TimeGenerator();
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          router.push("/predictdata");
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
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-8">
      <Loader />
      <Loader />
      <Loader />
    </div>; // Show loader while checking token
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-8">
      <Loader />
      <Loader />
      <Loader />
    </div>
  );
}

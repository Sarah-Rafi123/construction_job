// components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCurrentUser, clearCurrentUser } from "@/store/slices/userSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/v0/get-me", {
          withCredentials: true,
        });

        const user = response.data;
        dispatch(setCurrentUser(user));

        if (allowedRoles && !allowedRoles.includes(user.role)) {
          console.error("User role not authorized:", user.role);
          router.replace("/unauthorized");
        }
      } catch (error) {
        console.error("Not authenticated:", error);
        dispatch(clearCurrentUser());
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, router, allowedRoles]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

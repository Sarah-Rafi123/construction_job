// components/ProtectedRoute.tsx
"use client";
import socket from "@/lib/socket/connectSocket";
console.log("called called");
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, clearCurrentUser } from "@/store/slices/userSlice";
import { RootState } from "@/store";
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state: RootState) => state.user?.currentUser || "");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/v0/get-me", {
          withCredentials: true,
        });
        const user = response.data.data;
        dispatch(setCurrentUser(user));

        if (allowedRoles && !allowedRoles.includes(user.role)) {
          router.replace("/unauthorized");
          return;
        }
        setLoading(false);
        socket.connect();
      } catch (error) {
        console.error("Not authenticated:", error);
        dispatch(clearCurrentUser());
        router.replace("/login");
      }
    };

    if (!currentUser) {
      fetchUser();
    } else {
      if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        router.replace("/unauthorized");
      } else {
        setLoading(false);
        socket.connect();
      }
    }
  }, [allowedRoles, currentUser]);

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

"use client"; // Importante para usar hooks en Client Components

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent: any, requiredRole?: string) => {
    return (props: any) => {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("rol");

            if (!token || (requiredRole && role !== requiredRole)) {
                router.push("/");  // Redirige al login
            }
        }, []);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;

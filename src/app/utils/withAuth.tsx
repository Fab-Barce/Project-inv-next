"use client"; // Importante para usar hooks en Client Components

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent: any, requiredRole?: string) => {
    return (props: any) => {
        const router = useRouter();
        const [isLoading, setIsLoading] = useState(true);
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            const checkAuth = () => {
                try {
                    const token = localStorage.getItem("token");
                    const role = localStorage.getItem("rol");
                    
                    console.log("Verificando autenticación:", { token, role, requiredRole });
                    
                    // Si no hay token, redirigir al login
                    if (!token) {
                        console.log("No hay token, redirigiendo a login");
                        router.push("/");
                        return;
                    }
                    
                    // Verificar rol si es necesario
                    if (requiredRole) {
                        // Caso especial: si el rol requerido es "admin" y el rol del usuario es "superA" o "admin"
                        if (requiredRole === "admin" && (role === "superA" || role === "admin")) {
                            console.log("Rol admin/superA verificado");
                            setIsAuthenticated(true);
                        } 
                        // Si el rol no coincide con el requerido
                        else if (role !== requiredRole) {
                            console.log(`Rol no coincide: ${role} !== ${requiredRole}`);
                            router.push("/");
                            return;
                        } 
                        // Si el rol coincide
                        else {
                            console.log("Rol verificado correctamente");
                            setIsAuthenticated(true);
                        }
                    } 
                    // Si no se requiere rol específico
                    else {
                        console.log("No se requiere rol específico");
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error("Error en verificación de autenticación:", error);
                    router.push("/");
                } finally {
                    setIsLoading(false);
                }
            };
            
            checkAuth();
        }, [router, requiredRole]);

        // Mostrar indicador de carga mientras se verifica la autenticación
        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            );
        }

        // Solo renderizar el componente si está autenticado
        return isAuthenticated ? <WrappedComponent {...props} /> : null;
    };
};

export default withAuth;

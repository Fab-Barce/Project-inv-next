import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    // Obtener el token de las cookies
    const token = req.cookies.get("token")?.value;
    
    // Si no hay token, redirigir al login
    if (!token) {
        // Usar la URL base para la redirección
        const url = new URL("/", req.url);
        return NextResponse.redirect(url);
    }
    
    // Si hay token, permitir el acceso
    return NextResponse.next();
}

// Configurar las rutas que deben ser protegidas
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/dashboard_v2/:path*",
        "/dashboard_admin/:path*"
    ]
};

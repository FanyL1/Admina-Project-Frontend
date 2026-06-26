import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//Este middleware redirije de /login y /signUp a /Inicio si hay sesion activa 
export default function middleware (request: NextRequest){

    const token = request.cookies.has('userToken');
    const { pathname} = request.nextUrl;
    //console.log(token);
    
    if (token && (pathname === '/login' || pathname === '/signUp')) {
        return NextResponse.redirect(new URL('/Inicio',request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login','/singUp']
}
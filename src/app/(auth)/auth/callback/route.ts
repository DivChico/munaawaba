import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Successful email confirmation - redirect to sign-in with success message
            return NextResponse.redirect(
                new URL(`/sign-in?confirmed=true`, requestUrl.origin)
            )
        }
    }

    // If there's an error or no code, redirect to sign-in with error
    return NextResponse.redirect(
        new URL('/sign-in?error=confirmation_failed', requestUrl.origin)
    )
}

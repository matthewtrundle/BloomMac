import { NextPage } from 'next'

// Type declarations for Next.js pages
declare module 'next' {
  // Override the PageProps to accept our params structure
  export interface PageProps {
    params: { [key: string]: any }
    searchParams?: { [key: string]: string | string[] }
  }
}

// Ensure this is treated as a module
export {}

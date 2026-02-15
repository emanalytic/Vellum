# Deployment Guide for Vellum

This guide describes how to deploy Vellum using your custom domain `www.vellum.foo`.

## 1. Backend Deployment (Railway)

Your backend is hosted at `https://vellum-production-93d9.up.railway.app`.

### Environment Variables

Configure these in the Railway dashboard:

- `PORT`: `3000`
- `CORS_ORIGIN`: `https://www.vellum.foo`
- `SUPABASE_URL`: (Your Supabase URL)
- `SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
- `GROQ_API_KEY`: (Your Groq API Key)

---

## 2. Frontend Deployment (Vercel)

Your frontend is hosted at `https://www.vellum.foo`.

### Environment Variables

Configure these in the Vercel dashboard:

- `VITE_SUPABASE_URL`: (Your Supabase URL)
- `VITE_SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
- `VITE_API_URL`: `https://vellum-production-93d9.up.railway.app`

---

## 3. Custom Domain Setup (Name.com)

To point `newguide.app` (or your current domain) to these services, add these records:

| Host  | Type  | Answer                                  |
| :---- | :---- | :-------------------------------------- |
| `@`   | A     | `76.76.21.21` (Vercel IP)               |
| `www` | CNAME | `cname.vercel-dns.com`                  |
| `api` | CNAME | `vellum-production-93d9.up.railway.app` |

---

## 4. Supabase Configuration (Critical)

Go to **Authentication > URL Configuration** in Supabase:

1. **Site URL**: `https://www.vellum.foo`
2. **Redirect URLs**: Add `https://www.vellum.foo/**`

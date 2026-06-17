"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Database } from "lucide-react"

const sql = `CREATE TABLE IF NOT EXISTS newsletter (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert newsletter" ON newsletter
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Only admins can read newsletter" ON newsletter
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'is_admin' = 'true');

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Only admins can read contact messages" ON contact_messages
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'is_admin' = 'true');`

export function SetupClient({ supabaseUrl, anonKey }: { supabaseUrl: string; anonKey: string }) {
  const [copied, setCopied] = useState(false)
  const [checking, setChecking] = useState(false)
  const [tables, setTables] = useState<Record<string, "exists" | "missing">>({})

  async function checkTables() {
    setChecking(true)
    const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1] || ""
    const baseUrl = `https://${projectRef}.supabase.co`
    const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}` }
    const results: Record<string, "exists" | "missing"> = {}

    for (const table of ["newsletter", "contact_messages"]) {
      try {
        const res = await fetch(`${baseUrl}/rest/v1/${table}?select=count`, { headers })
        results[table] = res.ok ? "exists" : "missing"
      } catch {
        results[table] = "missing"
      }
    }

    setTables(results)
    setChecking(false)
  }

  function copySql() {
    navigator.clipboard.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1] || ""
  const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`

  return (
    <>
      <div className="flex items-center gap-3">
        <Database className="size-6 text-primary" />
        <h1 className="font-serif text-2xl font-medium text-foreground">Configuración de base de datos</h1>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-foreground">Estado de tablas</h2>

        <button
          onClick={checkTables}
          disabled={checking}
          className="rounded bg-primary px-4 py-2 text-xs uppercase tracking-[0.1em] text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {checking ? "Verificando…" : "Verificar tablas"}
        </button>

        <div className="flex flex-col gap-2">
          {["newsletter", "contact_messages"].map((table) => (
            <div key={table} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
              {tables[table] === "exists" ? (
                <CheckCircle className="size-5 shrink-0 text-green-600" />
              ) : tables[table] === "missing" ? (
                <XCircle className="size-5 shrink-0 text-destructive" />
              ) : (
                <div className="size-5 shrink-0 rounded-full border-2 border-border" />
              )}
              <code className="text-sm font-mono text-foreground">{table}</code>
              <span className="ml-auto text-xs text-muted-foreground">
                {tables[table] === "exists"
                  ? "Creada"
                  : tables[table] === "missing"
                    ? "Falta"
                    : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-foreground">
          SQL a ejecutar
        </h2>

        <pre className="overflow-x-auto rounded-lg border border-border bg-secondary/30 p-4 text-xs leading-relaxed text-foreground">
          <code>{sql}</code>
        </pre>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={copySql}
            className="rounded border border-input bg-background px-4 py-2 text-xs uppercase tracking-[0.1em] text-foreground hover:bg-secondary"
          >
            {copied ? "Copiado ✓" : "Copiar SQL"}
          </button>
          <a
            href={sqlEditorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-primary px-4 py-2 text-xs uppercase tracking-[0.1em] text-primary-foreground hover:opacity-90"
          >
            Abrir SQL Editor en Supabase
          </a>
        </div>

        <p className="text-xs text-muted-foreground">
          Después de ejecutar el SQL, volvé acá y verificá el estado de las tablas.
        </p>
      </div>
    </>
  )
}

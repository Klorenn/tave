"use client"

import { useState } from "react"
import Image from "next/image"
import { Upload, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Label } from "@/components/ui/label"

export function ImageUpload({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  const [url, setUrl] = useState<string>(defaultValue || "")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)

    const supabase = createClient()
    const ext = file.name.split(".").pop()
    const path = `products/${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, { cacheControl: "3600", upsert: false })

    if (uploadError) {
      setError("No se pudo subir la imagen. Intenta de nuevo.")
      setUploading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(path)

    setUrl(publicUrl)
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Imagen del producto</Label>
      <input type="hidden" name={name} value={url} />

      <div className="flex items-start gap-4">
        <div className="relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-secondary">
          {url ? (
            <Image src={url || "/placeholder.svg"} alt="Vista previa" fill className="object-cover" sizes="112px" />
          ) : (
            <Upload className="size-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-xs uppercase tracking-[0.1em] text-foreground transition-colors hover:border-primary">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {uploading ? "Subiendo..." : "Subir imagen"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
          <p className="text-xs text-muted-foreground">JPG, PNG o WEBP. Se guarda automáticamente.</p>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </div>
    </div>
  )
}

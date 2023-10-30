'use client'

import '@uploadthing/react/styles.css'
import { UploadDropzone } from '../lib/uploadthing'
import Image from 'next/image'
import { X } from 'lucide-react'

type FileUploadProps = {
  endpoint: 'messageFile' | 'serverImage'
  value: string // the "image" url
  onChange: (url?: string) => void
}
export default function FileUpload({
  endpoint,
  value,
  onChange,
}: FileUploadProps) {
  const fileType = value?.split('.')?.pop()

  if (value && fileType !== 'pdf') {
    // IF it's an image
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-full"
        />
        <button
          type="button"
          onClick={() => onChange('')}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url)
      }}
      onUploadError={(error: Error) => {
        console.log(error)
      }}
    />
  )
}

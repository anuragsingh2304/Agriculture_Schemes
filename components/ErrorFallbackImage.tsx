"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface ErrorFallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc: string
}

export default function ErrorFallbackImage({ src, fallbackSrc, alt, ...props }: ErrorFallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return <Image {...props} src={imgSrc || "/placeholder.svg"} alt={alt} onError={() => setImgSrc(fallbackSrc)} />
}

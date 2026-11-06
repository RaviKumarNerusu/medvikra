import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";

export default function ImageWithFallback({ src, alt, label, className = "", ...props }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`image-fallback ${className}`} role="img" aria-label={alt}><ImageIcon size={28} /><span>{label || alt}</span></div>;
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}

import { useState, useEffect } from "react"

interface Props {
    size: number
    url: string | null
    onUpload: (filePath: string) => void
}

export default function Avatar({ size = 150, url, onUpload }: Props) {
    const [uploading, setUploading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const avatarSize = { height: size, width: size}

    useEffect(() => {
        if (url) {
            setAvatarUrl(url)
        }
    }, [url])

    async function downloadImage(path: string) {
        
    }
}



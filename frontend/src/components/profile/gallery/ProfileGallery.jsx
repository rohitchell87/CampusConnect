import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Plus } from 'lucide-react'
import GalleryImage from './GalleryImage'
import PhotoViewerModal from './PhotoViewerModal'
import IllustratedEmptyState from '../../common/IllustratedEmptyState'

export default function ProfileGallery({ photos = [], onAddPhotos, emptyTitle = 'No gallery photos yet', emptySubtitle = "This user hasn't uploaded additional photos." }) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const safePhotos = useMemo(() => photos.filter(Boolean), [photos])

  const openViewer = (index) => {
    setActiveIndex(index)
    setViewerOpen(true)
  }

  const closeViewer = () => setViewerOpen(false)

  const goPrev = () => setActiveIndex((prev) => (prev === 0 ? safePhotos.length - 1 : prev - 1))
  const goNext = () => setActiveIndex((prev) => (prev === safePhotos.length - 1 ? 0 : prev + 1))

  if (!safePhotos.length) {
    return (
      <IllustratedEmptyState
        icon={ImageIcon}
        title={emptyTitle}
        subtitle={emptySubtitle}
        buttonLabel="Upload Photos"
        onClick={onAddPhotos}
        className="border border-[color:var(--border-primary)] bg-[color:var(--surface-bg)] p-8 shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
      />
    )
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {safePhotos.map((photo, index) => (
          <motion.div key={`${photo}-${index}`} whileHover={{ scale: 1.02, y: -2 }} transition={{ duration: 0.2 }} className="relative">
            <GalleryImage src={photo} alt={`Gallery ${index + 1}`} onClick={() => openViewer(index)} />
          </motion.div>
        ))}
      </div>

      <PhotoViewerModal
        open={viewerOpen}
        photos={safePhotos}
        currentIndex={activeIndex}
        onClose={closeViewer}
        onPrev={goPrev}
        onNext={goNext}
      />
    </>
  )
}

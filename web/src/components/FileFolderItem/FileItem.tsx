// FileItem.tsx
import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import styles from './FileItem.module.scss'

type Variant = 'small' | 'normal' | 'large'
type ItemType = 'file' | 'folder'

interface FileItemProps {
  name: string
  slug: string
  variant?: Variant             // по умолчанию 'normal'
  type: ItemType
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  onOpen?: (slug: string, type: ItemType) => void
  onContextMenu?: (e: React.MouseEvent, slug: string, type: ItemType) => void
}

const FileItem: React.FC<FileItemProps> = ({
                                             name,
                                             slug,
                                             variant = 'normal',
                                             type,
                                             Icon,
                                             onOpen,
                                             onContextMenu
                                           }) => {
  const navigate = useNavigate()

  const handleDoubleClick = () => {
    if (onOpen) return onOpen(slug, type)
    if (type === 'folder')   navigate({ to: `/folders/${slug}` })
    else                     navigate({ to: `/files/${slug}` })
  }

  const handleContext = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu?.(e, slug, type)
  }

  return (
      <div
          className={`${styles.item} ${styles[variant]}`}
          onDoubleClick={handleDoubleClick}
          onContextMenu={handleContext}
      >
        <Icon className={styles.icon} />
        <span className={styles.name}>{name}</span>
      </div>
  )
}

export default FileItem

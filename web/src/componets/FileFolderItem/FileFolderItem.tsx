import React from 'react';
import styles from './FileFolderItem.module.scss';
import {useNavigate} from "@tanstack/react-router";

type Variant = 'small' | 'normal' | 'large';
type ItemType = 'file' | 'folder';

interface FileFolderItemProps {
  name: string;
  slug: string;
  variant: Variant;
  type: ItemType;
}

const FileFolderItem: React.FC<FileFolderItemProps> = (props) => {
  const {
    name,
    slug,
    variant,
    type,
  } = props;

  const navigate = useNavigate()
  const clickHandler = () => {
    console.log('click')
    if (type === 'folder') {

    } else if (type === 'file') {

    }
  }

  const doubleClick = () =>{
    console.log('doubleClick')
  }
  const contextMenu = (e) => {
    e.preventDefault();
    console.log('contextMenu')
  }

  return (
    <div onClick={clickHandler} onContextMenu={contextMenu} onDoubleClick={doubleClick} className={`${styles.item} ${styles[variant]}`}>
      <span className={styles.name}>{name}</span>
    </div>
  );
};

export default FileFolderItem;

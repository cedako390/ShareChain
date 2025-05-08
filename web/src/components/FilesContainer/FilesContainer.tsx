import React from 'react';
import styles from './FilesContainer.module.scss';

interface FilesContainerProps {
  children: React.ReactNode;
}

const FilesContainer: React.FC<FilesContainerProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default FilesContainer;

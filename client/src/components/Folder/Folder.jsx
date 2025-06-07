// Folder.jsx
import React from 'react';
import styles from './Folder.module.css';
import { IconFolder } from '@tabler/icons-react';

export function Folder({ folder }) {
    return (
        <div className={styles.item}>
            <div className={styles.iconWrapper}>
                <IconFolder className={styles.icon} />
            </div>
            <span className={styles.name}>{folder.Name}</span>
        </div>
    );
}

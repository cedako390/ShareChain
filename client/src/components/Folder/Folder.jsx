// Folder.jsx
import React from 'react';
import styles from './Folder.module.css';
import { IconFolder } from '@tabler/icons-react';
import {useUrlStore} from "../../store/url.js";

export function Folder({ folder }) {
    const enterPage = useUrlStore((state) => state.enterPage);

    const handleFolderClick = () => {
        // When a folder is clicked, update the global path
        enterPage({ id: folder.ID, name: folder.Name });
    };

    return (
        <div className={styles.item} onClick={handleFolderClick}>
            <div className={styles.iconWrapper}>
                <IconFolder className={styles.icon} />
            </div>
            {/* The folder object from backend has a 'Name' property */}
            <span className={styles.name}>{folder.Name}</span>
        </div>
    );
}
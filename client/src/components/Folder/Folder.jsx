import React from 'react';
import styles from './Folder.module.css';
import { IconFolder } from '@tabler/icons-react';
import { useUrlStore } from "../../store/url.js";

export function Folder({ folder, apiPrefix }) {
    const enterPage = useUrlStore(state => state.enterPage);
    const setSelectedItem = useUrlStore(state => state.setSelectedItem);
    const selectedItem = useUrlStore(state => state.selectedItem);
    const clearSelectedItem = useUrlStore(state => state.clearSelectedItem);

    const isSelected = selectedItem?.ID === folder.ID && !('StorageKey' in selectedItem);

    const handleSingleClick = () => {
        // Добавляем префикс в сохраняемый объект
        setSelectedItem({ ...folder, apiPrefix });
    };


    // Двойной клик: войти в папку
    const handleDoubleClick = () => {
        clearSelectedItem(); // Сбрасываем выбор перед входом в другую папку
        enterPage({ id: folder.ID, name: folder.Name });
    };

    return (
        <div
            className={`${styles.item} ${isSelected ? styles.selected : ''}`}
            onClick={handleSingleClick}
            onDoubleClick={handleDoubleClick}
        >
            <div className={styles.iconWrapper}>
                <IconFolder className={styles.icon} />
            </div>
            <span className={styles.name}>{folder.Name}</span>
        </div>
    );
}
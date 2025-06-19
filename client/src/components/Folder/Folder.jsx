import React from 'react';
import styles from './Folder.module.css';
import { IconFolder } from '@tabler/icons-react';
import { useUrlStore } from "../../store/url.js";

export function Folder({ folder, apiPrefix }) {
    const enterPage = useUrlStore(state => state.enterPage);
    const setSelectedItem = useUrlStore(state => state.setSelectedItem);
    const selectedItem = useUrlStore(state => state.selectedItem);
    const clearSelectedItem = useUrlStore(state => state.clearSelectedItem);

    // Безопасная проверка selectedItem
    const isSelected = selectedItem && selectedItem.ID === folder.ID && !('StorageKey' in selectedItem);

    const handleSingleClick = () => {
        // Добавляем префикс в сохраняемый объект
        setSelectedItem({
            ...folder,
            Name: folder.Name ?? folder.name,
            ID: folder.ID ?? folder.id,
            CreatedAt: folder.CreatedAt ?? folder.createdAt,
            OwnerID: folder.OwnerID ?? folder.ownerId ?? folder.ownerID,
            ParentID: folder.ParentID ?? folder.parentId ?? folder.parentID,
            can_write: folder.can_write,
            apiPrefix,
        });
    };


    // Двойной клик: войти в папку
    const handleDoubleClick = () => {
        clearSelectedItem(); // Сбрасываем выбор перед входом в другую папку
        enterPage({
            id: folder.id,
            name: folder.name,
            can_write: folder.can_write,
        });
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
            <span className={styles.name}>{folder.name}</span>
        </div>
    );
}
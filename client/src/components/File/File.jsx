// File.jsx
import React from 'react';
import styles from './File.module.css';
import {
    IconFile,
    IconPhoto,
    IconFileTypePdf,
    IconFileTypeXls,
    IconHeadphones,
    IconFileZip, IconMovie, IconFileWord, IconFileBroken,
} from '@tabler/icons-react';
import {useUrlStore} from "../../store/url.js";
import axios from "axios";

export function File({file, apiPrefix}) {
    // Получаем расширение (после последней точки), приводим к нижнему регистру
    const fileName = file.name || file.Name || '';
    const ext = fileName.split('.').pop().toLowerCase();

    // Выбираем иконку по типу расширения
    let ChosenIcon = IconFile;
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'webp'].includes(ext)) {
        ChosenIcon = IconPhoto;
    } else if (['pdf'].includes(ext)) {
        ChosenIcon = IconFileTypePdf;
    } else if (['xls', 'xlsx', 'csv'].includes(ext)) {
        ChosenIcon = IconFileTypeXls;
    } else if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) {
        ChosenIcon = IconHeadphones;
    } else if (['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(ext)) {
        ChosenIcon = IconMovie;
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
        ChosenIcon = IconFileZip;
    } else if (['doc', 'docx', 'rtf', 'odt', 'docm', 'dotx'].includes(ext)) {
        ChosenIcon = IconFileWord;
    } else if ([].includes(ext)) {
        ChosenIcon = IconFileBroken;
    }

    const setSelectedItem = useUrlStore(state => state.setSelectedItem);
    const selectedItem = useUrlStore(state => state.selectedItem);
    const isSelected = (selectedItem?.ID === (file.ID ?? file.id)) && ('StorageKey' in selectedItem || 'storage_key' in selectedItem);

    const handleSingleClick = () => {
        setSelectedItem({
            ...file,
            Name: file.Name ?? file.name,
            name: file.name ?? file.Name,
            ID: file.ID ?? file.id,
            id: file.id ?? file.ID,
            StorageKey: file.StorageKey ?? file.storage_key,
            storage_key: file.storage_key ?? file.StorageKey,
            CreatedAt: file.CreatedAt ?? file.created_at,
            created_at: file.created_at ?? file.CreatedAt,
            SizeBytes: file.SizeBytes ?? file.size_bytes,
            size_bytes: file.size_bytes ?? file.SizeBytes,
            OwnerID: file.OwnerID ?? file.owner_id ?? file.ownerID,
            owner_id: file.owner_id ?? file.OwnerID ?? file.ownerID,
            ParentID: file.ParentID ?? file.parent_id ?? file.parentID,
            parent_id: file.parent_id ?? file.ParentID ?? file.parentID,
            can_write: file.can_write,
            apiPrefix,
        });
    };

    const handleDoubleClick = async () => {
        try {
            const response = await axios.get(`${apiPrefix}/files/${file.ID ?? file.id}/download-url`);
            const downloadUrl = response.data.download_url;

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to download file:", error);
            alert("Не удалось скачать файл.");
        }
    };

    return (
        <div
            className={`${styles.item} ${isSelected ? styles.selected : ''}`}
            onClick={handleSingleClick}
            onDoubleClick={handleDoubleClick}
        >
            <div className={styles.iconWrapper}>
                <IconFile className={styles.icon}/>
            </div>
            <span className={styles.name}>{fileName}</span>
        </div>
    );
}

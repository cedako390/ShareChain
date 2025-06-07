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

export function File({ file }) {
    // Получаем расширение (после последней точки), приводим к нижнему регистру
    const ext = file.Name.split('.').pop().toLowerCase();

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

    return (
        <div className={styles.item}>
            <div className={styles.iconWrapper}>
                <ChosenIcon className={styles.icon} />
            </div>
            <span className={styles.name}>{file.Name}</span>
        </div>
    );
}

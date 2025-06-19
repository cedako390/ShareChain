import React, { useRef } from 'react';
import { Dolphin } from '../../components/Dolphin/Dolphin';
import styles from './index.module.css';
import { useUrlStore } from '../../store/url.js';
import { Button, Group } from '@mantine/core';
import { IconFolderPlus, IconUpload } from '@tabler/icons-react';
import { PreviewPanel } from '../../components/PreviewPanel/PreviewPanel.jsx';
import axios from 'axios';

// Страница "Общий диск"
export default function SharePage() {
    const path = useUrlStore((state) => state.path);
    const triggerRefresh = useUrlStore((state) => state.triggerRefresh);
    const fileInputRef = useRef(null);
    const selectedItem = useUrlStore((state) => state.selectedItem);

    // Определяем parentId для текущей папки
    const parentId = path.length > 0 ? path[path.length - 1].id : null;
    // Определяем, можно ли создавать (canWrite) — ищем в path
    const canWrite = path.length > 0 ? (path[path.length - 1].can_write ?? false) : false;

    const handleCreateFolder = async () => {
        const folderName = prompt("Введите имя новой папки:");
        if (!folderName) return;
        if (parentId == null) {
            alert('Нельзя создавать папки в корне общего диска.');
            return;
        }
        try {
            await axios.post('/api/common/folders', {
                name: folderName,
                parent_id: parentId,
            });
            triggerRefresh();
        } catch (error) {
            console.error("Failed to create folder:", error);
            alert("Не удалось создать папку.");
        }
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) fileInputRef.current.value = null;
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (parentId == null) {
            alert('Нельзя загружать файлы в корень общего диска.');
            return;
        }
        try {
            // 1. Получить upload-url
            const presignResponse = await axios.post(`/api/common/folders/${parentId}/files/upload-url`, {
                filename: file.name,
                content_type: file.type || 'application/octet-stream',
                size_bytes: file.size,
            });
            const {upload_url, storage_key} = presignResponse.data;
            // 2. Загрузить файл в хранилище
            await axios.put(upload_url, file, {
                headers: {'Content-Type': file.type || 'application/octet-stream'},
            });
            // 3. Зарегистрировать файл
            await axios.post(`/api/common/folders/${parentId}/files`, {
                name: file.name,
                storage_key: storage_key,
                size_bytes: file.size,
            });
            triggerRefresh();
            alert("Файл успешно загружен!");
        } catch (error) {
            console.error("File upload failed:", error);
            const errorMessage = error.response?.data?.message || error.message;
            alert(`Ошибка при загрузке файла: ${errorMessage}`);
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = null;
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContent}>
                <Group mb="md">
                    <Button leftSection={<IconFolderPlus size={16}/>} onClick={handleCreateFolder} disabled={!canWrite}>
                        Создать папку
                    </Button>
                    <Button variant="outline" leftSection={<IconUpload size={16}/>} onClick={handleUploadClick} disabled={!canWrite}>
                        Загрузить файл
                    </Button>
                </Group>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    onChange={handleFileChange}
                />
                <Dolphin
                    apiPrefix="/api/common"
                    space="common"
                />
            </div>
            {selectedItem && (
                <div className={styles.sidebar}>
                    <PreviewPanel />
                </div>
            )}
        </div>
    );
}
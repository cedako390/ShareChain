import React, {useRef} from 'react';
import axios from 'axios';
import {Dolphin} from "../../components/Dolphin/Dolphin.jsx";
import {useUrlStore} from "../../store/url.js";
import {Button, Group} from "@mantine/core";
import {IconFolderPlus, IconUpload} from "@tabler/icons-react";
import styles from './index.module.css'
import {PreviewPanel} from "../../components/PreviewPanel/PreviewPanel.jsx";

export default function PersonalPage() {
    const path = useUrlStore((state) => state.path);
    const triggerRefresh = useUrlStore((state) => state.triggerRefresh);
    const fileInputRef = useRef(null);
    const selectedItem = useUrlStore((state) => state.selectedItem);

    const handleCreateFolder = async () => {
        const folderName = prompt("Введите имя новой папки:");
        if (!folderName) return;
        const parentId = path.length > 0 ? path[path.length - 1].id : null;
        try {
            await axios.post('/api/personal/folders', {
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
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const parentId = path.length > 0 ? path[path.length - 1].id : null;

        try {
            // --- ШАГ 1: Запрос URL для загрузки ---
            // ИСПРАВЛЕНО: URL изменен на /api/personal/files/upload-url
            // folder_id теперь передается в теле запроса.
            const presignResponse = await axios.post('/api/personal/files/upload-url', {
                filename: file.name,
                content_type: file.type || 'application/octet-stream',
                size_bytes: file.size,
                folder_id: parentId, // <-- ID папки в теле
            });

            const {upload_url, storage_key} = presignResponse.data;

            // --- ШАГ 2: Загрузка файла в хранилище ---
            await axios.put(upload_url, file, {
                headers: {'Content-Type': file.type || 'application/octet-stream'},
            });

            // --- ШАГ 3: Регистрация файла в базе данных ---
            // ИСПРАВЛЕНО: URL изменен на /api/personal/files
            // folder_id теперь передается в теле запроса.
            await axios.post('/api/personal/files', {
                name: file.name,
                storage_key: storage_key,
                size_bytes: file.size,
                folder_id: parentId, // <-- ID папки в теле
            });

            triggerRefresh();
            alert("Файл успешно загружен!");
        } catch (error) {
            console.error("File upload failed:", error);
            const errorMessage = error.response?.data?.message || error.message;
            alert(`Ошибка при загрузке файла: ${errorMessage}`);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContent}>
                <Group mb="md">
                    <Button leftSection={<IconFolderPlus size={16}/>} onClick={handleCreateFolder}>
                        Создать папку
                    </Button>
                    <Button variant="outline" leftSection={<IconUpload size={16}/>} onClick={handleUploadClick}>
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
                    apiPrefix="/api/personal"
                    space="personal"
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
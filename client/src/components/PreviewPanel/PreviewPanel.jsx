import React, { useState, useEffect } from 'react';
import { useUrlStore } from '../../store/url.js';
import styles from './PreviewPanel.module.css';
import {
    IconFile,
    IconFolder,
    IconPencil,
    IconTrash,
    IconX,
    IconCheck
} from '@tabler/icons-react';
import {
    Paper,
    Text,
    Title,
    CloseButton,
    ActionIcon,
    Group,
    TextInput
} from '@mantine/core';
import axios from 'axios';

// Хелпер для форматирования байтов
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function PreviewPanel() {
    const selectedItem = useUrlStore((state) => state.selectedItem);
    const clearSelectedItem = useUrlStore((state) => state.clearSelectedItem);
    const triggerRefresh = useUrlStore((state) => state.triggerRefresh);

    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState('');

    // Сбрасываем состояние при смене выбранного элемента
    useEffect(() => {
        if (selectedItem) {
            setNewName(selectedItem.Name);
        }
        setIsRenaming(false);
    }, [selectedItem]);

    if (!selectedItem) {
        return (
            <Paper withBorder className={styles.wrapper} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text c="dimmed">Выберите файл для просмотра информации</Text>
            </Paper>
        );
    }

    const isFile = 'StorageKey' in selectedItem;
    const itemType = isFile ? 'files' : 'folders';
    const apiPrefix = selectedItem.apiPrefix;
    const canWrite = Boolean(apiPrefix);

    const handleRename = async () => {
        if (!newName.trim() || newName === selectedItem.Name || !apiPrefix) {
            setIsRenaming(false);
            return;
        }

        try {
            await axios.put(`${apiPrefix}/${itemType}/${selectedItem.ID}`, {
                name: newName.trim(),
            });
            alert('Имя успешно изменено!');
            clearSelectedItem();
            triggerRefresh();
        } catch (error) {
            console.error(`Failed to rename ${itemType}:`, error);
            alert('Не удалось изменить имя. Возможно, у вас нет прав.');
        } finally {
            setIsRenaming(false);
        }
    };

    const handleDelete = async () => {
        if (!apiPrefix) return;
        const confirmation = window.confirm(`Вы уверены, что хотите удалить "${selectedItem.Name}"?`);
        if (!confirmation) return;

        try {
            await axios.delete(`${apiPrefix}/${itemType}/${selectedItem.ID}`);
            alert('Элемент успешно удален!');
            clearSelectedItem();
            triggerRefresh();
        } catch (error) {
            console.error(`Failed to delete ${itemType}:`, error);
            alert('Не удалось удалить элемент. Возможно, у вас нет прав.');
        }
    };

    return (
        <Paper withBorder className={styles.wrapper}>
            <div className={styles.header}>
                <Title order={4}>Свойства</Title>
                <CloseButton onClick={clearSelectedItem} title="Закрыть панель" />
            </div>

            <div className={styles.iconWrapper}>
                {isFile ? <IconFile size={48} /> : <IconFolder size={48} />}
            </div>

            <div className={styles.details}>
                <Text size="sm" c="dimmed">Имя</Text>

                {isRenaming ? (
                    <Group gap="xs" mt={4}>
                        <TextInput
                            value={newName}
                            onChange={(e) => setNewName(e.currentTarget.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                            style={{ flex: 1 }}
                            autoFocus
                        />
                        <ActionIcon variant="light" color="green" onClick={handleRename}><IconCheck size={18} /></ActionIcon>
                        <ActionIcon variant="light" color="red" onClick={() => setIsRenaming(false)}><IconX size={18} /></ActionIcon>
                    </Group>
                ) : (
                    <>
                        <Text className={styles.itemName} Fw={500}>{selectedItem.Name}</Text>
                        {canWrite && (
                            <Group gap="xs" mt="md" className={styles.actions}>
                                <ActionIcon variant="default" size="lg" aria-label="Rename" onClick={() => setIsRenaming(true)}>
                                    <IconPencil size={18} />
                                </ActionIcon>
                                <ActionIcon variant="default" size="lg" color="red" aria-label="Delete" onClick={handleDelete}>
                                    <IconTrash size={18} />
                                </ActionIcon>
                            </Group>
                        )}
                    </>
                )}

                <Text size="sm" c="dimmed" mt="md">Тип</Text>
                <Text Fw={500}>{isFile ? 'Файл' : 'Папка'}</Text>

                {isFile && (
                    <>
                        <Text size="sm" c="dimmed" mt="md">Размер</Text>
                        <Text Fw={500}>{formatBytes(selectedItem.SizeBytes)}</Text>
                    </>
                )}

                <Text size="sm" c="dimmed" mt="md">Дата создания</Text>
                <Text Fw={500}>{
                    (() => {
                        const raw = selectedItem.CreatedAt ?? selectedItem.createdAt ?? selectedItem.created_at;
                        const date = raw ? new Date(raw) : null;
                        return date && !isNaN(date) ? date.toLocaleString() : '—';
                    })()
                }</Text>
            </div>
        </Paper>
    );
}

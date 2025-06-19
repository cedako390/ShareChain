// src/components/Sidebar/Sidebar.jsx
import React from 'react';
import {
    IconCategory,
    IconDeviceGamepad3,
    IconLogout,
    IconSearch,
    IconSmartHome,
    IconPin
} from '@tabler/icons-react';
import { Badge, UnstyledButton } from '@mantine/core';
import classes from './Sidebar.module.css';
import { UserButton } from "../UserButton/UserButton.jsx";
import { Spotlight, spotlight } from '@mantine/spotlight';
import { IconHome, IconDashboard, IconFileText } from '@tabler/icons-react';
import { useAuth } from "../../context/AuthContext.jsx";
import {Emoji} from "react-apple-emojis";
import {EmojiPicker} from "../EmojiPicker/EmojiPicker.jsx";
import {useNavigate} from "react-router";
import { useUrlStore } from '../../store/url.js';

// Основные ссылки
const links = [
    { icon: IconSmartHome, label: 'Личный диск', url: '/' },
    { icon: IconCategory, label: 'Общий диск',  url: '/share' },
];

const actions = [
    {
        id: 'home',
        label: 'Home',
        description: 'Перейти на главную страницу',
        onClick: () => console.log('Home'),
        leftSection: <IconHome size={20} stroke={1.5} />,
    },
    {
        id: 'dashboard',
        label: 'Dashboard',
        description: 'Обзор состояния системы',
        onClick: () => console.log('Dashboard'),
        leftSection: <IconDashboard size={20} stroke={1.5} />,
    },
    {
        id: 'documentation',
        label: 'Documentation',
        description: 'Перейти к документации',
        onClick: () => console.log('Documentation'),
        leftSection: <IconFileText size={20} stroke={1.5} />,
    },
];

export function Sidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [pinnedFolders, setPinnedFolders] = React.useState([]);

    // Чтение закреплённых папок из localStorage
    React.useEffect(() => {
        const updatePinned = () => {
            const pinned = JSON.parse(localStorage.getItem('pinnedFolders') || '[]');
            setPinnedFolders(pinned);
        };
        updatePinned();
        window.addEventListener('pinnedFoldersChanged', updatePinned);
        return () => window.removeEventListener('pinnedFoldersChanged', updatePinned);
    }, []);

    // Переход по закреплённой папке
    const handlePinnedClick = (folder) => {
        // Обновляем path в zustand напрямую через useUrlStore.setState
        useUrlStore.setState({ path: [{ id: folder.id, name: folder.name, can_write: true }] });
        // useUrlStore.setState({ selectedItem: null }); // если нужно сбрасывать выделение
    };

    // Рендерим основные ссылки
    const mainLinks = links.map((link) => (
        <UnstyledButton onClick={() => navigate(link.url)} key={link.label} className={classes.mainLink}>
            <div className={classes.mainLinkInner}>
                <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
                <span className={classes.linkText}>{link.label}</span>
            </div>
            {link.notifications && (
                <Badge size="xs" variant="filled" className={classes.mainLinkBadge}>
                    {link.notifications}
                </Badge>
            )}
        </UnstyledButton>
    ));

    return (
        <nav className={classes.navbar}>
            {/* Логотип */}
            <div className={classes.logo}>
                <IconDeviceGamepad3 size={28} stroke={1.5} />
                <span className={classes.logoText}>ShareChain</span>
            </div>

            {/* Поиск-спотлайт */}
            <div onClick={spotlight.open} className={classes.fakeSearch}>
                <IconSearch size={16} stroke={1.5} />
                <span className={classes.searchText}>Поиск...</span>
            </div>
            <Spotlight
                actions={actions}
                nothingFound="Ничего не найдено"
                highlightQuery
                searchProps={{
                    leftSection: <IconSearch size={18} stroke={1.5} />,
                    placeholder: 'Поиск...',
                }}
            />

            {/* ======== Основные разделы ======== */}
            <div className={classes.section}>
                <div className={classes.sectionTitle}>Основные разделы</div>
                <div className={classes.mainLinks}>{mainLinks}</div>
            </div>
            {/* ======== Закреплённые папки ======== */}
            <div className={classes.section}>
                <div className={classes.sectionTitle}>Закреплённые папки</div>
                <div className={classes.pinnedList}>
                    {pinnedFolders.length === 0 && (
                        <div style={{ color: '#888', fontSize: 13, padding: '4px 8px' }}>Нет закреплённых папок</div>
                    )}
                    {pinnedFolders.map((folder) => (
                        <UnstyledButton key={folder.id + folder.apiPrefix} className={classes.pinnedItem} onClick={() => handlePinnedClick(folder)}>
                            <div className={classes.pinnedInner}>
                                <IconPin size={18} className={classes.pinnedIcon}/>
                                <span className={classes.pinnedLabel}>{folder.name}</span>
                            </div>
                        </UnstyledButton>
                    ))}
                </div>
            </div>

            {/* Отталкиваем всё вниз */}
            <div className={classes.spacer} />

            {/* Footer: профиль + выход */}
            <div className={classes.footer}>
                <UserButton />
                <UnstyledButton onClick={logout} className={classes.logout}>
                    <IconLogout size={20} stroke={1.5} />
                    <span className={classes.logoutText}>Выйти</span>
                </UnstyledButton>
            </div>
        </nav>
    );
}

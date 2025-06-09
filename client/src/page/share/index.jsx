import React from 'react';
import { Dolphin } from '../../components/Dolphin/Dolphin';
import styles from './index.module.css';

// Страница "Общий диск"
export default function SharePage() {
    return (
        <div className={styles.wrapper}>
            <Dolphin
                apiPrefix="/api/common"
                space="common"
            />
        </div>
    );
}
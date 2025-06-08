import React, {useState} from 'react';
import {Box} from '@mantine/core';
import styles from './DashboardLayout.module.css';
import {Sidebar} from "../components/Sidebar/Sidebar.jsx";
import {Outlet} from "react-router";
import {useUrlStore} from "../store/url.js";

export default function DashboardLayout() {
    const a = useUrlStore(state => state.path)

    return (
        <Box className={styles.container}>
            <Sidebar/>

            <Box className={styles.mainContent}>
                <div className={styles.breadcrumb}>
                    {a.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <div
                                className={
                                    index === a.length - 1
                                        ? `${styles.item} ${styles.current}`
                                        : styles.item
                                }
                            >
                                {item.name}
                            </div>

                            {index < a.length - 1 && <div className={styles.separator}>/</div>}
                        </React.Fragment>
                    ))}
                </div>

                <Outlet/>
            </Box>
        </Box>
    );
}

import React, {useState} from 'react';
import {Box} from '@mantine/core';
import styles from './DashboardLayout.module.css';
import {Sidebar} from "../components/Sidebar/Sidebar.jsx";
import {Outlet} from "react-router";
import {useUrlStore} from "../store/url.js";

export default function DashboardLayout() {
    const path = useUrlStore(state => state.path)
    const truncateAfter = useUrlStore(state => state.truncateAfter);

    return (
        <Box className={styles.container}>
            <Sidebar/>

            <Box className={styles.mainContent}>
                <div className={styles.breadcrumb}>
                    {path.map((item, index) => (
                        <React.Fragment key={item.id || 'root'}>
                            <div
                                onClick={() => truncateAfter(item.id)} // Click handler for navigation
                                className={
                                    index === path.length - 1
                                        ? `${styles.item} ${styles.current}`
                                        : styles.item
                                }
                            >
                                {item.name}
                            </div>

                            {index < path.length - 1 && <div className={styles.separator}>/</div>}
                        </React.Fragment>
                    ))}
                </div>

                <Outlet/>
            </Box>
        </Box>
    );
}
import styles from './Dolphin.module.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { Folder } from "../Folder/Folder.jsx";
import { File } from "../File/File.jsx";
import { useUrlStore } from "../../store/url.js";

export function Dolphin({ apiPrefix, space }) {
    const path = useUrlStore((state) => state.path);
    const version = useUrlStore((state) => state.version);
    const parentId = path.length > 0 ? path[path.length - 1].id : null;
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        let url;
        if (space === 'common') {
            // Для общего диска логика запросов другая
            url = parentId === null
                ? `${apiPrefix}/folders` // Корневые папки
                : `${apiPrefix}/folders/${parentId}/children`; // Содержимое подпапки
        } else {
            // Для личного диска
            url = parentId === null
                ? `${apiPrefix}/folders`
                : `${apiPrefix}/folders?parent_id=${parentId}`;
        }

        axios.get(url).then((res) => {
            setFolders(res.data.folders || []);
            setFiles(res.data.files || []);
        }).catch(err => {
            console.error("Failed to fetch directory contents:", err);
            setFolders([]);
            setFiles([]);
        });
    }, [parentId, version, apiPrefix, space]);

    return (
        <div className={styles.wrapper}>
            {folders.map((folder) => (
                <Folder folder={folder} key={`folder-${folder.ID}`} apiPrefix={apiPrefix} />
            ))}
            {files.map((file) => (
                <File file={file} key={`file-${file.ID}`} apiPrefix={apiPrefix} />
            ))}
        </div>
    );
}
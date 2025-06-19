import styles from './Dolphin.module.css';
import { useEffect, useState, useRef } from "react";
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
    const [canWrite, setCanWrite] = useState(false);
    const triggerRefresh = useUrlStore((state) => state.triggerRefresh);

    useEffect(() => {
        let url;
        if (space === 'common') {
            url = parentId === null
                ? `${apiPrefix}/folders`
                : `${apiPrefix}/folders/${parentId}/children`;
        } else {
            url = parentId === null
                ? `${apiPrefix}/folders`
                : `${apiPrefix}/folders?parent_id=${parentId}`;
        }

        axios.get(url).then((res) => {
            setFolders((res.data.folders || []).map(f => ({
                ...f,
                id: f.id ?? f.ID,
                name: f.name ?? f.Name,
            })));
            setFiles((res.data.files || []).map(f => ({
                id: f.id ?? f.ID,
                folder_id: f.folder_id ?? f.FolderID,
                name: f.name ?? f.Name,
                storage_key: f.storage_key ?? f.StorageKey,
                size_bytes: f.size_bytes ?? f.SizeBytes,
                owner_id: f.owner_id ?? f.OwnerID,
                created_at: f.created_at ?? f.CreatedAt,
                updated_at: f.updated_at ?? f.UpdatedAt,
            })));
            if (space === 'common') {
                if (parentId === null) {
                    setCanWrite(false);
                } else {
                    setCanWrite(!!res.data.can_write_current);
                }
            }
        }).catch(err => {
            console.error("Failed to fetch directory contents:", err);
            setFolders([]);
            setFiles([]);
            setCanWrite(false);
        });
    }, [parentId, version, apiPrefix, space]);

    return (
        <div className={styles.wrapper}>
            {folders.map((folder) => (
                <Folder folder={folder} key={`folder-${folder.id}`} apiPrefix={apiPrefix} />
            ))}
            {files.map((file) => (
                <File file={file} key={`file-${file.id}`} apiPrefix={apiPrefix} />
            ))}
        </div>
    );
}
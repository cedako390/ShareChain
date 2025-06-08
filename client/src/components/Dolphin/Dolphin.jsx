import styles from './Dolphin.module.css'
import {useEffect, useState} from "react";
import axios from "axios";
import {Folder} from "../Folder/Folder.jsx";
import {File} from "../File/File.jsx";
import {useUrlStore} from "../../store/url.js";

export function Dolphin() {
    // State is now driven by the global store
    const path = useUrlStore((state) => state.path);
    const parentId = path.length > 0 ? path[path.length - 1].id : null;

    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        // Construct the URL, handling the root case (parentId is null)
        const url = parentId === null
            ? `/api/personal/folders`
            : `/api/personal/folders?parent_id=${parentId}`;

        axios.get(url).then((res) => {
            // The backend now returns both folders and files
            setFolders(res.data.folders || []);
            setFiles(res.data.files || []);
        }).catch(err => {
            console.error("Failed to fetch directory contents:", err);
            setFolders([]);
            setFiles([]);
        });
        // Re-run effect whenever the parentId from the store changes
    }, [parentId])

    return (
        <div className={styles.wrapper}>
            {
                folders.map((folder) => (
                    // The folder object from the backend has 'ID' and 'Name'
                    <Folder folder={folder} key={folder.ID}/>
                ))
            }
            {
                files.map((file) => (
                    // The file object has 'ID' and 'Name'
                    <File file={file} key={file.ID}/>
                ))
            }
        </div>
    )
}
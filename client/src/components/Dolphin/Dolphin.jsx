import styles from './Dolphin.module.css'
import {useEffect, useState} from "react";
import axios from "axios";
import {Folder} from "../Folder/Folder.jsx";
import {File} from "../File/File.jsx";

export function Dolphin() {
    const [parentId, setParentId] = useState(null);
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        axios.get(`/api/personal/folders?parent_id=${parentId}`).then((res) => {
            setFolders(res.data);
        })
    }, [])

    return (
        <div className={styles.wrapper}>
            {
                folders.map((folder, index) => {
                    return (
                        <Folder folder={folder} key={index}/>
                    )
                })
            }
            {/*<File file={{ Name: "photo.jpg" }} />*/}
            {/*<File file={{ Name: "document.pdf" }} />*/}
            {/*<File file={{ Name: "table.xlsx" }} />*/}
            {/*<File file={{ Name: "music.mp3" }} />*/}
            {/*<File file={{ Name: "video.mp4" }} />*/}
            {/*<File file={{ Name: "archive.zip" }} />*/}
            {/*<File file={{ Name: "report.docx" }} />*/}
            {/*<File file={{ Name: "notes.txt" }} />*/}
            {/*<File file={{ Name: "presentation.pptx" }} />*/}
            {/*<File file={{ Name: "unknownfile.xyz" }} />*/}

        </div>
    )
}
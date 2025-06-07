// EmojiPicker.jsx
import React, { useState, useRef, useEffect } from "react";
import { Emoji } from "react-apple-emojis";
import emojiData from "../../filtered.json";
import styles from "./EmojiPicker.module.css";

export function EmojiPicker() {
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={styles.wrapper} ref={ref}>
            {/* Триггер */}
            <div
                className={styles.trigger}
                onClick={() => setOpen(prev => !prev)}
            >
                {selected ? (
                    <Emoji name={selected} width={24} />
                ) : (
                    <Emoji name="laptop" width={24} />
                )}
            </div>

            {/* Попап со списком эмодзи */}
            {open && (
                <div className={styles.popup}>
                    <div className={styles.emojiGrid}>
                        {Object.keys(emojiData).map((name) => (
                            <div
                                key={name}
                                className={styles.emojiItem}
                                onClick={() => {
                                    setSelected(name);
                                    setOpen(false);
                                }}
                            >
                                <Emoji name={name} width={24} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

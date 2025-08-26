import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useState } from 'react';
import styles from './collapseRemSection.module.css';

export function CollapseRemSection({ title, children, isOpen, onToggle }: {
    title: string;
    children: React.ReactNode;
    isOpen?: boolean;
    onToggle?: (open: boolean) => void;
}) {
    const [open, setOpen] = useState<boolean>(isOpen || true);

    const handleToggle = () => {
        if(onToggle) onToggle(!open);
        setOpen(!open);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header} onClick={handleToggle}>
                <span className={styles.icon}>
                    {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                </span>
                <span className={styles.title}>{title}</span>
            </div>
            <div className={styles.content} style={{ display: open ? 'flex' : 'none' }}>
                <div className={styles.sidebar}></div>
                <div className={styles.children}>
                    {open ? children : null}
                </div>
            </div>
        </div>
    )
}
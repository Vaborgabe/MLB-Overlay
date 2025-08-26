import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import VDOFrame from "../vdoFrame/vdoFrame";
import styles from "./playerPreview.module.css";

export function PlayerPreview({vdoCode}: { vdoCode: string }) {
    const [shown, setShown] = useState(true);

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                Preview <a className={styles.visBtn} onClick={() => setShown(!shown)}>{shown ? <VisibilityOffIcon /> : <VisibilityIcon />}</a>
            </div>
            <div className={styles.cam} style={{ display: shown ? 'block' : 'none' }}>
                {shown ? <VDOFrame code={vdoCode} volume={0} /> : null}
            </div>
            <div className="divider"></div>
        </div>
    );
}
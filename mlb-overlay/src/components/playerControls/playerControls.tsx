import { PlayerPreview } from "../playerPreview/playerPreview";
import styles from "./playerControls.module.css";

export function PlayerControls({
    vdoCode,
}: {
    vdoCode: string;
}) {
    return (
        <div className={styles.wrapper}>
            <PlayerPreview vdoCode={vdoCode} />
        </div>
    );
}
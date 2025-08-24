import { useState } from "react";
import styles from './playername.module.css';

export function PlayerName({ cb }: { cb: (name: string) => void }) {
    const [name, setName] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        cb(name);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="playerName">Balatro Multiplayer Name:</label>
            <input
                type="text"
                value={name}
                onChange={handleInputChange}
                placeholder="Enter name"
            />
            <button type="submit">Submit</button>
        </form>
    );
}
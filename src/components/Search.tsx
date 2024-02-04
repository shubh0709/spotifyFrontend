import { useEffect, useState, useCallback, useRef } from "react";
import { SongDetails } from "../types";
import styles from "./Search.module.css";
import useSearch from "../hooks/useSearch";
import { searchTracks } from '../api/api';


export function Search({ onTrackSelect }: { onTrackSelect: ({ name, trackId }: SongDetails) => void }) {
    const { data, isLoading, error, setQuery } = useSearch(searchTracks, 500);
    const suggestionRef = useRef<HTMLTableElement | null>(null);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        if (suggestionRef.current) {
            suggestionRef.current.classList.remove(styles.hideTable);
            console.log("came here");
        }

    };

    const clickedSuggestion = (
        async (e: any) => {
            const val = e.target.textContent;
            const id = e.target.closest('tr').dataset.id;
            if (suggestionRef.current) {
                suggestionRef.current.classList.add(styles.hideTable);
                console.log(suggestionRef.current.classList);
            }
            onTrackSelect({ name: val, trackId: id });
        }
    );

    return (
        <div className={styles.tableContainer}>
            <input
                type="text"
                onChange={handleInputChange}
                className={styles.inputBox}
                placeholder="Enter track name"
            />
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {data && (
                <div >
                    <table
                        ref={suggestionRef}
                        className={styles.styledTable}
                        onClick={clickedSuggestion}
                    >
                        <tbody>
                            {data.length
                                ? data.map((row, ind) => {
                                    return (
                                        <tr key={`${row.id}`} data-id={row.id} >
                                            <td>{row.name}</td>
                                        </tr>
                                    );
                                })
                                : null}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

import { useTranslations } from "@hooks";
import { SocketMessageType } from "@types";
import { memo, useCallback, useRef, useState } from "react";
import { LogFilter } from "./LogApp";

export interface LogHeaderProps {
    logsLen: number;
    activeFilter: LogFilter;
    setActiveFilter: (filter: LogFilter) => void;
    autoScroll: boolean;
    setAutoScroll: (newValue: boolean) => void;
    activeSearch: string;
    setActiveSearch: (newSearch: string) => void;
    onClear: () => void;
}

const LogHeader = memo(
    (props: LogHeaderProps) => {
        const [tempSearch, setTempSearch] = useState<string>("");
        const searchTimeout = useRef<number | undefined>(undefined);
        const [filterLabel, searchLogs, autoScrollLabel, anyLabel, clearLabel] = useTranslations([
            "FILTER",
            "SEARCH_LOGS",
            "AUTO_SCROLL",
            "ANY",
            "CLEAR_LOGS"
        ]);

        const onSearchChange = useCallback(
            (val: string) => {
                setTempSearch(val);
                if (searchTimeout) clearTimeout(searchTimeout.current);
                searchTimeout.current = setTimeout(() => {
                    props.setActiveSearch(val);
                }, 200);
            },
            [tempSearch]
        );

        const filterTranslations = useTranslations(Object.keys(SocketMessageType));

        return (
            <>
                <div className="log-actions">
                    <label htmlFor="search">
                        {searchLogs}
                        <input
                            type="text"
                            id="search"
                            value={tempSearch}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search"
                        />
                    </label>
                    <label htmlFor="filter">
                        {filterLabel}
                        <select
                            id="filter"
                            value={props.activeFilter}
                            onChange={(e) => props.setActiveFilter(e.target.value as LogFilter)}
                        >
                            <>
                                <option value="Any">{anyLabel}</option>
                                {Object.keys(SocketMessageType).map((k, i) => {
                                    {
                                        return (
                                            k !== "Fatal" &&
                                            k !== "Quit" && (
                                                <option key={k} value={k}>
                                                    {filterTranslations[i]}
                                                </option>
                                            )
                                        );
                                    }
                                })}
                            </>
                        </select>
                    </label>
                    <label htmlFor="scroll">
                        {autoScrollLabel}
                        <input
                            id="scroll"
                            type="checkbox"
                            role="switch"
                            checked={props.autoScroll}
                            onChange={(e) => props.setAutoScroll(e.target.checked)}
                        />
                    </label>
                    <div>
                        <a
                            href={props.logsLen === 0 ? undefined : "#"}
                            role="button"
                            onClick={() => props.onClear()}
                        >
                            {clearLabel}
                        </a>
                    </div>
                </div>
            </>
        );
    },
    (current, next) =>
        current.activeFilter === next.activeFilter &&
        current.autoScroll === next.autoScroll &&
        current.logsLen === next.logsLen
);

export default LogHeader;

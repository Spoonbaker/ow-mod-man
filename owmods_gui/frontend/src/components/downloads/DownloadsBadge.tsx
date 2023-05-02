import { useTauriCount } from "@hooks";
import { memo } from "react";

const DownloadsBadge = memo(function DownloadsBadge() {
    const count = useTauriCount("PROGRESS-START", "PROGRESS-FINISH");

    return <div className={`download-badge${count === 0 ? " d-none" : ""}`}>{count}</div>;
});

export default DownloadsBadge;

import { commands, hooks } from "@commands";
import CenteredSpinner from "@components/common/CenteredSpinner";
import Icon from "@components/common/Icon";
import { OpenModValidationModalPayload } from "@components/modals/ModValidationModal";
import ModActionButton from "@components/mods/ModActionButton";
import ModHeader from "@components/mods/ModHeader";
import { useTranslation, useTranslations } from "@hooks";
import { confirm } from "@tauri-apps/api/dialog";
import { ModValidationError } from "@types";
import { memo, useCallback } from "react";
import { BsFolderFill, BsTrashFill } from "react-icons/bs";
import LocalModValidationIcon from "./LocalModValidationIcon";

interface LocalModRowProps {
    uniqueName: string;
    onValidationClick?: (p: OpenModValidationModalPayload) => void;
}

const LocalModRow = memo((props: LocalModRowProps) => {
    const [status, mod, err] = hooks.getLocalMod("LOCAL-REFRESH", {
        uniqueName: props.uniqueName
    });

    const [showFolderTooltip, uninstallTooltip, confirmText] = useTranslations([
        "SHOW_FOLDER",
        "UNINSTALL",
        "CONFIRM"
    ]);
    const uninstallConfirmText = useTranslation("UNINSTALL_CONFIRM", {
        name: mod?.manifest.name ?? "null"
    });

    const subtitle = useTranslation("BY", {
        author: mod?.manifest.author ?? "",
        version: mod?.manifest.version ?? ""
    });

    const onValidationClicked = useCallback(
        (errs: ModValidationError[]) => {
            props.onValidationClick?.({
                uniqueName: mod?.manifest.uniqueName ?? "",
                modName: mod?.manifest.name ?? "",
                errors: errs
            });
        },
        [mod?.manifest.name, mod?.errors]
    );

    const onToggle = useCallback(
        (newVal: boolean) => {
            commands
                .toggleMod({
                    uniqueName: props.uniqueName,
                    enabled: newVal
                })
                .then(() => commands.refreshLocalDb());
        },
        [props.uniqueName]
    );

    const onOpen = useCallback(() => {
        commands.openModFolder({ uniqueName: props.uniqueName });
    }, [props.uniqueName]);

    const onUninstall = useCallback(() => {
        confirm(uninstallConfirmText, confirmText).then((answer) => {
            if (answer) {
                commands
                    .uninstallMod({ uniqueName: props.uniqueName })
                    .then(() => commands.refreshLocalDb());
            }
        });
    }, [props.uniqueName, mod?.manifest.name]);

    if (status === "Loading" && mod === null) {
        return <CenteredSpinner className="mod-row local" />;
    } else if (status === "Error") {
        return <div className="mod-row local center">{err!.toString()}</div>;
    } else {
        const localMod = mod!;
        return (
            <div className="mod-row local">
                <ModHeader subtitle={subtitle} {...localMod.manifest}>
                    {(mod?.enabled ?? false) && (
                        <LocalModValidationIcon
                            onClick={onValidationClicked}
                            errors={localMod.errors}
                        />
                    )}
                    <ModActionButton onClick={onOpen} ariaLabel={showFolderTooltip}>
                        <Icon iconType={BsFolderFill} />
                    </ModActionButton>
                    <ModActionButton onClick={onUninstall} ariaLabel={uninstallTooltip}>
                        <Icon iconType={BsTrashFill} />
                    </ModActionButton>
                    <input
                        className="mod-toggle"
                        type="checkbox"
                        aria-label="enabled"
                        role="switch"
                        onChange={(e) => onToggle(e.target.checked)}
                        checked={localMod.enabled}
                    />
                </ModHeader>
            </div>
        );
    }
});

export default LocalModRow;

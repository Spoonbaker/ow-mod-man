import { hooks } from "@commands";
import { useGetTranslation } from "@hooks";
import { memo, useCallback, useRef } from "react";
import SettingsForm, { SettingsFormHandle } from "./SettingsForm";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";

export interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
}

const SettingsModal = memo(function SettingsModal({ open, onClose }: SettingsModalProps) {
    const settingsFormRef = useRef<SettingsFormHandle>();

    const [configStatus, config, err1] = hooks.getConfig("CONFIG_RELOAD");
    const [guiConfigStatus, guiConfig, err2] = hooks.getGuiConfig("GUI_CONFIG_RELOAD");
    const [owmlConfigStatus, owmlConfig, err3] = hooks.getOwmlConfig("OWML_CONFIG_RELOAD");

    const status = [configStatus, guiConfigStatus, owmlConfigStatus];

    const getTranslation = useGetTranslation();

    const onSave = useCallback(() => {
        settingsFormRef.current?.save();
        onClose?.();
    }, [onClose]);

    const onCancel = useCallback(() => {
        settingsFormRef.current?.reset();
        onClose?.();
    }, [onClose]);

    return (
        <Dialog maxWidth="md" keepMounted fullWidth open={open} onClose={onCancel}>
            <DialogTitle>{getTranslation("SETTINGS")}</DialogTitle>
            <DialogContent dividers>
                {status.includes("Error") ? (
                    <DialogContentText>
                        {/* Since we couldn't load settings we'll be stuck in English anyway, 
                                so no need to translate this */}
                        Error: Couldn&apos;t Load Settings: {err1?.toString() ?? ""}{" "}
                        {err2?.toString() ?? ""} {err3?.toString() ?? ""}
                    </DialogContentText>
                ) : status.includes("Loading") &&
                  (config === null || guiConfig === null || owmlConfig === null) ? (
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <CircularProgress color="neutral" />
                    </Box>
                ) : (
                    <SettingsForm
                        key={status.join("-")}
                        ref={settingsFormRef}
                        initialConfig={config!}
                        initialOwmlConfig={owmlConfig!}
                        initialGuiConfig={guiConfig!}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button color="neutral" onClick={onCancel}>
                    {getTranslation("CANCEL")}
                </Button>
                <Button onClick={onSave}>{getTranslation("SAVE")}</Button>
            </DialogActions>
        </Dialog>
    );
});

export default SettingsModal;

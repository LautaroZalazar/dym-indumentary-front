
export interface IConfirmModalProps {
    message: string;
    onAccept: () => void;
    onCancel?: () => void;
}
export interface IConfirmModalContextType {
    showConfirmModal: (options: IConfirmModalProps) => void;
    hideConfirmModal: () => void;
}
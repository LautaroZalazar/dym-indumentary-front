// ConfirmModalContext.tsx
import React, { createContext, useState, useContext } from 'react';
import ConfirmModal from './ConfirmModal';
import { IConfirmModalContextType, IConfirmModalProps } from './models/confirm-modal.interface';

const ConfirmModalContext = createContext<IConfirmModalContextType>({
    showConfirmModal: () => {},
    hideConfirmModal: () => {}
});

export const useConfirmModal = () => useContext(ConfirmModalContext);

export const ConfirmModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [onAccept, setOnAccept] = useState<() => void>(() => () => {});
    const [onCancel, setOnCancel] = useState<() => void>(() => () => {});

    const hideConfirmModal = () => {
        setIsVisible(false);
    };

    const showConfirmModal = ({ message, onAccept, onCancel }: IConfirmModalProps) => {
        setMessage(message);
        setOnAccept(() => onAccept);
        setOnCancel(() => onCancel ?? hideConfirmModal);
        setIsVisible(true);
    };

    return (
        <ConfirmModalContext.Provider value={{ showConfirmModal, hideConfirmModal }}>
            {children}
            {isVisible && (
                <ConfirmModal
                    message={message}
                    onAccept={() => {
                        onAccept();
                        hideConfirmModal();
                    }}
                    onCancel={() => {
                        onCancel();
                        hideConfirmModal();
                    }}
                />
            )}
        </ConfirmModalContext.Provider>
    );
};

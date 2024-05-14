import { ButtonHTMLAttributes } from "react";

export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    name: string;
    primary?: boolean;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
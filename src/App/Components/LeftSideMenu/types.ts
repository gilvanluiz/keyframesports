export interface ILink {
    title: string;
    url: string;
    icon: any;
    inactive: boolean;
}

export interface IProps {
    open: boolean;
    onToggle: () => void;
}

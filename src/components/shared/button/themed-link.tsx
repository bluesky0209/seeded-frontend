import { LinkButton } from '.';

interface ThemedLinkButtonProps {
    content?: string;
    onClick?: any;
    className?: string;
}

export default function ThemedLinkButton({
    content = '',
    onClick = () => { },
    className = '',
}: ThemedLinkButtonProps): JSX.Element {
    className = `from-purple-themed to-green-themed text-black ${className}`;
    return <LinkButton content={content} onClick={onClick} className={className} />;
}

interface LinkButtonProps {
  content?: string;
  onClick?: any;
  className?: string;
}

export default function LinkButton({ content = '', onClick = () => { }, className = '' }: LinkButtonProps): JSX.Element {
  className = `bg-gradient-to-r rounded px-4 py-2 ${className} `;
  return (
    <a type='button' href={onClick} target="_blank" className={className}>
      {content}
    </a>
  );
}

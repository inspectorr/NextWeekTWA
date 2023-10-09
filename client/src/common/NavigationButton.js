import { useNavigate } from 'react-router-dom';

export function NavigationButton({
    to,
    title,
}) {
    const navigate = useNavigate();

    function handleClick() {
        navigate(to);
    }

    return (
        <button onClick={ handleClick }>{ title }</button>
    );
}

export default function Page({ children }) {
    return (
        <div style={ { position: 'relative' } }>
            { children }
        </div>
    );
}

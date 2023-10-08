import { useFormContext } from 'react-hook-form';

export function FormInput({
    label,
    name,
    required = false,
    inputProps = {}
}) {
    const { register } = useFormContext();
    return (
        <div>
            { label && (
                <span>{ label }: </span>
            ) }
            <input
                { ...register(name, { required }) }
                { ...inputProps }
            />
        </div>
    );
}

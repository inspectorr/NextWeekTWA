import { useFormContext } from 'react-hook-form';
import styles from './style.module.scss';

export function FormInput({
    name,
    required = false,
    inputProps = {}
}) {
    const { register } = useFormContext();
    return (
        <div className={ styles.formInput }>
            <input
                { ...register(name, { required }) }
                { ...inputProps }
            />
        </div>
    );
}

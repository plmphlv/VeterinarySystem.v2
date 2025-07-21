import { useEffect, useState, useCallback } from 'react';

export const useForm = <T extends Record<string, any>>(
    initialValues: T,
    onSubmitHandler: (values: T) => void
) => {
    const [values, setValues] = useState<T>(initialValues);

    useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const changeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prevValues => ({ ...prevValues, [name]: value }));
    }, []);

    const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmitHandler(values);
    }, [values, onSubmitHandler]);

    const changeValues = useCallback((newValues: T) => {
        setValues(newValues);
    }, []);

    return { values, changeHandler, onSubmit, changeValues };
};
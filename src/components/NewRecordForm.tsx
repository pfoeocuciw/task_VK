import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from 'react-query';
import { createRecord } from '../api';

// allow 5–15 arbitrary fields: field1…fieldN
const FIELD_COUNT = 5;

// 1) Собираем объект shape с нужными схемами
//    — явно говорим TS: acc это Record<string, yup.StringSchema>
const shape = Array.from({ length: FIELD_COUNT })
    .reduce<Record<string, yup.StringSchema>>((acc, _, i) => {
        acc[`field${i + 1}`] = yup.string().required('Это поле обязательно');
        return acc;
    }, {});  // здесь {} уже трактуется как Record<string, StringSchema>

// 2) Передаём в yup.object().shape(...)
const schema = yup.object().shape(shape);

type FormValues = yup.InferType<typeof schema>;

export default function NewRecordForm() {
    const qc = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
    });
    const { mutate } = useMutation(createRecord, {
        onSuccess: () => qc.invalidateQueries('records'),
    });

    const onSubmit: SubmitHandler<FormValues> = data => mutate(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {Array.from({ length: FIELD_COUNT }).map((_, i) => {
                const name = (`field${i + 1}` as keyof FormValues);
                return (
                    <div key={i}>
                        <label>Field {i + 1}: </label>
                        <input {...register(name)} />
                        <p style={{ color: 'red' }}>{errors[name]?.message}</p>
                    </div>
                );
            })}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Add'}
            </button>
        </form>
    );
}

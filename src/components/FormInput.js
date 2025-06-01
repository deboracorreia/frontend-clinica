import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { NumericFormat } from 'react-number-format';

const FormInput = ({ name, label, type = 'text', isMoney = false, isNumber = false }) => {
    return (
        <div className="form-grupo">
            <label htmlFor={name}>{label}</label>

            {isMoney || isNumber ? (
                <Field name={name}>
                    {({ form }) => (
                        <NumericFormat
                            id={name}
                            type="text"
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                            prefix={isMoney ? 'R$ ' : ''}
                            className="form-control"
                            // Valor exibido formatado
                            value={form.values[name] ?? ''}
                            // Valor salvo no Formik como número puro
                            onValueChange={(val) => {
                                if (val.floatValue != null && !isNaN(val.floatValue)) {
                                    form.setFieldValue(name, val.floatValue);
                                } else {
                                    form.setFieldValue(name, null);
                                }
                            }}
                        />
                    )}
                </Field>
            ) : (
                <Field name={name} type={type} className="form-control" />
            )}

            <ErrorMessage name={name} component="div" className="erro-campo" />
        </div>
    );
};

export default FormInput;

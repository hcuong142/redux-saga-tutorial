import TextField from '@components/common/form/TextField';
import useBasicForm from '@hooks/useBasicForm';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

const SubjectForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues } = props;
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);

    return (
        <Form
            style={{ width: '70%' }}
            id={formId}
            onFinish={handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
        >
            <Card className="card-form" bordered={false}>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField label={<FormattedMessage defaultMessage="Name" />} name="subjectName" />
                    </Col>
                    <Col span={12}>
                        <TextField
                            required
                            label={<FormattedMessage defaultMessage="Code" />}
                            name="subjectCode"
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
};

export default SubjectForm;

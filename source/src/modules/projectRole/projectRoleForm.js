import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import { statusOptions } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';

const message = defineMessages({
    description: 'Mô tả',
    home: 'Trang chủ',
    objectName: 'Dự án',
    projectRoleName: 'Tên vai trò dự án',
    status: 'Trạng thái',
});
const ProjectRoleForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

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

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[0].value,
            });
        }
    }, [isEditing]);

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(message.projectRoleName)}
                            name="projectRoleName"
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={translate.formatMessage(message.status)}
                            name="status"
                            allowClear={false}
                            options={statusValues}
                        />
                    </Col>
                </Row>
                <TextField
                    width={'100%'}
                    label={translate.formatMessage(message.description)}
                    name="description"
                    type="textarea"
                />
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default ProjectRoleForm;

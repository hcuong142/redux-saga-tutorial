import PageWrapper from '@components/common/layout/PageWrapper';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { generatePath } from 'react-router-dom';
import routes from './routes';
import apiConfig from '@constants/apiConfig';
import DeveloperForm from './DeveloperForm';

const messages = defineMessages({
    home: 'Trang chủ',
    subject: 'Lập trình viên',
    objectName: 'Lập trình viên',
});

const DeveloperSavePage = () => {
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.developer.getById,
            create: apiConfig.developer.create,
            update: apiConfig.developer.update,
        },
        options: {
            getListUrl: generatePath(routes.developerListPage.path, {}),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    level: 1,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    level: 1,
                    totalCancelProject: 1,
                    totalProject: 1,
                };
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                {
                    breadcrumbName: translate.formatMessage(messages.subject),
                    path: generatePath(routes.developerListPage.path, {}),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <DeveloperForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
};

export default DeveloperSavePage;

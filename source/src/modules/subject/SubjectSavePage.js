import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, useParams } from 'react-router-dom';
import SubjectForm from './SubjectForm';
import routes from './routes';

const messages = defineMessages({
    home: 'Trang chủ',
    subject: 'Môn học',
    objectName: 'môn học',
});

const SubjectSavePage = () => {
    const subjectId = useParams();
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.subject.getById,
            create: apiConfig.subject.create,
            update: apiConfig.subject.update,
        },
        options: {
            getListUrl: generatePath(routes.subjectListPage.path, { subjectId }),
            objectName: translate.formatMessage(messages.objectName),
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(messages.home) },
                {
                    breadcrumbName: translate.formatMessage(messages.subject),
                    path: generatePath(routes.subjectListPage.path, { subjectId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <SubjectForm
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

export default SubjectSavePage;

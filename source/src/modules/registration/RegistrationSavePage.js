import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { categoryKind } from '@constants/masterData';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useLocation, useParams } from 'react-router-dom';
import routes from '@routes';
import RegistrationForm from './RegistrationForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';
// import routes from '@modules/course/routes';

const messages = defineMessages({
    objectName: 'Danh sách đăng kí khóa học',
    registration: 'Danh sách sinh viên đăng kí khóa học',
    courseRequest: 'Yêu cầu khoá học',
});

function RegistrationSavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const location = useLocation();
    const { fullName } = location.state;
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.registration.getById,
            create: apiConfig.registration.create,
            update: apiConfig.registration.update,
        },
        options: {
            getListUrl: routes.registrationListPage.path,
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    status: 1,
                    isIssuedCertify: 1,
                    moneyState: 1,
                    studentId: detail.studentInfo.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    courseId: courseId,
                    isIssuedCertify: 1,
                    studentId: data.studentInfo.id,
                    moneyState: 1,
                };
            };
        },
    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                !fullName && {
                    breadcrumbName: translate.formatMessage(commonMessage.course),
                    path: routes.courseListPage.path,
                },
                !fullName && {
                    breadcrumbName: translate.formatMessage(messages.registration),
                    path: routes.registrationListPage.path + `?courseId=${courseId}&courseName=${courseName}`,
                },
                fullName && {
                    breadcrumbName: translate.formatMessage(messages.courseRequest),
                    path: routes.courseRequestListPage.path,
                },
                { breadcrumbName: title },
            ].filter(Boolean)}
            title={title}
        >
            <RegistrationForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                isError={errors}
            />
        </PageWrapper>
    );
}

export default RegistrationSavePage;

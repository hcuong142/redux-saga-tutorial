import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { Avatar, Button, Tag } from 'antd';
import { UserOutlined, ContainerOutlined, ProjectOutlined } from '@ant-design/icons';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import { useNavigate } from 'react-router-dom';
import routes from '@routes';
import { IconClipboardText, IconSchool } from '@tabler/icons-react';
import FolderIcon, { CourseIcon } from '@assets/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import styles from './leader.module.scss';
import AvatarField from '@components/common/form/AvatarField';

const message = defineMessages({
    objectName: 'Leader',
    name: 'Họ và tên',
    home: 'Trang chủ',
    leader: 'Leader',
    status: 'Trạng thái',
    course: 'Khoá học',
    project: 'Dự án',
});

const LeaderListPage = () => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.leader,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.additionalActionColumnButtons = () => ({
                course: ({ id, leaderName }) => (
                    <BaseTooltip title={translate.formatMessage(message.course)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            className={styles.verticalCenter}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(routes.leaderCourseListPage.path + `?leaderId=${id}&leaderName=${leaderName}`);
                            }}
                        >
                            <CourseIcon />
                        </Button>
                    </BaseTooltip>
                ),

                project: ({ id, leaderName }) => (
                    <BaseTooltip title={translate.formatMessage(message.project)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            className={styles.verticalCenter}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                    routes.leaderProjectListPage.path + `?leaderId=${id}&leaderName=${leaderName}`,
                                );
                            }}
                        >
                            <FolderIcon />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });

    const columns = [
        {
            title: '#',
            dataIndex: 'avatar',
            align: 'center',
            width: 80,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: <FormattedMessage defaultMessage="Họ và tên" />,
            dataIndex: 'leaderName',
        },

        {
            title: <FormattedMessage defaultMessage="Email" />,
            dataIndex: 'email',
            width: '200px',
        },
        {
            title: <FormattedMessage defaultMessage="Số điện thoại" />,
            dataIndex: 'phone',
            width: '120px',
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ course: true, project: true, edit: true, delete: true }, { width: '170px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.name),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(message.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];
    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.leader) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFiter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            ></ListPage>
        </PageWrapper>
    );
};
export default LeaderListPage;

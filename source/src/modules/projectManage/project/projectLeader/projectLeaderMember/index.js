import { UserOutlined } from '@ant-design/icons';
import ScheduleFile from '@components/common/elements/ScheduleFile';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import {
    AppConstants,
    DEFAULT_TABLE_ITEM_SIZE,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Avatar } from 'antd';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

const message = defineMessages({
    home: 'Trang chủ',
    project: 'Dự án',
    objectName: 'Thành viên dự án',
    role: 'Vai trò',
    name: 'Họ và tên ',
    developer: 'Lập trình viên',
    member: 'Thành viên',
    team: 'Nhóm',
});

const ProjectLeaderMemberListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    const leaderId = queryParameters.get('leaderId');
    localStorage.setItem('pathPrev', location.search);
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.memberProject,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            isProjectToken : true,
            override: (funcs) => {
                funcs.mappingData = (response) => {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                };
                funcs.getCreateLink = () => {
                    if (active) {
                        return `${pagePath}/member/create?projectId=${projectId}&projectName=${projectName}&leaderId=${leaderId}&active=${active}`;
                    }
                    return `${pagePath}/member/create?projectId=${projectId}&projectName=${projectName}&leaderId=${leaderId}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    if (active) {
                        return `${pagePath}/member/${dataRow.id}?projectId=${projectId}&projectName=${projectName}&leaderId=${leaderId}&active=${active}`;
                    }
                    return `${pagePath}/member/${dataRow.id}?projectId=${projectId}&projectName=${projectName}&leaderId=${leaderId}`;
                };
                funcs.changeFilter = (filter) => {
                    const projectId = queryParams.get('projectId');
                    const projectName = queryParams.get('projectName');
                    const active = queryParams.get('active');
                    mixinFuncs.setQueryParams(
                        serializeParams({ projectId: projectId, projectName: projectName, active, ...filter }),
                    );
                };
            },
        });
    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(
            routes.memberActivityProjectLeaderListPage.path +
                `?projectId=${record?.project?.id}&studentId=${record?.developer.studentInfo?.id}&studentName=${record?.developer.studentInfo?.fullName}`,
        );
    };
    const columns = [
        {
            title: '#',
            dataIndex: ['developer', 'accountDto', 'avatar'],
            align: 'center',
            width: 80,
            render: (avatar) => (
                <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(message.name),
            dataIndex: ['developer', 'accountDto', 'fullName'],
            // render: (fullName, record) => (
            //     <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
            //         {fullName}
            //     </div>
            // ),
        },
   
        {
            title: translate.formatMessage(message.role),
            dataIndex: ['projectRole', 'projectRoleName'],
            width: 150,
        },

        {
            title: 'Lịch trình',
            dataIndex: 'schedule',
            align: 'center',
            render: (schedule) => {
                return <ScheduleFile schedule={schedule} />;
            },
            width: 180,
        },

        active &&
            mixinFuncs.renderActionColumn(
                {
                    edit: true,
                    delete: true,
                },
                { width: '150px' },
            ),
    ].filter(Boolean);
  

    // !leaderName && !developerName && columns.push(mixinFuncs.renderStatusColumn({ width: '120px' }));
  
    return (
       
        <ListPage
            title={<span style={{ fontWeight: 'normal' }}>{projectName}</span>}
            actionBar={active && mixinFuncs.renderActionBar()}
            // searchForm={mixinFuncs.renderSearchForm({
            //     fields: searchFields,
            //     initialValues: queryFilter,
            //     className: styles.search,
            // })}
            baseTable={
                <BaseTable
                    onChange={changePagination}
                    pagination={pagination}
                    loading={loading}
                    dataSource={data}
                    columns={columns}
                />
            }
        />
       
    );
};

export default ProjectLeaderMemberListPage;

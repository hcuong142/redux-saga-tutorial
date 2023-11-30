import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { TaskLogKindOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import { FieldTypes } from '@constants/formConfig';
import useFetch from '@hooks/useFetch';
import styles from './activityProjectStudent.module.scss';
import useAuth from '@hooks/useAuth';
import useNotification from '@hooks/useNotification';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { IconAlarm, IconAlarmOff, IconBug } from '@tabler/icons-react';
import useDisclosure from '@hooks/useDisclosure';
import DetailMyTaskProjectModal from '@modules/projectManage/project/projectStudent/myTask/DetailMyTaskProjectModal';
import { useDispatch } from 'react-redux';
import { hideAppLoading, showAppLoading } from '@store/actions/app';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import feature from '@assets/images/feature.png';
import bug from '@assets/images/bug.jpg';
const message = defineMessages({
    selectProject: 'Chọn dự án',
    objectName: 'Nhật ký',
    reminderMessage: 'Vui lòng chọn dự án !',
    gitCommitUrl: 'Đường dẫn commit git',
});

function MyActivityProjectListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const [detail, setDetail] = useState({});
    const [openedModal, handlersModal] = useDisclosure(false);
    const KindTaskLog = translate.formatKeys(TaskLogKindOptions, ['label']);
    const { profile } = useAuth();
    const notification = useNotification();
    const { execute: executeGet, loading: loadingDetail } = useFetch(apiConfig.projectTask.getById, {
        immediate: false,
    });
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.projectTaskLog,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params, studentId: profile.id });
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?projectId=${projectId}&task=${dataRow?.projectTaskInfo?.taskName}`;
            };
        },
    });
    const dispatch = useDispatch();
    const handleFetchDetail = (id) => {
        dispatch(showAppLoading());
        executeGet({
            pathParams: { id: id },
            onCompleted: (response) => {
                setDetail(response.data);
                dispatch(hideAppLoading());
                handlersModal.open();
            },
            onError: mixinFuncs.handleGetDetailError,
        });
    };
    const handleOnClickReview = (url) => {
        const pattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
        if (pattern.test(url)) {
            window.open(url, '_blank');
        } else {
            notification({
                type: 'warning',
                message: translate.formatMessage(commonMessage.warningUrl),
            });
        }
    };

    const columns = [
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            render: (createdDate) => {
                const modifiedDate = convertStringToDateTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT).add(
                    7,
                    'hour',
                );
                const modifiedDateTimeString = convertDateTimeToString(modifiedDate, DEFAULT_FORMAT);
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateTimeString}</div>;
            },
            width: 180,
        },
        {
            title: translate.formatMessage(commonMessage.kind),
            dataIndex: ['projectTaskInfo', 'kind'],
            width: 15,
            render(dataRow) {
                if (dataRow === 1)
                    return (
                        <div>
                            <img src={feature} height="30px" width="30px" />
                        </div>
                    );
                if (dataRow === 2)
                    return (
                        <div>
                            <img src={bug} height="30px" width="30px" />
                        </div>
                    );
            },
        },
        {
            title: translate.formatMessage(commonMessage.task),
            dataIndex: ['projectTaskInfo', 'taskName'],
            render: (task, dataRow) => {
                return (
                    <div
                        onClick={() => handleFetchDetail(dataRow?.projectTaskInfo?.id)}
                        style={{ cursor: 'pointer', color: 'rgb(24, 144, 255)' }}
                    >
                        {task}
                    </div>
                );
            },
        },
        {
            title: translate.formatMessage(message.gitCommitUrl),
            dataIndex: 'gitCommitUrl',
            width: 200,
            align: 'center',
            render: (gitUrl) => {
                return (
                    <div className={styles.customDiv} onClick={() => handleOnClickReview(gitUrl)}>
                        <BaseTooltip title={gitUrl}>Review</BaseTooltip>
                    </div>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.totalTime),
            dataIndex: 'totalTime',
            align: 'center',
            width: 150,
            render(totalTime) {
                return <div>{Math.ceil((totalTime / 60) * 10) / 10} h</div>;
            },
        },
        {
            title: 'Loại',
            dataIndex: 'kind',
            align: 'center',
            width: 120,
            render(dataRow) {
                const kindLog = KindTaskLog.find((item) => item.value == dataRow);
                return (
                    <Tag color={kindLog.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{kindLog.label}</div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ].filter(Boolean);
    const { data: myProject } = useFetch(apiConfig.project.getListStudent, {
        immediate: true,
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item.id,
                label: item.name,
            })),
    });
    const searchFields = [
        {
            key: 'projectId',
            placeholder: translate.formatMessage(message.selectProject),
            type: FieldTypes.SELECT,
            options: myProject,
        },
    ];
    const { data: timeSum, execute: executeTimeSum } = useFetch(apiConfig.projectTaskLog.getSum, {
        immediate: true,
        params: { projectId: queryFilter?.projectId, studentId: profile.id },
        mappingData: ({ data }) => data.content,
    });

    useEffect(() => {
        if (projectId)
            executeTimeSum({
                params: { projectId, studentId: profile.id },
            });
    }, [projectId]);
    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.myActivity) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                baseTable={
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'end' }}>
                            <span>
                                <span style={{ marginLeft: '5px' }}>
                                    <IconAlarm style={{ marginBottom: '-5px' }} />:{' '}
                                    <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                        {timeSum ? Math.ceil((timeSum[0]?.totalTimeWorking / 60) * 10) / 10 : 0}h{' '}
                                        <span style={{ fontWeight: 'bold', fontSize: '17px', marginLeft: '15px' }}>
                                            |{' '}
                                        </span>
                                    </span>
                                </span>
                                <span style={{ marginLeft: '10px' }}>
                                    <IconAlarmOff style={{ marginBottom: '-5px', color: 'red' }} />:{' '}
                                    <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                        {timeSum ? Math.ceil((timeSum[0]?.totalTimeOff / 60) * 10) / 10 : 0}h
                                    </span>
                                    <span style={{ fontWeight: 'bold', fontSize: '17px', marginLeft: '15px' }}>| </span>
                                </span>
                                <span style={{ marginLeft: '10px' }}>
                                    <IconBug style={{ marginBottom: '-5px', color: 'red' }} /> :{' '}
                                    <span style={{ fontWeight: 'bold', fontSize: '17px', color: 'red' }}>
                                        {timeSum ? Math.ceil((timeSum[0]?.totalTimeBug / 60) * 10) / 10 : 0}h
                                    </span>
                                </span>
                            </span>
                        </div>
                        <BaseTable
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={data}
                            columns={columns}
                        />
                    </div>
                }
            />
            <DetailMyTaskProjectModal open={openedModal} onCancel={() => handlersModal.close()} DetailData={detail} />
        </PageWrapper>
    );
}

export default MyActivityProjectListPage;

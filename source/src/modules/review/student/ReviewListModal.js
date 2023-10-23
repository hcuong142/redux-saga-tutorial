import { Col, Form, Modal, Row, Button, Rate, Progress } from 'antd';
import React, { useState } from 'react';
import useNotification from '@hooks/useNotification';
import { defineMessages } from 'react-intl';
import { useIntl } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import AvatarField from '@components/common/form/AvatarField';
import useDisclosure from '@hooks/useDisclosure';
import { convertUtcToLocalTime } from '@utils/index';
import { StarOutlined, UserOutlined } from '@ant-design/icons';
import { AppConstants, DEFAULT_FORMAT,DATE_FORMAT_VALUE } from '@constants';
import ReviewModal from './ReviewModal';
import useAuth from '@hooks/useAuth';

const messages = defineMessages({
    objectName: 'Đánh giá',
    update: 'Cập nhật',
    updateSuccess: 'Cập nhật {objectName} thành công',
});
const ReviewListModal = ({ star,checkReivew,courseId,open, onCancel, data, ...props }) => {
    const translate = useTranslate();
    const { profile } = useAuth();

    const [openCreateModal, handlersCreateModal] = useDisclosure(false);
    const handleReviewModal=() => {
        handlersCreateModal.open();
    };

    let totalStars = 0;
    let totalRatings = 0;
    const ratingCount = Array(5).fill(0);

    star?.forEach(item => {
        totalStars += item.star * item.amount;
        totalRatings += item.amount;

        if (item.star >= 1 && item.star <= 5) {
            ratingCount[item.star - 1] += item.amount;
        }
    });
    const averageRating = totalRatings > 0 ? totalStars / totalRatings : 0;
    const ratingPercentages = ratingCount.map(count => (totalRatings > 0 ? (count / totalRatings) * 100 : 0));
    return (
        <Modal centered open={open} onCancel={onCancel} footer={null} title={translate.formatMessage(messages.objectName)} {...props}>
            <div style={{ marginBottom:'10px',borderBottom:'1px solid #ddd',paddingBottom:'20px' }}>
                <Row gutter={16} >
                    <Col span={12}>
                        <Row >
                            <Col span={24} align="center" >
                                <h3 style={{ marginBottom:'10px',fontSize:'30px', color:'#1890FF' }}>{averageRating}</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} align="center">
                                <Rate disabled allowHalf value={averageRating}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <>
                            <Row>
                                <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '8px' }}>5</span>
                                    <StarOutlined style={{ color: '#FFD700', marginRight: '8px' }} />
                                    <Progress
                                        strokeColor={'#FFD700'}
                                        percent={ratingPercentages[4]}
                                        style={{ flex: 1 }}
                                    />
                                </Col>
                                <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '8px' }}>4</span>
                                    <StarOutlined style={{ color: '#FFD700', marginRight: '8px' }} />
                                    <Progress
                                        strokeColor={'#FFD700'}
                                        percent={ratingPercentages[3]}
                                        style={{ flex: 1 }}
                                    />
                                </Col>
                                <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '8px' }}>3</span>
                                    <StarOutlined style={{ color: '#FFD700', marginRight: '8px' }} />
                                    <Progress
                                        strokeColor={'#FFD700'}
                                        percent={ratingPercentages[2]}
                                        style={{ flex: 1 }}
                                    />
                                </Col>
                                <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '8px' }}>2</span>
                                    <StarOutlined style={{ color: '#FFD700', marginRight: '8px' }} />
                                    <Progress
                                        strokeColor={'#FFD700'}
                                        percent={ratingPercentages[1]}
                                        style={{ flex: 1 }}
                                    />
                                </Col>
                                <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '8px' }}>1</span>
                                    <StarOutlined style={{ color: '#FFD700', marginRight: '8px' }} />
                                    <Progress
                                        strokeColor={'#FFD700'}
                                        percent={ratingPercentages[0]}
                                        style={{ flex: 1 }}
                                    />
                                </Col>
                            </Row>

                        </>
                    </Col>
                </Row>
                {!checkReivew && (
                    
                    <Row style={{ marginTop:'20px' }}>
                        <Col span={12} align="center">
                            <Button onClick={handleReviewModal} type="primary">Viết đánh giá</Button>
                        </Col>
                    </Row>
                )}
            </div>
            <>
                <Row>
                    <span style={{ color: '#1890FF', fontSize:'16px',marginLeft:'-8px',marginBottom:'10px' }}>Đánh giá {averageRating}({totalRatings} Review)</span>
                </Row>
                {data.length>0 ? data?.map((item, index) => (
                    <Row gutter={16} key={index} style={{ border: '1px solid #ddd', borderRadius: '3px', padding: '6px',marginBottom:'20px' }}>
                        <Col span={2} align='center' justify="center">
                            <AvatarField
                                size="large"
                                icon={<UserOutlined />}
                                src={item?.studentInfo?.avatar ? `${AppConstants.contentRootUrl}${item.studentInfo.avatar}` : null}
                            />
                        </Col>
                        <Col span={17}>
                            <div style={{ fontWeight: '500', fontSize: '16px' }}>{item?.studentInfo?.fullName}</div>
                            <Row><span>{item.message}</span></Row>
                            <Row><span>{convertUtcToLocalTime(item.createdDate, DEFAULT_FORMAT, DATE_FORMAT_VALUE)}</span></Row>
                        </Col>
                        <Col span={5}>
                            <Rate disabled defaultValue={item?.star} style={{ fontSize: '18px' }} />
                        </Col>
                    </Row>
                )):''}
            </>

            <ReviewModal
                open={openCreateModal}
                onCancel={() => handlersCreateModal.close()}
                courseId = {courseId}
                profile={profile}
                width={800}
            />
        </Modal>
        
    );
};

export default ReviewListModal;

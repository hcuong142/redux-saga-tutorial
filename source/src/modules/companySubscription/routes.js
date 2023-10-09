import apiConfig from "@constants/apiConfig";
import CompanySubscriptionListPage from ".";
import CompanySubscriptionSavePage from "./CompanySubscriptionSavePage";

export default {
    companySubscriptionListPage: {
        path: '/companySubscription',
        title: 'Company Subscription',
        auth: true,
        component: CompanySubscriptionListPage,
        permissions: [apiConfig.companySubscription.getList.baseURL],
    },
    companySubscriptionSavePage: {
        path: '/companySubscription/:id',
        title: 'Company Subscription Save Page',
        auth: true,
        component: CompanySubscriptionSavePage,
        separateCheck: true,
        permission: [apiConfig.companySubscription.create.baseURL, apiConfig.companySubscription.update.baseURL],
    },
};
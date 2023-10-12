import apiConfig from '@constants/apiConfig';
import SettingPage from '.';

export default {
    settingsPage: {
        path: '/settings',
        title: 'Settings',
        auth: true,
        component: SettingPage,
        permissions: [apiConfig.settings.getList.baseURL],
    },
};

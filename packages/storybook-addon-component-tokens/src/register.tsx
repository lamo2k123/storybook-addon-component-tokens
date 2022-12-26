import * as React from 'react';
import addons, { types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';

import { CssPropsPanel } from './components/css-props-panel';
import { ADDON_ID, PARAM_KEY } from './constants';

addons.register(ADDON_ID, (api) => {
    addons.addPanel(ADDON_ID, {
        title: () => {
            const params = api.getCurrentParameter<{ values?: any }>(PARAM_KEY);
            const count = Object.keys(params?.values || {}).length;
            const title = ['CSS Controls'];

            if(count) {
                title.push(`(${count})`);
            }

            return title.join(' ');
        },
        type: types.PANEL,
        paramKey: PARAM_KEY,
        render: (option) => (
            <AddonPanel
                key={option.key}
                active={!!option.active}
            >
                <CssPropsPanel />
            </AddonPanel>
        )
    });
});

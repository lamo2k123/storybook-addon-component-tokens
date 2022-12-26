import * as React from 'react';
import { styled } from '@storybook/theming';
import { Link } from '@storybook/components';
import { useParameter } from '@storybook/api';

import { CssPropsTable } from './css-props-table';
import { PARAM_KEY } from '../constants';

export interface IParams {
    values?: Record<string, any>
}

const NoCustomPropertiesWrapper = styled.div(({ theme }) => ({
    background: theme.background.warning,
    color: theme.color.darkest,
    padding: '10px 15px',
    lineHeight: '20px',
    boxShadow: `${theme.appBorderColor} 0 -1px 0 0 inset`
}));

export const CssPropsPanel = () => {
    const parameters = useParameter<IParams>(PARAM_KEY, {});

    if(parameters.values && Object.keys(parameters.values).length) {
        return (
            <CssPropsTable
                values={parameters.values}
                inAddonPanel={true}
            />
        )
    }

    return (
        <NoCustomPropertiesWrapper>
            This story is not configured with Component Tokens.&nbsp;
            <Link
                href="https://github.com/lamo2k123/storybook-addon-component-tokens"
                target="_blank"
                cancel={false}
                children="Learn how to add Component Tokens »"
            />
        </NoCustomPropertiesWrapper>
    );
};

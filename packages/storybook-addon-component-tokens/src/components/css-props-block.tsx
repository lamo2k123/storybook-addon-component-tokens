import * as React from 'react';
import { DocsContext, DocsContextProps } from '@storybook/addon-docs';

import { CssPropsTable } from './css-props-table';

interface IProps {
    values: Record<string, {
        media?: string;
        name?: string;
        selector?: string;
        value: string;
        category?: string,
        description?: string,
        defaultValue?: string
    }>;
}

export const CssPropsBlock = (props: IProps) => {
    const context = React.useContext<DocsContextProps>(DocsContext);
    const values = props.values || { ...context?.parameters?.cssProps };

    if(values && Object.keys(values).length) {
        return <CssPropsTable values={values} inAddonPanel={false}/>;
    }

    return null;
};

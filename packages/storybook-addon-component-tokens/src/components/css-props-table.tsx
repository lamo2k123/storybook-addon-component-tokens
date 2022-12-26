import * as React from 'react';
import { components, ArgsTable, ArgTypes, Placeholder } from '@storybook/components';

import { isValidColor } from './utils';
import {
    resetStorage,
    updateStorage,
    mergeCustomPropertiesWithStorage
} from './storage';
import { useInjectStyle } from './inject-style';

const ResetWrapper = components.resetwrapper;

interface IProps {
    inAddonPanel?: boolean;
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

export const CssPropsTable = (props: IProps) => {
    const customPropertiesJSON = JSON.stringify(props.values);
    const { rows, initialArgs, argsKeys } = React.useMemo(() => {
            return Object
                .entries(props.values)
                .reduce((prev, [key, value]) => {
                        if(!value.selector) {
                            return prev;
                        }

                        const argKey = `${value.selector.trim()}/${key.trim()}${value.media ? `/${value.media}` : ''}`;

                        prev.argsKeys.push(argKey);
                        prev.rows[argKey] = {
                            control: { type: isValidColor(value.value) ? 'color' : 'text' },
                            defaultValue: { summary: value.defaultValue || value.value },
                            name: `${key}${value.media ? ` @ ${value.media}` : ''}`,
                            table: {
                                category: value.category
                            },
                            description: value.description,
                            key: argKey,
                            type: { name: 'string' }
                        };
                        prev.initialArgs[argKey] = value.value;

                        return prev;
                    }, {
                        rows: {} as ArgTypes,
                        initialArgs: {} as Record<string, string>,
                        argsKeys: [] as string[]
                    });
        },
        [customPropertiesJSON]
    );

    const [prevProps, setPrevProps] = React.useState(customPropertiesJSON);
    const [mergedArgs, setMergedArgs] = React.useState(
        mergeCustomPropertiesWithStorage(initialArgs)
    );

    if(customPropertiesJSON !== prevProps) {
        // update `mergedArgs` if customProperties changed
        // @see https://github.com/facebook/react/issues/14738
        setPrevProps(customPropertiesJSON);
        setMergedArgs(mergeCustomPropertiesWithStorage(initialArgs));
    }

    useInjectStyle(mergedArgs);

    if(!argsKeys.length) {
        return (
            <ResetWrapper>
                <Placeholder>Please wait</Placeholder>
            </ResetWrapper>
        );
    }

    return (
        <ResetWrapper>
            <ArgsTable
                inAddonPanel={props.inAddonPanel}
                compact={false}
                updateArgs={(args) => {
                    const storedProperties = updateStorage(args);

                    setMergedArgs(
                        mergeCustomPropertiesWithStorage(mergedArgs, storedProperties)
                    );
                }}
                resetArgs={() => {
                    resetStorage(argsKeys);
                    setMergedArgs(initialArgs);
                }}
                rows={rows}
                args={mergedArgs}
            />
        </ResetWrapper>
    );
};

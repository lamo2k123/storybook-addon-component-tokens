import * as React from "react";
import { FullCustomPropertyValue } from 'custom-property-extract/dist/types';
import {
  components,
  ArgsTable,
  ArgsTableOptionProps,
  ArgTypes,
  Placeholder,
} from "@storybook/components";
import { isValidColor, Args } from "./utils";
import {
  resetStorage,
  updateStorage,
  mergeCustomPropertiesWithStorage,
} from "./storage";
import { useInjectStyle } from "./InjectStyle";

const ResetWrapper = components.resetwrapper;

interface CssPropsTableRowProps {
  customProperties: {
    [key: string]: Array<FullCustomPropertyValue & {
      category?: string,
      description?: string,
      defaultValue?: string
    }>;
  };
  inAddonPanel?: boolean;
}

export const CssPropsTable: React.FC<CssPropsTableRowProps> = ({
  customProperties = {},
  inAddonPanel,
}) => {
  const customPropertiesJSON = JSON.stringify(customProperties);
  const { rows, initialArgs, argsKeys } = React.useMemo(
    () =>
      Object.entries(customProperties).reduce(
        (prev, [key, values]) => {
          values.forEach((item) => {
            if (!item.selector) return;
            const argKey = `${item.selector.trim()}/${key.trim()}${
              item.media ? `/${item.media}` : ""
            }`;
            prev.argsKeys.push(argKey);
            prev.rows[argKey] = {
              control: { type: isValidColor(item.value) ? "color" : "text" },
              defaultValue: { summary: item.defaultValue || item.value },
              name: `${key}${item.media ? ` @ ${item.media}` : ""}`,
              table: {
                category: item.category,
              },
              description: item.description,
              key: argKey,
              type: { name: "string" },
            };
            prev.initialArgs[argKey] = item.value;
          });
          return prev;
        },
        {
          rows: {} as ArgTypes,
          initialArgs: {} as Args,
          argsKeys: [] as string[],
        }
      ),
    [customPropertiesJSON]
  );

  console.log(123, rows, initialArgs, argsKeys);

  const [prevProps, setPrevProps] = React.useState(customPropertiesJSON);
  const [mergedArgs, setMergedArgs] = React.useState(
    mergeCustomPropertiesWithStorage(initialArgs)
  );

  if (customPropertiesJSON !== prevProps) {
    // update `mergedArgs` if customProperties changed
    // @see https://github.com/facebook/react/issues/14738
    setPrevProps(customPropertiesJSON);
    setMergedArgs(mergeCustomPropertiesWithStorage(initialArgs));
  }

  const resetArgs = () => {
    resetStorage(argsKeys);
    setMergedArgs(initialArgs);
  };

  const updateArgs: ArgsTableOptionProps["updateArgs"] = (args) => {
    const storedProperties = updateStorage(args);
    setMergedArgs(
      mergeCustomPropertiesWithStorage(mergedArgs, storedProperties)
    );
  };

  useInjectStyle(mergedArgs);

  return (
    <ResetWrapper>
      {argsKeys.length ? (
        <ArgsTable
          inAddonPanel={inAddonPanel}
          compact={false}
          updateArgs={updateArgs}
          resetArgs={resetArgs}
          rows={rows}
          args={mergedArgs}
        />
      ) : (
        <Placeholder>Please wait</Placeholder>
      )}
    </ResetWrapper>
  );
};

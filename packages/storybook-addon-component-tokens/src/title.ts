import { useParameter } from "@storybook/api";
import { PARAM_KEY } from "./constants";
import { FullExtractResult } from "custom-property-extract/dist/types";

export function getTitle(): string {
  const cssprops = useParameter<FullExtractResult>(PARAM_KEY, {});
  const count = Object.values(cssprops).filter(({ length }) => length).length;
  const title = ['CSS Controls'];

  if(count) {
    title.push(`(${count})`);
  }

  return title.join(' ');
}

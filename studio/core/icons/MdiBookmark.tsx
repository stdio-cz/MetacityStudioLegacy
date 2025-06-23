import { Icon as AdobeIcon } from "@adobe/react-spectrum";
import { IconProps } from "./Icon";

export function MdiBookmark(props: IconProps) {
  const { transform, ...rest } = props;
  return (
    <AdobeIcon {...rest}>
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path fill="currentColor" d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z" />
      </svg>
    </AdobeIcon>
  );
}

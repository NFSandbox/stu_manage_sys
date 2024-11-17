import { Container, FlexDiv } from "@/components/container";
import { classNames } from "@/tools/css_tools";

interface OperationBlockProps {
  name: string;
  children: React.ReactNode;
}

/**
 * Operation Container block unified components
 * @param props
 * @constructor
 */
export function OperationBlock(props: OperationBlockProps) {
  return (
    <FlexDiv className="p-2">
      <Container
        rounded
        className={classNames(
          classNames("w-full p-2", "bg-fgcolor dark:bg-fgcolor-dark"),
        )}
      >
        <FlexDiv
          expand
          hasPadding
          className={classNames("flex-col items-start justify-start gap-y-2")}
        >
          <p className={classNames("text-lg font-bold")}>{props.name}</p>
          {props.children}
        </FlexDiv>
      </Container>
    </FlexDiv>
  );
}

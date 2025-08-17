import { useEffect } from "react";
import Link from "next/link";
import { Button, Flex, Group } from "@mantine/core";
import styled from "styled-components";
import toast from "react-hot-toast";
import { AiOutlineFullscreen } from "react-icons/ai";
import { FaGithub } from "react-icons/fa6";
import { LuLink } from "react-icons/lu";
import { JSONCrackLogo } from "../../../layout/JsonCrackLogo";
import { atou, utoa } from "../../../lib/utils/hash";
import useFile from "../../../store/useFile";
import { FileMenu } from "./FileMenu";
import { ViewMenu } from "./ViewMenu";
import { StyledToolElement } from "./styles";

const StyledTools = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 4px;
  justify-content: space-between;
  height: 40px;
  padding: 4px 8px;
  background: ${({ theme }) => theme.TOOLBAR_BG};
  color: ${({ theme }) => theme.SILVER};
  z-index: 36;
  border-bottom: 1px solid ${({ theme }) => theme.SILVER_DARK};

  @media only screen and (max-width: 320px) {
    display: none;
  }
`;

function fullscreenBrowser() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {
      toast.error("Unable to enter fullscreen mode.");
    });
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

const Toolbar = () => {
  const contents = useFile(state => state.contents);
  const setContents = useFile(state => state.setContents);

  // Build a shareable URL
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.slice(1);
      const data = JSON.parse(atou(hash));

      setContents({
        contents: JSON.stringify(data, null, 2),
      });
    }
  }, []);

  return (
    <StyledTools>
      <Group gap="xs" justify="left" w="100%" style={{ flexWrap: "nowrap" }}>
        <StyledToolElement title="JSON PREVIEW">
          <Flex gap="xs" align="center" justify="center">
            <JSONCrackLogo fontSize="0.8rem" hideLogo />
          </Flex>
        </StyledToolElement>
        <FileMenu />
        <ViewMenu />
        {/* <ToolsMenu /> */}
        {/* <Button
          component={Link}
          href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=toolbar"
          target="_blank"
          rel="noopener"
          autoContrast
          color="yellow"
          variant="light"
          size="compact-xs"
          fz="12"
          fw="600"
          leftSection={<FaCrown />}
        >
          Try Pro
        </Button> */}
      </Group>
      <Group gap="xs" justify="right" w="100%" style={{ flexWrap: "nowrap" }}>
        <Button
          color="gray"
          fz="12"
          leftSection={<LuLink />}
          size="compact-sm"
          variant="default"
          onClick={async () => {
            const obj = JSON.parse(contents);
            const s = utoa(JSON.stringify(obj));

            const base = `${location.protocol}//${location.host}${location.pathname}`;

            const url = base + "#" + s;

            await navigator.clipboard.writeText(url);
            alert("Sharable URL has been copied to clipboard.");
          }}
        >
          Share
        </Button>
        <Link href="https://github.com/hunghg255/json-preview" rel="noopener" target="_blank">
          <StyledToolElement title="GitHub">
            <FaGithub size="18" />
          </StyledToolElement>
        </Link>
        <StyledToolElement title="Fullscreen" onClick={fullscreenBrowser}>
          <AiOutlineFullscreen size="18" />
        </StyledToolElement>
      </Group>
    </StyledTools>
  );
};

export default Toolbar;

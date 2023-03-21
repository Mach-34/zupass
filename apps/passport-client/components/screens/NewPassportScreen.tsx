import * as React from "react";
import { useContext } from "react";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import { config } from "../../src/config";
import { DispatchContext } from "../../src/dispatch";
import {
  BackgroundGlow,
  CenterColumn,
  H1,
  H2,
  HR,
  Spacer,
  TextCenter,
  ZuLogo,
} from "../core";
import { LinkButton } from "../core/Button";

/**
 * Show the user that we're generating their passport. Direct them to the email
 * verification link.
 */
export function NewPassportScreen() {
  const [state] = useContext(DispatchContext);
  const { identity, pendingAction } = state;
  if (pendingAction == null || pendingAction.type !== "new-passport") {
    window.location.href = "#/";
    window.location.reload();
    return null;
  }
  const { email } = pendingAction;

  let saveSelfPage = encodeURIComponent(window.location.origin + "#/save-self");

  // Create a magic link to the passport server.
  // TODO: move this to server side, add a token/nonce.
  const params = new URLSearchParams({
    redirect: saveSelfPage,
    email,
    commitment: identity.commitment.toString(),
    token: uuid(),
  }).toString();
  const magicLink = `${config.passportServer}/zuzalu/new-participant?${params}`;

  return (
    <BackgroundGlow
      y={224}
      from="var(--bg-lite-primary)"
      to="var(--bg-dark-primary)"
    >
      <Spacer h={64} />
      <TextCenter>
        <H1>PASSPORT</H1>
        <Spacer h={24} />
        <ZuLogo />
        <Spacer h={24} />
        <H2>ZUZALU</H2>
        <Spacer h={48} />
        <PItalic>Generating passport...</PItalic>
        <PItalic>Sending verification email...</PItalic>
        <PHeavy>
          Check your email. {magicLink && <a href={magicLink}>Dev link.</a>}
        </PHeavy>
      </TextCenter>
      <Spacer h={48} />
      <HR />
      <Spacer h={24} />
      <CenterColumn w={280}>
        <LinkButton to={"/sync-existing"}>Sync Existing Passport</LinkButton>
        <Spacer h={8} />
        <LinkButton to={"/scan-and-verify"}>Verify a Passport</LinkButton>
      </CenterColumn>
    </BackgroundGlow>
  );
}

const PItalic = styled.p`
  font-size: 20px;
  font-weight: 300;
  font-style: italic;
  color: rgba(var(--white-rgb), 0.5);
  line-height: 2;
`;

const PHeavy = styled.p`
  font-size: 20px;
  font-weight: 400;
  line-height: 2;
  color: var(--accent-lite);
`;

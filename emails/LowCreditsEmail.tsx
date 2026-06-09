import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

export const LowCreditsEmail = ({ name, balance }: { name: string; balance: number }) => {
  return (
    <Html>
      <Head />
      <Preview>Your QuadBrand credits are running low ({String(balance)} remaining)</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Low Credits Alert
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              You're creating some amazing visuals, but we noticed your credit balance is getting low. You currently have <strong>{balance} credits</strong> remaining.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Upgrade your plan to keep generating without interruption, or top up with a credit pack.
            </Text>
            <Button
              className="bg-[#FF00FF] rounded text-white text-[12px] font-semibold no-underline text-center px-4 py-3"
              href="https://quadbrand.com/billing"
            >
              Upgrade Plan
            </Button>
            <Text className="text-black text-[14px] leading-[24px] mt-6">
              Best,
              <br />
              The QuadBrand Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default LowCreditsEmail;

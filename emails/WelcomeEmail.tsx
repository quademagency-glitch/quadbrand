import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

export const WelcomeEmail = ({ name }: { name: string }) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to QuadBrand — Your AI creative studio</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Welcome to <strong>QuadBrand</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              We're thrilled to have you here. QuadBrand gives you the power to generate on-brand marketing assets in seconds.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              We've added <strong>20 free credits</strong> to your account so you can start creating immediately.
            </Text>
            <Button
              className="bg-[#00F0FF] rounded text-black text-[12px] font-semibold no-underline text-center px-4 py-3"
              href="https://quadbrand.com/dashboard"
            >
              Go to Dashboard
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

export default WelcomeEmail;

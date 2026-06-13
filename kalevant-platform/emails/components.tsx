import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

const styles = {
  body: { backgroundColor: "#FAF8F4", fontFamily: "Georgia, serif", color: "#0E0E12" },
  container: { margin: "0 auto", padding: "32px 24px", maxWidth: "560px" },
  brand: { fontSize: "13px", letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#C9A227" },
  text: { fontSize: "16px", lineHeight: "1.6" },
  footer: { fontSize: "12px", color: "#6E6C64", lineHeight: "1.5" },
  hr: { borderColor: "#E0DCD2", margin: "24px 0" },
};

export function EmailShell({
  preview,
  children,
  unsubscribeUrl,
}: {
  preview: string;
  children: ReactNode;
  unsubscribeUrl?: string;
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>Kalevant Group</Text>
          <Section>{children}</Section>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            Kalevant Group LLC · West Des Moines, Iowa
            {unsubscribeUrl ? (
              <>
                {" · "}
                <Link href={unsubscribeUrl} style={{ color: "#6E6C64" }}>
                  Unsubscribe
                </Link>
              </>
            ) : null}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <Text style={styles.text}>{children}</Text>;
}

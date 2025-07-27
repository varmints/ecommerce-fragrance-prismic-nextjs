import { Bounded } from "@/components/Bounded";
import { ButtonLink } from "@/components/ButtonLink";
import { HiCheckCircle } from "react-icons/hi2";

type PageProps = {
  params: Promise<{
    lang: string;
  }>;
};

export default async function SuccessPage({ params }: PageProps) {
  const { lang } = await params;

  return (
    <Bounded className="grid min-h-[70vh] place-items-center text-center">
      <div>
        <HiCheckCircle className="mx-auto h-24 w-24 text-green-500" />
        <h1 className="font-display mt-6 text-4xl md:text-5xl">
          Thank you for your order!
        </h1>
        <p className="mt-4 text-lg text-neutral-300">
          Your payment was successful. A confirmation email has been sent to
          you.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <ButtonLink href={`/${lang}`} variant="Primary">
            Continue Shopping
          </ButtonLink>
          <ButtonLink href={`/${lang}/account`} variant="Secondary">
            View Order
          </ButtonLink>
        </div>
      </div>
    </Bounded>
  );
}

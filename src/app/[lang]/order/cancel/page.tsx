import { Bounded } from "@/components/Bounded";
import { ButtonLink } from "@/components/ButtonLink";
import { HiXCircle } from "react-icons/hi2";

type PageProps = {
  params: Promise<{
    lang: string;
  }>;
};

export default async function CancelPage({ params }: PageProps) {
  const { lang } = await params;

  return (
    <Bounded className="grid min-h-[70vh] place-items-center text-center">
      <div>
        <HiXCircle className="mx-auto h-24 w-24 text-red-500" />
        <h1 className="font-display mt-6 text-4xl md:text-5xl">
          Payment Canceled
        </h1>
        <p className="mt-4 text-lg text-neutral-300">
          Your payment was not processed. Your cart has been saved.
        </p>
        <div className="mt-10">
          <ButtonLink href={`/${lang}/`} variant="Primary">
            Return to Homepage
          </ButtonLink>
        </div>
      </div>
    </Bounded>
  );
}

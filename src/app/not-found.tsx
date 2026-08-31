import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Monogram } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[80svh] flex-col items-center justify-center py-32 text-center">
      <Monogram className="w-10 opacity-70" />
      <p className="eyebrow mt-10 text-gold-3">Error 404</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,1.5rem+4vw,5rem)]">
        This page has been retired
      </h1>
      <p className="lede mt-6 max-w-md">
        Like a Mirage design, it is no longer made. The drawings are in the archive; the collection
        is still here.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/shop" variant="ink">
          Browse the collection
        </ButtonLink>
        <ButtonLink href="/" variant="outline">
          Back to the beginning
        </ButtonLink>
      </div>
      <Link href="/contact" className="link-line eyebrow mt-10 text-[9px] opacity-45">
        Or ask us where it went
      </Link>
    </div>
  );
}

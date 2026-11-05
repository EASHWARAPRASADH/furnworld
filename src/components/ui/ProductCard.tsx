import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { Price } from "./Price";
import { TiltCard } from "./TiltCard";

export function ProductCard({
  product,
  categoryName,
  showPrices,
  symbol,
  priority = false,
}: {
  product: Product;
  categoryName?: string;
  showPrices: boolean;
  symbol: string;
  priority?: boolean;
}) {
  const img = product.images[0];
  return (
    <TiltCard className="group h-full">
      <Link href={`/product/${product.slug}`} data-cursor="View" className="block h-full card-hover rounded-[1.4rem] bg-white p-3 ring-1 ring-line/60">
        <div className="img-zoom relative aspect-[4/3] overflow-hidden rounded-[1rem] bg-paper-2">
          {img ? (
            <Image src={img} alt={product.name} fill sizes="(max-width: 768px) 92vw, (max-width: 1280px) 45vw, 23vw" className="object-cover" priority={priority} />
          ) : null}
          {product.badge ? (
            <span className="absolute left-3 top-3 rounded-full bg-ink/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">{product.badge}</span>
          ) : null}
          <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:rotate-0 rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <div className="px-2 pb-2 pt-4">
          {categoryName ? <p className="eyebrow !text-[0.62rem] mb-1.5">{categoryName}</p> : null}
          <h3 className="font-display text-[1.25rem] leading-tight tracking-[-0.01em]">{product.name}</h3>
          <p className="mt-1.5 line-clamp-1 text-sm text-muted">{product.shortDescription}</p>
          <div className="mt-3 flex items-center justify-between">
            <Price value={product.price} compareAt={product.compareAtPrice} show={showPrices} symbol={symbol} quiet className="text-[0.95rem]" />
            {product.builderModel ? <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-accent">Customisable</span> : null}
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}

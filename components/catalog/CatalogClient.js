"use client";

import { useSearchParams } from "next/navigation";
import Catalog from "./Catalog";


export default function CatalogClient({ data }) {
  const searchParams = useSearchParams();

  return <Catalog data={data} searchParams={searchParams} />;
}

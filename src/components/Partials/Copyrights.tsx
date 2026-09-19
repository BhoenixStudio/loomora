"use client";

import { useLoomoraConfig } from "../../config";
import { useDates } from "../../hooks";
import { GlobalElementEssentials } from "../../types";

export type CopyrightsProps = GlobalElementEssentials<"p"> & {
  startYear?: number;
  currentYear?: number;
  sponsor?: string;
  sponsorLink?: string;
  copyrights: string;
};

export function Copyrights(props: Readonly<CopyrightsProps>) {
  const { format } = useDates();

  const { LinkType } = useLoomoraConfig();

  const {
    className = "text-sm text-body-3",
    currentYear = format(new Date(), { type: "fullYear" }),
    startYear = 2025,
    sponsor = "",
    attributes,
    sponsorLink = "/",
    copyrights,
    ...attrs
  } = props;

  return (
    <p className={`flex items-center ${className} font-normal gap-1`} {...attributes} {...attrs}>
      {currentYear != startYear && <>{startYear} - </>}
      {currentYear} ©
      {sponsor && sponsorLink && (
        <LinkType href={sponsorLink} className="font-medium text-primary">
          {sponsor}
        </LinkType>
      )}
      {sponsor && !sponsorLink && <span className="font-medium">{sponsor}</span>}
      {copyrights}
    </p>
  );
}

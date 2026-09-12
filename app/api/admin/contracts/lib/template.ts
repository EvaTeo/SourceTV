function formatContractDate(
  value: Date | null
): string {
  if (!value) {
    return "To be completed";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }
  ).format(value);
}

type BuildDefaultContractTextInput = {
  title: string;
  partnerName: string;
  rightsOwner: string;
  licenseType: string;
  territories: string;
  exclusivity: string;
  revenueShare: number;
  licenseStartDate: Date | null;
  licenseEndDate: Date | null;
};

export function buildDefaultContractText({
  title,
  partnerName,
  rightsOwner,
  licenseType,
  territories,
  exclusivity,
  revenueShare,
  licenseStartDate,
  licenseEndDate,
}: BuildDefaultContractTextInput): string {
  return `SOURCE TV STREAMING RIGHTS AGREEMENT

Title:
${title}

Partner:
${partnerName || "To be completed"}

Rights Holder:
${rightsOwner || "To be completed"}

Agreement Summary:
This draft agreement grants SourceTV permission to stream, promote, display, and monetize the submitted title on the SourceTV platform, subject to the final terms approved by both parties.

License Type:
${licenseType}

Territory:
${territories}

Exclusivity:
${exclusivity}

Revenue Share:
${revenueShare}% to the rights holder, unless otherwise amended in writing.

License Start Date:
${formatContractDate(licenseStartDate)}

License End Date:
${formatContractDate(licenseEndDate)}

Rights Holder Confirmation:
The partner confirms that they own or control the necessary rights, licenses, permissions, music clearances, performer releases, artwork rights, and distribution permissions required to stream this title on SourceTV.

SourceTV Rights:
SourceTV may display the title, poster, trailer, title metadata, artwork, thumbnails, descriptions, and related promotional assets on SourceTV-owned services and marketing channels according to the final license terms.

Term:
The license term begins and ends on the dates recorded in the final signed contract.

Termination:
Either party may request removal or review according to the final agreement terms and any applicable written amendments.

Signature:
By signing, the partner confirms that the information provided is accurate and that they have authority to enter into this agreement.

This is a draft contract template and should be reviewed by qualified legal counsel before production use.`;
}
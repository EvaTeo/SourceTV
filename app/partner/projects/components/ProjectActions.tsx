import Link from "next/link";

import type { PartnerProject } from "../types";

type ProjectActionsProps = {
  project: PartnerProject;
};

type ProjectAction = {
  title: string;
  description: string;
  href: string;
  primary?: boolean;
};

export default function ProjectActions({
  project,
}: ProjectActionsProps) {
  const actions: ProjectAction[] = [
    {
      title: "Message SourceTV",
      description: "Contact the review team",
      href: "/partner/inbox",
      primary: true,
    },
    {
      title: "Contracts",
      description: "Review rights agreements",
      href: "/partner/contracts",
    },
    {
      title: "Revenue",
      description: "View participation information",
      href: "/partner/revenue",
    },
  ];

  if (project.workflowStage === "published") {
    actions.unshift({
      title: "View on SourceTV",
      description: "Open the published title",
      href: `/watch/${project.id}`,
      primary: true,
    });
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.07] p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
          Project Actions
        </p>

        <p className="mt-2 text-xs leading-5 text-white/30">
          Access the SourceTV areas connected to this
          project.
        </p>
      </div>

      <div className="space-y-2 p-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className={`group block rounded-xl border px-4 py-3.5 transition ${
              action.primary
                ? "border-sky-300/20 bg-sky-300/[0.07] hover:border-sky-300/35 hover:bg-sky-300/[0.11]"
                : "border-transparent hover:border-white/[0.08] hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p
                  className={`text-sm font-black ${
                    action.primary
                      ? "text-sky-100"
                      : "text-white/70 group-hover:text-white"
                  }`}
                >
                  {action.title}
                </p>

                <p className="mt-1 text-xs text-white/30">
                  {action.description}
                </p>
              </div>

              <span className="text-sky-200 transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
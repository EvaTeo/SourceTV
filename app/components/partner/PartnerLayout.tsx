import PartnerSidebar from "./PartnerSidebar";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <PartnerSidebar />

      <div className="min-h-screen lg:pl-[270px]">
        <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
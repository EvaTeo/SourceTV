type Props = {
  title: string;
  body: string;
};

export default function RoadmapCard({ title, body }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <h3 className="text-lg font-black text-white">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-white/45">{body}</p>
    </div>
  );
}
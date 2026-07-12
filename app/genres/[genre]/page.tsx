import CategoryPage from "@/app/category/CategoryPage";

function formatGenre(value: string) {
  return decodeURIComponent(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default async function GenrePage({
  params,
}: {
  params: Promise<{
    genre: string;
  }>;
}) {
  const { genre } = await params;
  const formattedGenre = formatGenre(genre);

  return (
    <CategoryPage
      title={formattedGenre}
      description={`Explore ${formattedGenre.toLowerCase()} films, shows, and stories selected from across SourceTV.`}
      genre={formattedGenre}
    />
  );
}
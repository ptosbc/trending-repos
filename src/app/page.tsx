import Image from "next/image";
import Link from "next/link";

type UserType = {
  username: string;
  href: string;
  avatar: string;
};

type TrendingRepoType = {
  author: string;
  name: string;
  url: string;
  description: string;
  stars: number;
  forks: string;
  currentPeriodStars: string;
  builtBy: UserType[];
};

async function getTrendingReposData() {
  const res = await fetch("https://api.gitterapp.com/", {
    next: {
      // Refresh each hour
      revalidate: 3600,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch trending repos data from the API");
  }

  return res.json();
}

export default async function Home() {
  const trendingReposData = await getTrendingReposData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <h1 className="mb-3 text-2xl md:text-4xl font-bold">Trending Repos</h1>

      <p className="mb-5 text-sm font-bold">
        Find latest trending GitHub repositories.
      </p>

      {trendingReposData.map((trendingRepo: TrendingRepoType) => (
        <Link
          key={trendingRepo.url}
          href={trendingRepo.url}
          className="block max-w-xl md:max-w-3xl w-full p-6 mb-5 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
        >
          <h5 className="mb-2 text-base md:text-2xl font-bold tracking-tight text-gray-900">
            {trendingRepo.author}/{trendingRepo.name}
          </h5>
          <p className="mb-2 font-sm text-gray-700">
            {trendingRepo.description}
          </p>

          <p className="mb-2 font-sm text-gray-700">
            Stars: {trendingRepo.stars}
            {" (+"}
            <span className="font-bold">{trendingRepo.currentPeriodStars}</span>
            {")"}
          </p>

          <p className="mb-2 font-sm text-gray-700">
            Forks: {trendingRepo.forks}
          </p>

          <div className="flex flex-wrap gap-2">
            {trendingRepo.builtBy.map((user: UserType) => (
              <Link key={user.username} href={user.href}>
                <Image
                  alt={user.username}
                  src={user.avatar}
                  width={32}
                  height={32}
                  className="rounded"
                />
              </Link>
            ))}
          </div>
        </Link>
      ))}

      <h5 className="text-base">
        Made with{" "}
        <Image
          className="inline-block mx-1"
          alt="love"
          src="/red-heart.png"
          width={25}
          height={25}
          priority
        />{" "}
        by{" "}
        <Link
          className="inline-block text-blue-500 mx-1"
          href="https://github.com/ptosbc"
        >
          PTOS B. C.
        </Link>
      </h5>
    </main>
  );
}

import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { getPostListings } from "~/models/post.server";
import { requireAdminUser } from "~/session.server";

type LoaderData = {
  postListings: Awaited<ReturnType<typeof getPostListings>>
}

export const loader: LoaderFunction = async ({request}) => {
  await requireAdminUser(request);
  return json<LoaderData>({postListings: await getPostListings()});
}
export default function AdminRoute() {
  const { postListings } = useLoaderData() as LoaderData;
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">Blog Admin</h1>
      <div className="grid grid-cols-4 gap-6">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {postListings.map((post) => (
              <li key={post.slug}>
                <Link to={post.slug} prefetch="intent" className="text-blue-600 underline">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}



import { Link, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { getPostListings } from "~/models/post.server";
import { useOptionalAdminUser } from "~/utils";
import { requireAdminUser } from "~/session.server";

type LoaderData = {
  postListings: Awaited<ReturnType<typeof getPostListings>>
}

export const loader: LoaderFunction = async () => {
  const postListings = await getPostListings();

  return json<LoaderData>({ postListings });
}
export default function PostsRoute() {
  const { postListings } = useLoaderData() as LoaderData;
  const adminUser = useOptionalAdminUser();

  return (
    <main>
      <h1>Posts</h1>
      { adminUser ? (
        <Link to="admin" className="text-red-600 underline">
          Admin
        </Link>
      ) : null }
      <ul>
        {postListings.map((postListing) => (
          <li key={postListing.slug}>
            <Link
              to={postListing.slug}
              prefetch="intent"
              className="text-blue-600 underline"
            >
              {postListing.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiUser } from "react-icons/fi";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import Layout from "@components/layout/layout";
import Container from "@components/ui/container";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, []);

  return (
    <Container>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-10 text-center">
          📝 Latest Blogs
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blogs/${blog.slug}`}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group cursor-pointer flex flex-col">
                <div className="relative h-48 w-full">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                      {blog.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
                    <div className="flex items-center gap-2">
                      <FiUser className="w-4 h-4" />
                      <span>{blog.author}</span>
                    </div>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}

BlogList.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        "common",
        "forms",
        "menu",
        "footer",
      ])),
    },
  };
};

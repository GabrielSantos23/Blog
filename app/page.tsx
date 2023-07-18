'use client';

import Link from 'next/link';
import { Post } from './lib/interface';
import { client } from './lib/sanity';
import useLoading from './hooks/isLoading';
import { use, useEffect, useState } from 'react';
import SplashScreen from './components/SplashScreen';

async function getData() {
  const query = `*[_type == 'post']`;

  const data = await client.fetch(query);

  return data;
}

export default function IndexPage() {
  const [data, setData] = useState<Post[]>([]);
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await getData();
      setData(result);
      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <>
      <SplashScreen isLoading={isLoading} />
      <div className='divide-y divide-gray-200 dark:divide-zinc-900'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14'>
            All Posts
          </h1>
        </div>
        <ul>
          {data.map((post) => (
            <li key={post._id} className='py-4'>
              <article className='space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0'>
                <div>
                  <p className='text-base font-medium leading-6 text-teal-500'>
                    {new Date(post._createdAt).toISOString().split('T')[0]}
                  </p>
                </div>
                <Link
                  href={`/post/${post.slug.current}`}
                  prefetch
                  className='space-y-3 xl:col-span-3'
                >
                  <div className=''>
                    <h3 className='text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100'>
                      {post.title}
                    </h3>
                  </div>
                  <p className='prose max-w=none text-gray-500 dark:text-gray-400 line-clamp-2'>
                    {post.overview}
                  </p>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

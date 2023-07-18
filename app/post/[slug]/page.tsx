import { Post } from '@/app/lib/interface';
import { client } from '@/app/lib/sanity';
import { urlFor } from '@/app/lib/sanityImage';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';

async function getData(slug: string) {
  const query = `*[_type == "post" && slug.current == "${slug}"][0]`;

  const data = await client.fetch(query);

  return data;
}

export default async function SlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = (await getData(params.slug)) as Post;
  const PortableTextComponent = {
    types: {
      image: ({ value }: { value: any }) => (
        <div className='flex'>
          <Image
            src={urlFor(value).url()}
            alt='Image'
            className='rounded-lg'
            width={1024}
            height={1024}
          />
        </div>
      ),
    },
  };

  return (
    <div className='xl:divide-y xl:divide-gray-200 xl:dark:divide-zinc-900'>
      <header className='pt-6 xl:pb-6'>
        <div className='space-y-1 text-center'>
          <div className='space-y-10'>
            <div>
              <p className='text-base font-medium leading-6 text-teal-500'>
                {new Date(data._createdAt).toISOString().split('T')[0]}
              </p>
            </div>
          </div>
          <div>
            <h1 className='text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-leading-10 md:text-5xl md:leading-14'>
              {data.title}
            </h1>
          </div>
        </div>
      </header>

      <div className='divide-y divide-gray-200 pb-7 dark:divide-zinc-900 xl:divide-y-0'>
        <div className='dark:divide-zinc-900 divide-gray-200  dark:divide-gray xl:col-span-3 xl:row-span-2 xl:pb-0'>
          <div className='prose max-w-none pb-8 pt-10 dark:prose-invert prose-lg'>
            <PortableText
              value={data.content}
              components={PortableTextComponent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

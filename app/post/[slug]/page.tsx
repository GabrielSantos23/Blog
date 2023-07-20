'use client';

import SplashScreen from '@/app/components/SplashScreen';
import useLoading from '@/app/hooks/isLoading';
import { Post } from '@/app/lib/interface';
import { client } from '@/app/lib/sanity';
import { urlFor } from '@/app/lib/sanityImage';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

async function getData(slug: string) {
  const query = `*[_type == "post" && slug.current == "${slug}"][0]`;

  const data = await client.fetch(query);

  return data;
}

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    background: 'none',
    maxWidth: '90%',
    maxHeight: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
};

const ImageComponent = ({ value }: { value: any }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (modalIsOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [modalIsOpen]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <img
        src={urlFor(value).url()}
        alt='Image'
        className='rounded-lg  cursor-pointer'
        width={1024}
        height={1024}
        onClick={openModal}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
      >
        <Image
          src={urlFor(value).url()}
          alt='Image'
          className='rounded-lg'
          width={1024}
          height={1024}
        />
      </Modal>
    </>
  );
};

export default function SlugPage({ params }: { params: { slug: string } }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [data, setData] = useState<Post>();
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await getData(params.slug);
      setData(result);
      setLoading(false);
    }

    fetchData();
  }, []);

  const LinkComponent = ({ mark, children }: { mark: any; children: any }) => {
    return (
      <a href={mark.href} target='_blank' rel='noopener noreferrer'>
        {children}
      </a>
    );
  };

  const PortableTextComponent = {
    types: {
      image: ({ value }: { value: any }) => <ImageComponent value={value} />,
    },
  };

  return data ? (
    <div className='xl:divide-y xl:divide-gray-200  xl:dark:divide-zinc-900'>
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
  ) : (
    <SplashScreen isLoading={isLoading} />
  );
}

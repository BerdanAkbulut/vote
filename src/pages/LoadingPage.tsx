import Head from 'next/head';
import React from 'react';
import CachedIcon from '@mui/icons-material/Cached';
type Props = { title: string };

const LoadingPage = (props: Props) => {
  return (
    <div>
      <Head>
        <title>{props.title}</title>
      </Head>
      <div className="h-screen flex justify-center items-center ">
        <CachedIcon style={{ fontSize: 80 }} className="animate-spin" />
      </div>
    </div>
  );
};

export default LoadingPage;

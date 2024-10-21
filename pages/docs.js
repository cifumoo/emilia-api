import Layout from '../pages/Layout';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

const Home = () => {
  return (
    <Layout>
      <SwaggerUI url="/api/docs" />
    </Layout>
  );
};

export default Home;
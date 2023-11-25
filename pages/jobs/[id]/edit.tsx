import { useRouter } from 'next/router';
import PostJobs from '../../../components/dashboard-pages/employers-dashboard/post-jobs';
import { useFetch } from '../../../hooks/useFetch';
import { useEffect } from 'react';

const EditJobPage = () => {
  const { query } = useRouter();
  const jobFetch = useFetch();

  useEffect(() => {
    jobFetch.makeRequest(`/jobs/${query.id}/`);
  }, [query]);

  return <PostJobs job={jobFetch.data} />
};

export default EditJobPage;
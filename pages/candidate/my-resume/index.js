import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import MyResume from "../../../components/dashboard-pages/candidates-dashboard/my-resume";
import { MyResumeContextProvider } from "../../../contexts/MyResumeContext";

const index = () => {
  return (
    <MyResumeContextProvider>
      <Seo pageTitle="My Resume" />
      <MyResume />
    </MyResumeContextProvider>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

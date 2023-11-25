import dynamic from "next/dynamic";
import Seo from "../components/common/Seo";
import Home from "../components/job-listing-pages/job-list-v1";

const index = () => {
    return (
        <>
            <Seo pageTitle="Home-3" />
            <Home />
        </>
    );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

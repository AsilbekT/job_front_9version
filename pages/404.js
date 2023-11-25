import dynamic from "next/dynamic";
import { NotFoundPage } from "../components/common/NotFountPage";

const index = () => {
  return <NotFoundPage />
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

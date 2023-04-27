import { useSelector } from "react-redux";
import { selectAuth } from "@redux/features/authSlice";
import Redirect from "pages/redirect";

const PrivateRoute = ({ children }: { children: any }) => {
  const { token } = useSelector(selectAuth);
  return token ? children : <Redirect />;
};

export default PrivateRoute;

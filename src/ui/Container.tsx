import { useLocation, useNavigate } from "react-router";

export const Container = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const noGoBack = ["/", "/home"].some((page) => pathname === page);

  return (
    <div className="container">
      {noGoBack ? null : (
        <button className="go-back-btn" onClick={() => navigate(-1)}>
          {"<"}
        </button>
      )}
      {children}
    </div>
  );
};

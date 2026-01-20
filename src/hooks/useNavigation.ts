import { useLocation, useNavigate } from "react-router";

interface LocationState {
	from?: { pathname: string };
}

export const useNavigation = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const from = (location.state as LocationState)?.from?.pathname || "/";

	const goBackOrDefault = () => {
		navigate(from, { replace: true });
	};

	return { navigate, location, from, goBackOrDefault };
};

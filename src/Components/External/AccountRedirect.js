import { useSearchParams, useNavigate } from 'react-router-dom';

function AccountRedirect({ username }) {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const navigate = useNavigate();

    if (code) {
        navigate(`/account/${username}?code=${code}`);
    } else if (username) {
        navigate(`/account/${username}`)
    } else {
        navigate(`/account`)
    }

    return null;
}

export default AccountRedirect;

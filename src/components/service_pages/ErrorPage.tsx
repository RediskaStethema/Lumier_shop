import {useEffect} from "react";
import {useNavigate} from "react-router-dom";


const ErrorPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/error')
    },[])

    return (
        <div>
            <h1>404</h1>
            <h2>Please reload the page and sign up</h2>
        </div>
    );
};

export default ErrorPage;
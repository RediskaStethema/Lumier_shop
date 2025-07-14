import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import {Alert} from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';

import {useNavigate} from "react-router-dom";
import type {LoginData} from "../../../utils/types.ts";



const Card =  styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

type Props= {
    submitFn:(loginData: LoginData)=>void;
}

export const SignInCard: React.FC<Props>=({submitFn}) => {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const email=data.get('email') as string;
        const password=data.get('password') as string;
        console.log({
            email,
            password,
        });
        if (validateInputs(email,password)){
            submitFn({email,password});
        }
    };

    const validateInputs =
        (email:string, password:string) => {


            let isValid = true;

            if (!email || !/\S+@\S+\.\S+/.test(email)) {
                setEmailError(true);
                setEmailErrorMessage('Please enter a valid email address.');
                isValid = false;
            } else {
                setEmailError(false);
                setEmailErrorMessage('');
            }

            if (!password|| password.length < 6) {
                setPasswordError(true);
                setPasswordErrorMessage('Password must be at least 6 characters long.');
                isValid = false;
            } else {
                setPasswordError(false);
                setPasswordErrorMessage('');
            }

            return isValid;
        };



    return (
        (
            <Box
            >
                <Card
                    variant="outlined"
                    sx={{
                        width: '100%',
                        maxWidth: 420,
                        p: { xs: 3, sm: 4 },
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        backgroundColor: '#fffaf0',
                        border: '1px solid #dbcbb9',
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h4"
                        textAlign="center"
                        gutterBottom
                        sx={{
                            color: '#3e2723',
                            fontWeight: 'bold',
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                        }}
                    >
                        Sign in
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="email" sx={{ color: '#6e4d3c' }}>
                                Email
                            </FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailErrorMessage}
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={emailError ? 'error' : 'primary'}
                                sx={{
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                }}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="password" sx={{ color: '#6e4d3c' }}>
                                Password
                            </FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                id="password"
                                name="password"
                                placeholder="••••••"
                                type="password"
                                autoComplete="current-password"
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
                                sx={{
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                }}
                            />
                        </FormControl>

                        <FormControlLabel
                            control={<Checkbox value="remember" color="success" />}
                            label="Remember me"
                            sx={{ color: '#3e2723', fontSize: { xs: '0.85rem', sm: '1rem' } }}
                        />

                        {(passwordError || emailError) && (
                            <Alert
                                severity="error"
                                onClose={() => {
                                    setEmailError(false);
                                    setEmailErrorMessage('');
                                    setPasswordError(false);
                                    setPasswordErrorMessage('');
                                }}
                                sx={{
                                    mt: 2,
                                    backgroundColor: '#ffecec',
                                    color: '#c14444',
                                    border: '1px solid #e6b8b8',
                                    fontSize: { xs: '0.85rem', sm: '1rem' },
                                }}
                            >
                                ERROR! Wrong credentials! Try again!
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                backgroundColor: '#adc6a7',
                                color: '#3e2723',
                                fontWeight: 'bold',
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                '&:hover': {
                                    backgroundColor: '#9cb298',
                                },
                                py: { xs: 1, sm: 1.5 },
                            }}
                        >
                            Sign in
                        </Button>
                    </Box>

                    <Divider sx={{ my: { xs: 2, sm: 3 }, color: '#9f8772' }}>or</Divider>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => submitFn({ email: 'GOOGLE', password: '123456' })}
                            sx={{
                                borderColor: '#adc6a7',
                                color: '#3e2723',
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                py: { xs: 1, sm: 1.5 },
                                '&:hover': {
                                    backgroundColor: '#eef3ec',
                                    borderColor: '#9cb298',
                                },
                            }}
                        >
                            Sign in with Google
                        </Button>

                        <Typography
                            sx={{
                                textAlign: 'center',
                                color: '#6e4d3c',
                                fontSize: { xs: '0.85rem', sm: '1rem' },
                            }}
                        >
                            Don&apos;t have an account?{' '}
                            <Link
                                onClick={() => navigate('/signup')}
                                variant="body2"
                                sx={{
                                    color: '#9f8772',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    '&:hover': { textDecoration: 'underline' },
                                    fontSize: { xs: '0.85rem', sm: '1rem' },
                                }}
                            >
                                Sign up
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </Box>


    ));
}

export default SignInCard;
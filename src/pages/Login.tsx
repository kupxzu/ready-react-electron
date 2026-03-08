import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Flex, Card, Text, TextField, Button, Heading, Box, Container } from '@radix-ui/themes';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLocalError('');

        if (!email || !password) {
            setLocalError('Please fill in all fields');
            return;
        }

        try {
            await login(email, password);
        } catch (err: any) {
            setLocalError(err.message || 'Login failed');
        }
    };

    return (
        <Flex align="center" justify="center" style={{ minHeight: '100vh', backgroundColor: 'var(--gray-2)' }}>
            <Container size="1">
                <Card size="4" style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
                    <Flex direction="column" gap="5" p="4">
                        <Box>
                            <Heading as="h2" size="6" align="center" mb="2" weight="bold">
                                Sign In
                            </Heading>
                            <Text as="p" size="2" color="gray" align="center">
                                Enter your email and password to access your account
                            </Text>
                        </Box>
                        
                        {localError && (
                            <Box style={{ backgroundColor: 'var(--red-3)', padding: 'var(--space-2)', borderRadius: 'var(--radius-2)' }}>
                                <Text color="red" size="2" align="center" weight="medium" style={{ display: 'block' }}>
                                    {localError}
                                </Text>
                            </Box>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Flex direction="column" gap="4">
                                <Box>
                                    <Text as="div" size="2" mb="1" weight="medium">Email</Text>
                                    <TextField.Root 
                                        placeholder="name@example.com"
                                        size="3"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                    />
                                </Box>

                                <Box>
                                    <Flex justify="between" align="baseline" mb="1">
                                        <Text as="div" size="2" weight="medium">Password</Text>
                                    </Flex>
                                    <TextField.Root 
                                        type="password"
                                        placeholder="••••••••"
                                        size="3"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                    />
                                </Box>

                                <Button type="submit" size="3" mt="2" disabled={isLoading} style={{ width: '100%', cursor: 'pointer' }}>
                                    {isLoading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </Flex>
                        </form>
                    </Flex>
                </Card>
            </Container>
        </Flex>
    );
};

export default Login;



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
        <Flex align="center" justify="center" style={{ 
            minHeight: '100vh', 
            position: 'relative', 
            overflow: 'hidden', 
            backgroundColor: '#FFFFFF' // Clean White Background
        }}>
            {/* CSS Injection for Animations and Lines */}
            <style>{`
                @keyframes lineMove {
                    0% { stroke-dashoffset: 1000; opacity: 0; }
                    20% { opacity: 0.5; }
                    80% { opacity: 0.5; }
                    100% { stroke-dashoffset: 0; opacity: 0; }
                }

                .bg-lines-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                    overflow: hidden;
                }

                .animated-line {
                    stroke: #EAEAEA; /* Light Grey Line Color */
                    stroke-width: 1.5;
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 1000;
                    fill: none;
                    animation: lineMove 15s infinite linear;
                }
                
                /* Class to make the card semi-transparent against the lines */
                .glass-card {
                    backdrop-filter: blur(8px);
                    background: rgba(255, 255, 255, 0.9) !important;
                    border: 1px solid rgba(0, 0, 0, 0.05) !important;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.01) !important;
                }
            `}</style>

            {/* Animated Lines Background (Using SVG) */}
            <div className="bg-lines-container">
                <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    {/* Define different random-looking paths */}
                    <path d="M 10 10 Q 150 200 10 400 Q -100 600 200 800" className="animated-line" style={{ animationDuration: '20s', animationDelay: '-2s' }} />
                    <path d="M 500 100 Q 600 300 450 500 Q 300 700 600 900" className="animated-line" style={{ animationDuration: '25s', animationDelay: '-5s' }} />
                    <path d="M 1000 -100 Q 800 200 1100 400 Q 1400 600 1000 800" className="animated-line" style={{ animationDuration: '18s', animationDelay: '-10s' }} />
                    <path d="M 1500 0 Q 1300 150 1600 350 Q 1800 550 1500 750" className="animated-line" style={{ animationDuration: '22s', animationDelay: '-7s' }} />
                </svg>
            </div>

            <Container size="1" style={{ zIndex: 1 }}>
                <Card size="4" className="glass-card">
                    <Flex direction="column" gap="5" p="4">
                        <Box>
                            <Heading as="h2" size="6" align="center" mb="2" weight="bold" style={{ color: 'black' }}>
                                Sign In
                            </Heading>
                            <Text as="p" size="2" align="center" style={{ color: '#666666' }}>
                                Use your credentials to access the system
                            </Text>
                        </Box>
                        
                        {localError && (
                            <Box style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                <Text color="red" size="2" align="center" weight="medium" style={{ display: 'block' }}>
                                    {localError}
                                </Text>
                            </Box>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Flex direction="column" gap="4">
                                <Box>
                                    <Text as="div" size="2" mb="1" weight="medium" style={{ color: '#333333' }}>Email</Text>
                                    <TextField.Root 
                                        placeholder="name@example.com"
                                        size="3"
                                        variant="surface"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ backgroundColor: 'white', color: 'black' }}
                                    />
                                </Box>

                                <Box>
                                    <Text as="div" size="2" mb="1" weight="medium" style={{ color: '#333333' }}>Password</Text>
                                    <TextField.Root 
                                        type="password"
                                        placeholder="••••••••"
                                        size="3"
                                        variant="surface"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ backgroundColor: 'white', color: 'black' }}
                                    />
                                </Box>

                                <Button 
                                    type="submit" 
                                    size="3" 
                                    mt="2" 
                                    disabled={isLoading} 
                                    style={{ 
                                        width: '100%', 
                                        cursor: 'pointer',
                                        backgroundColor: 'black', // Black primary button for white theme
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {isLoading ? 'Processing...' : 'Login to Account'}
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
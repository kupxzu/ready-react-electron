import { Flex, Heading, Text, Button, Box } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGoHome = () => {
        if (user?.role === 'admin') {
            navigate('/admin');
        } else if (user?.role === 'client') {
            navigate('/client');
        } else {
            navigate('/');
        }
    };

    return (
        <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            style={{ 
                minHeight: '100vh', 
                backgroundColor: 'var(--gray-2)',
                padding: 'var(--space-4)'
            }}
        >
            <Box style={{ textAlign: 'center', maxWidth: '400px' }}>
                <Text 
                    size="9" 
                    weight="bold" 
                    style={{ 
                        color: 'var(--accent-9)', 
                        fontSize: '120px', 
                        lineHeight: 1,
                        marginBottom: '16px',
                        display: 'block'
                    }}
                >
                    404
                </Text>
                
                <Heading size="6" mb="2">Page Not Found</Heading>
                
                <Text size="3" color="gray" as="p" mb="6">
                    Sorry, the page you're looking for doesn't exist or has been moved.
                </Text>

                <Flex gap="3" justify="center" wrap="wrap">
                    <Button 
                        variant="soft" 
                        color="gray" 
                        onClick={() => navigate(-1)}
                        style={{ cursor: 'pointer' }}
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </Button>
                    <Button 
                        onClick={handleGoHome}
                        style={{ cursor: 'pointer' }}
                    >
                        <Home size={16} />
                        Go Home
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
};

export default NotFound;

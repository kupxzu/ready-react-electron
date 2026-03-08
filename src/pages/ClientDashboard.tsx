import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Flex, Heading, Button, Card, Grid, Text, Badge, Box, Container, Avatar } from '@radix-ui/themes';

const ClientDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'client') {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <Flex direction="column" minHeight="100vh" style={{ backgroundColor: 'var(--gray-2)' }}>
            <Box style={{ backgroundColor: 'white', borderBottom: '1px solid var(--gray-4)' }} py="3">
                <Container size="4">
                    <Flex justify="between" align="center">
                        <Flex gap="3" align="center">
                             <Avatar
                                size="3"
                                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                                fallback={user?.username?.[0]?.toUpperCase() || 'C'}
                            />
                            <Heading size="4">My Portal</Heading>
                        </Flex>
                        <Button color="red" variant="soft" onClick={logout}>
                            Sign Out
                        </Button>
                    </Flex>
                </Container>
            </Box>

            <Container size="4" pt="6">
                <Heading size="8" mb="2">Welcome back, {user?.username}!</Heading>
                <Text size="3" color="gray" mb="6" as="p">Here is what's happening today.</Text>

                <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="4">
                    <Card>
                        <Flex gap="3" align="center">
                            <Box>
                                <Text as="div" size="2" weight="bold">
                                    Current Plan
                                </Text>
                                <Text as="div" size="2" color="gray">
                                    Pro Subscription
                                </Text>
                            </Box>
                            <Badge color="green">Active</Badge>
                        </Flex>
                    </Card>
                    
                    <Card>
                         <Flex direction="column" gap="1">
                            <Text size="2" weight="bold">Messages</Text>
                            <Text size="6" weight="bold">3</Text>
                             <Text size="1" color="blue">Unread</Text>
                        </Flex>
                    </Card>

                    <Card>
                         <Flex direction="column" gap="1">
                            <Text size="2" weight="bold">Usage</Text>
                            <Text size="6" weight="bold">85%</Text>
                            <Text size="1" color="orange">Near limit</Text>
                        </Flex>
                    </Card>
                </Grid>

                <Box mt="6">
                   <Card size="3">
                        <Heading size="5" mb="4">My Recent Files</Heading>
                        <Flex direction="column" gap="3">
                            <Flex justify="between" align="center" style={{ borderBottom: '1px solid var(--gray-4)', paddingBottom: '8px' }}>
                                <Text weight="medium">Project_Alpha_v2.pdf</Text>
                                <Button size="1" variant="ghost">Download</Button>
                            </Flex>
                            <Flex justify="between" align="center" style={{ borderBottom: '1px solid var(--gray-4)', paddingBottom: '8px' }}>
                                <Text weight="medium">Invoice_#1024.pdf</Text>
                                <Button size="1" variant="ghost">Download</Button>
                            </Flex>
                            <Flex justify="between" align="center">
                                <Text weight="medium">Design_Assets.zip</Text>
                                <Button size="1" variant="ghost">Download</Button>
                            </Flex>
                        </Flex>
                   </Card>
                </Box>
            </Container>
        </Flex>
    );
};

export default ClientDashboard;


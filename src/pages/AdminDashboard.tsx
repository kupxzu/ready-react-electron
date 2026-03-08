import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Flex, Heading, Button, Card, Grid, Text, Separator, Box, Container } from '@radix-ui/themes';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <Flex direction="column" minHeight="100vh">
            <header style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--gray-5)' }}>
                <Container size="4">
                    <Flex justify="between" align="center">
                        <Heading size="5">Admin Console</Heading>
                        <Flex gap="3" align="center">
                            <Text size="2" color="gray">Logged in as {user?.username}</Text>
                            <Button variant="soft" color="gray" onClick={logout}>
                                Logout
                            </Button>
                        </Flex>
                    </Flex>
                </Container>
            </header>

            <Box p="5" style={{ flex: 1, backgroundColor: 'var(--gray-2)' }}>
                <Container size="4">
                    <Heading size="8" mb="5">Dashboard Overview</Heading>
                    
                    <Grid columns={{ initial: '1', md: '3' }} gap="4" width="auto">
                        <Card size="2">
                            <Flex direction="column" gap="1">
                                <Text size="2" weight="bold" color="gray">Total Users</Text>
                                <Heading size="7">1,240</Heading>
                                <Text size="1" color="green">+12% from last month</Text>
                            </Flex>
                        </Card>
                        <Card size="2">
                            <Flex direction="column" gap="1">
                                <Text size="2" weight="bold" color="gray">Active Sessions</Text>
                                <Heading size="7">56</Heading>
                                <Text size="1" color="gray">Currently online</Text>
                            </Flex>
                        </Card>
                        <Card size="2">
                            <Flex direction="column" gap="1">
                                <Text size="2" weight="bold" color="gray">System Status</Text>
                                <Heading size="7" color="green">Healthy</Heading>
                                <Text size="1" color="gray">All systems operational</Text>
                            </Flex>
                        </Card>
                    </Grid>

                    <Separator my="5" size="4" />

                    <Grid columns={{ initial: '1', md: '2' }} gap="5">
                        <Card>
                            <Heading size="4" mb="3">Recent Activity</Heading>
                            <Flex direction="column" gap="3">
                                <Flex justify="between">
                                    <Text size="2">New user registration</Text>
                                    <Text size="2" color="gray">2m ago</Text>
                                </Flex>
                                <Separator size="4" />
                                <Flex justify="between">
                                    <Text size="2">System update completed</Text>
                                    <Text size="2" color="gray">1h ago</Text>
                                </Flex>
                                <Separator size="4" />
                                <Flex justify="between">
                                    <Text size="2">Backup successful</Text>
                                    <Text size="2" color="gray">4h ago</Text>
                                </Flex>
                            </Flex>
                        </Card>

                        <Card>
                            <Heading size="4" mb="3">Quick Actions</Heading>
                            <Flex gap="3" wrap="wrap">
                                <Button>Add User</Button>
                                <Button variant="soft">View Reports</Button>
                                <Button variant="outline">Settings</Button>
                            </Flex>
                        </Card>
                    </Grid>
                </Container>
            </Box>
        </Flex>
    );
};

export default AdminDashboard;


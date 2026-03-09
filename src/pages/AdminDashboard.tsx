import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Flex, Heading, Button, Card, Grid, Text, Box, Badge } from '@radix-ui/themes';
import DashboardLayout from '../components/DashboardLayout';
import { Users, Activity, Server, UserPlus, FileBarChart, Settings, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            navigate('/');
        }
    }, [user, isLoading, navigate]);

    if (isLoading) {
        return (
            <Flex justify="center" align="center" style={{ height: '100vh' }}>
                <Box className="spinner" style={{ width: 24, height: 24, border: '2px solid var(--gray-4)', borderTopColor: 'var(--accent-9)', borderRadius: '50%' }} />
            </Flex>
        );
    }

    return (
        <DashboardLayout>
            <Box>
                <Flex direction={{ initial: 'column', sm: 'row' }} justify="between" align={{ initial: 'start', sm: 'center' }} gap="3" mb="6">
                    <Box>
                        <Heading size={{ initial: '6', sm: '7' }}>Dashboard</Heading>
                        <Text size="2" color="gray">Welcome back, {user?.username}</Text>
                    </Box>
                    <Button style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/users')}>
                        <UserPlus size={16} />
                        Add User
                    </Button>
                </Flex>
                
                <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="4" mb="6">
                    <Card className="hover-card" style={{ backgroundColor: 'white' }}>
                        <Flex justify="between" align="start">
                            <Flex direction="column" gap="1">
                                <Text size="2" color="gray">Total Users</Text>
                                <Heading size="6">1,240</Heading>
                                <Flex align="center" gap="1">
                                    <TrendingUp size={12} color="var(--green-9)" />
                                    <Text size="1" color="green">+12%</Text>
                                </Flex>
                            </Flex>
                            <Box p="2" style={{ backgroundColor: 'var(--iris-a3)', borderRadius: '10px' }}>
                                <Users size={20} color="var(--iris-9)" />
                            </Box>
                        </Flex>
                    </Card>

                    <Card className="hover-card" style={{ backgroundColor: 'white' }}>
                        <Flex justify="between" align="start">
                            <Flex direction="column" gap="1">
                                <Text size="2" color="gray">Active Sessions</Text>
                                <Heading size="6">56</Heading>
                                <Text size="1" color="gray">Live now</Text>
                            </Flex>
                            <Box p="2" style={{ backgroundColor: 'var(--green-a3)', borderRadius: '10px' }}>
                                <Activity size={20} color="var(--green-9)" />
                            </Box>
                        </Flex>
                    </Card>

                    <Card className="hover-card" style={{ backgroundColor: 'white' }}>
                        <Flex justify="between" align="start">
                            <Flex direction="column" gap="1">
                                <Text size="2" color="gray">System Status</Text>
                                <Heading size="6">Healthy</Heading>
                                <Badge color="green" size="1">Operational</Badge>
                            </Flex>
                            <Box p="2" style={{ backgroundColor: 'var(--green-a3)', borderRadius: '10px' }}>
                                <Server size={20} color="var(--green-9)" />
                            </Box>
                        </Flex>
                    </Card>
                </Grid>

                <Grid columns={{ initial: '1', lg: '2' }} gap="4">
                    <Card style={{ backgroundColor: 'white' }}>
                        <Heading size="4" mb="4">Recent Activity</Heading>
                        <Flex direction="column" gap="3">
                            {[
                                { text: 'New user registration', time: '2m ago', color: 'green' },
                                { text: 'System update completed', time: '1h ago', color: 'blue' },
                                { text: 'Backup successful', time: '4h ago', color: 'gray' },
                                { text: 'Security scan completed', time: '6h ago', color: 'gray' },
                            ].map((item, i) => (
                                <Flex key={i} justify="between" align="center" py="2" style={{ borderBottom: i < 3 ? '1px solid var(--gray-4)' : 'none' }}>
                                    <Flex align="center" gap="3">
                                        <Box style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: `var(--${item.color}-9)` }} />
                                        <Text size="2">{item.text}</Text>
                                    </Flex>
                                    <Text size="1" color="gray">{item.time}</Text>
                                </Flex>
                            ))}
                        </Flex>
                    </Card>

                    <Card style={{ backgroundColor: 'white' }}>
                        <Heading size="4" mb="4">Quick Actions</Heading>
                        <Grid columns="2" gap="3">
                            <Button variant="soft" style={{ cursor: 'pointer', height: '60px' }} onClick={() => navigate('/admin/users')}>
                                <Flex direction="column" align="center" gap="1">
                                    <UserPlus size={18} />
                                    <Text size="1">Add User</Text>
                                </Flex>
                            </Button>
                            <Button variant="soft" color="gray" style={{ cursor: 'pointer', height: '60px' }} onClick={() => navigate('/admin/reports')}>
                                <Flex direction="column" align="center" gap="1">
                                    <FileBarChart size={18} />
                                    <Text size="1">Reports</Text>
                                </Flex>
                            </Button>
                            <Button variant="soft" color="gray" style={{ cursor: 'pointer', height: '60px' }} onClick={() => navigate('/admin/settings')}>
                                <Flex direction="column" align="center" gap="1">
                                    <Settings size={18} />
                                    <Text size="1">Settings</Text>
                                </Flex>
                            </Button>
                            <Button variant="soft" color="gray" style={{ cursor: 'pointer', height: '60px' }}>
                                <Flex direction="column" align="center" gap="1">
                                    <Server size={18} />
                                    <Text size="1">System</Text>
                                </Flex>
                            </Button>
                        </Grid>
                    </Card>
                </Grid>
            </Box>
        </DashboardLayout>
    );
};

export default AdminDashboard;


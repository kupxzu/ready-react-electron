import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { 
    Flex, Heading, Button, Card, Text, Box, Table, Badge, 
    Dialog, TextField, IconButton, AlertDialog
} from '@radix-ui/themes';
import DashboardLayout from '../components/DashboardLayout';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { UserPlus, Pencil, Trash2, Search, RefreshCw } from 'lucide-react';

interface Client {
    id: number;
    name: string;
    email: string;
    created_at: string;
    username?: string;
}

const UsersPage = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            navigate('/');
        }
    }, [user, isLoading, navigate]);

    const fetchClients = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/clients');
            setClients(response.data.clients || []);
        } catch (error) {
            showToast('Failed to fetch clients', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchClients();
        }
    }, [user, fetchClients]);

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', password_confirmation: '' });
    };

    const handleAddClient = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            showToast('Please fill all required fields', 'warning');
            return;
        }
        if (formData.password !== formData.password_confirmation) {
            showToast('Passwords do not match', 'warning');
            return;
        }

        try {
            setFormLoading(true);
            await api.post('/admin/clients', formData);
            showToast('Client created successfully', 'success');
            setAddDialogOpen(false);
            resetForm();
            fetchClients();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to create client', 'error');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditClient = async () => {
        if (!selectedClient) return;

        const updateData: any = {};
        if (formData.name) updateData.name = formData.name;
        if (formData.email) updateData.email = formData.email;
        if (formData.password) {
            updateData.password = formData.password;
            updateData.password_confirmation = formData.password_confirmation;
        }

        try {
            setFormLoading(true);
            await api.put(`/admin/clients/${selectedClient.id}`, updateData);
            showToast('Client updated successfully', 'success');
            setEditDialogOpen(false);
            resetForm();
            setSelectedClient(null);
            fetchClients();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to update client', 'error');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClient = async () => {
        if (!selectedClient) return;

        try {
            setFormLoading(true);
            await api.delete(`/admin/clients/${selectedClient.id}`);
            showToast('Client deleted successfully', 'success');
            setDeleteDialogOpen(false);
            setSelectedClient(null);
            fetchClients();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to delete client', 'error');
        } finally {
            setFormLoading(false);
        }
    };

    const openEditDialog = (client: Client) => {
        setSelectedClient(client);
        setFormData({
            name: client.name,
            email: client.email,
            password: '',
            password_confirmation: ''
        });
        setEditDialogOpen(true);
    };

    const openDeleteDialog = (client: Client) => {
        setSelectedClient(client);
        setDeleteDialogOpen(true);
    };

    const filteredClients = clients.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        <Heading size={{ initial: '6', sm: '7' }}>Users</Heading>
                        <Text size="2" color="gray">Manage client accounts</Text>
                    </Box>
                    <Button style={{ cursor: 'pointer' }} onClick={() => { resetForm(); setAddDialogOpen(true); }}>
                        <UserPlus size={16} />
                        Add User
                    </Button>
                </Flex>

                <Card style={{ backgroundColor: 'white' }}>
                    <Flex justify="between" align="center" mb="4" gap="3" wrap="wrap">
                        <Flex align="center" gap="2" style={{ flex: 1, maxWidth: '300px' }}>
                            <TextField.Root 
                                placeholder="Search users..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ flex: 1 }}
                            >
                                <TextField.Slot>
                                    <Search size={14} color="var(--gray-9)" />
                                </TextField.Slot>
                            </TextField.Root>
                        </Flex>
                        <IconButton variant="ghost" color="gray" onClick={fetchClients} style={{ cursor: 'pointer' }}>
                            <RefreshCw size={16} />
                        </IconButton>
                    </Flex>

                    {loading ? (
                        <Flex justify="center" py="6">
                            <Box className="spinner" style={{ width: 24, height: 24, border: '2px solid var(--gray-4)', borderTopColor: 'var(--accent-9)', borderRadius: '50%' }} />
                        </Flex>
                    ) : filteredClients.length === 0 ? (
                        <Flex justify="center" py="6">
                            <Text color="gray">No users found</Text>
                        </Flex>
                    ) : (
                        <Box style={{ overflowX: 'auto' }}>
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {filteredClients.map((client) => (
                                        <Table.Row key={client.id}>
                                            <Table.Cell>
                                                <Text weight="medium">{client.name}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text color="gray">{client.email}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge color="green">Active</Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text size="1" color="gray">
                                                    {new Date(client.created_at).toLocaleDateString()}
                                                </Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Flex gap="2">
                                                    <IconButton 
                                                        variant="ghost" 
                                                        color="gray" 
                                                        size="1"
                                                        onClick={() => openEditDialog(client)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <Pencil size={14} />
                                                    </IconButton>
                                                    <IconButton 
                                                        variant="ghost" 
                                                        color="red" 
                                                        size="1"
                                                        onClick={() => openDeleteDialog(client)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </IconButton>
                                                </Flex>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    )}
                </Card>
            </Box>

            {/* Add User Dialog */}
            <Dialog.Root open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Add New User</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        Create a new client account.
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1" weight="medium">Name *</Text>
                            <TextField.Root 
                                placeholder="Enter name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="medium">Email *</Text>
                            <TextField.Root 
                                type="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="medium">Password *</Text>
                            <TextField.Root 
                                type="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="medium">Confirm Password *</Text>
                            <TextField.Root 
                                type="password"
                                placeholder="Confirm password"
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                            />
                        </label>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray" style={{ cursor: 'pointer' }}>Cancel</Button>
                        </Dialog.Close>
                        <Button onClick={handleAddClient} disabled={formLoading} style={{ cursor: 'pointer' }}>
                            {formLoading ? 'Creating...' : 'Create User'}
                        </Button>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>

            {/* Edit User Dialog */}
            <Dialog.Root open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Edit User</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        Update client account details.
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1" weight="medium">Name</Text>
                            <TextField.Root 
                                placeholder="Enter name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="medium">Email</Text>
                            <TextField.Root 
                                type="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="medium">New Password (leave blank to keep current)</Text>
                            <TextField.Root 
                                type="password"
                                placeholder="Enter new password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </label>
                        {formData.password && (
                            <label>
                                <Text as="div" size="2" mb="1" weight="medium">Confirm New Password</Text>
                                <TextField.Root 
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={formData.password_confirmation}
                                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                />
                            </label>
                        )}
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray" style={{ cursor: 'pointer' }}>Cancel</Button>
                        </Dialog.Close>
                        <Button onClick={handleEditClient} disabled={formLoading} style={{ cursor: 'pointer' }}>
                            {formLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>

            {/* Delete Confirmation Dialog */}
            <AlertDialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialog.Content maxWidth="450px">
                    <AlertDialog.Title>Delete User</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                        Are you sure you want to delete <strong>{selectedClient?.name}</strong>? This action cannot be undone.
                    </AlertDialog.Description>

                    <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel>
                            <Button variant="soft" color="gray" style={{ cursor: 'pointer' }}>Cancel</Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button color="red" onClick={handleDeleteClient} disabled={formLoading} style={{ cursor: 'pointer' }}>
                                {formLoading ? 'Deleting...' : 'Delete User'}
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </DashboardLayout>
    );
};

export default UsersPage;

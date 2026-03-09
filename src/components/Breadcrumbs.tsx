import { Link, useLocation } from 'react-router-dom';
import { Flex, Text } from '@radix-ui/themes';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Breadcrumbs = () => {
    const location = useLocation();
    const { user } = useAuth();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) return null;

    // Determine home path based on user role
    const homePath = user?.role === 'admin' ? '/admin' : '/client';

    return (
        <Flex align="center" gap="2">
            <Link to={homePath} style={{ textDecoration: 'none' }}>
                <Text size="2" color="gray" style={{ cursor: 'pointer' }}>Home</Text>
            </Link>
            
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const name = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

                return (
                    <Flex align="center" gap="2" key={to}>
                        <ChevronRight size={12} color="var(--gray-8)" />
                        {isLast ? (
                            <Text size="2" weight="medium">{name}</Text>
                        ) : (
                            <Link to={to} style={{ textDecoration: 'none' }}>
                                <Text size="2" color="gray" style={{ cursor: 'pointer' }}>{name}</Text>
                            </Link>
                        )}
                    </Flex>
                );
            })}
        </Flex>
    );
};

export default Breadcrumbs;

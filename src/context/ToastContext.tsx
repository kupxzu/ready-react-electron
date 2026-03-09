import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Box, IconButton, Callout } from '@radix-ui/themes';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Box style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                zIndex: 9999,
                maxWidth: '400px',
                width: '100%'
            }}>
                {toasts.map((toast) => (
                    <Callout.Root key={toast.id} color={getColor(toast.type)} style={{ boxShadow: 'var(--shadow-3)' }}>
                        <Callout.Icon>
                            {getIcon(toast.type)}
                        </Callout.Icon>
                        <Callout.Text>
                            {toast.message}
                        </Callout.Text>
                        <IconButton 
                            size="1" 
                            variant="ghost" 
                            color="gray" 
                            onClick={() => removeToast(toast.id)}
                            style={{ marginLeft: 'auto' }}
                        >
                            <X size={14} />
                        </IconButton>
                    </Callout.Root>
                ))}
            </Box>
        </ToastContext.Provider>
    );
};

const getColor = (type: ToastType) => {
    switch (type) {
        case 'success': return 'green';
        case 'error': return 'red';
        case 'warning': return 'orange';
        default: return 'blue';
    }
};

const getIcon = (type: ToastType) => {
    switch (type) {
        case 'success': return <CheckCircle size={16} />;
        case 'error': return <AlertTriangle size={16} />;
        case 'warning': return <AlertTriangle size={16} />; // Reuse alert for now or find warning
        default: return <Info size={16} />;
    }
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

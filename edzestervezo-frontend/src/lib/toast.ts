import { toast } from '@zerodevx/svelte-toast';

export const successToast = (message: string) => toast.push(message, {
    theme: {
        '--toastBackground': '#48BB78',
        '--toastBarBackground': '#2F855A',
    },
    duration: 3000
});

export const errorToast = (message: string) => toast.push(message, {
    theme: {
        '--toastBackground': '#F56565',
        '--toastBarBackground': '#C53030',
    },
    duration: 3000
});
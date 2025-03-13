import { writable } from 'svelte/store';


export const isLoggedIn = writable(false);


if (typeof window !== 'undefined') { 
    const savedState = localStorage.getItem('isLoggedIn');
    if (savedState === 'true') {
        isLoggedIn.set(true);
    } else {
        isLoggedIn.set(false);
    }

    isLoggedIn.subscribe(value => {
        localStorage.setItem('isLoggedIn', value ? 'true' : 'false');
    });
}

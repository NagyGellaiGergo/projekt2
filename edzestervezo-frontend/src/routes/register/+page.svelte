<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let name = '';
    let email = '';
    let password = '';
    let password_confirmation = '';
    let errorMessage = '';

    async function register() {
        errorMessage = '';
        try {
            await fetch('http://localhost:8000/sanctum/csrf-cookie', {
                method: 'GET',
                credentials: 'include'
            });

            const csrfCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='));

            const csrfToken = csrfCookie
                ? decodeURIComponent(csrfCookie.split('=')[1])
                : '';

            if (!csrfToken) {
                errorMessage = 'CSRF token nem található';
                return;
            }

            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation
                })
            });


            if (response.ok) {

                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                }

                goto('/login');
            } else {
                // Hiba esetén
                const contentType = response.headers.get('content-type');
                console.log('Hiba Content-Type:', contentType);

                if (contentType && contentType.includes('application/json')) {
                    try {
                        const errorData = await response.json();
                        console.log('Hiba adatok:', errorData);

                        if (errorData.errors) {

                            const errorMessages = Object.values(errorData.errors)
                                .flat()
                                .join(', ');
                            errorMessage = errorMessages;
                        } else {
                            errorMessage = errorData.message || 'Regisztráció sikertelen';
                        }
                    } catch (parseError) {
                        console.error('JSON parse hiba:', parseError);
                        errorMessage = `Hiba történt a válasz feldolgozása során: ${response.status}`;
                    }
                } else {
                    // Ha nincs JSON válasz
                    const textResponse = await response.text();
                    console.log('Szöveges válasz:', textResponse);
                    errorMessage = `Hiba történt a regisztráció során: ${response.status} ${response.statusText}`;
                }
            }
        } catch (error) {
            console.error('Kérés hiba:', error);
            errorMessage = 'Hálózati hiba történt';
        }
    }
</script>

<div class="register-container">
    <h2>Regisztráció</h2>
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
    <form on:submit|preventDefault={register}>
        <label for="name">Név:</label>
        <input id="name" type="text" bind:value={name} required />

        <label for="email">Email:</label>
        <input id="email" type="email" bind:value={email} required />

        <label for="password">Jelszó:</label>
        <input id="password" type="password" bind:value={password} required />

        <label for="password_confirmation">Jelszó megerősítés:</label>
        <input id="password_confirmation" type="password" bind:value={password_confirmation} required />

        <button type="submit">Regisztráció</button>
    </form>

    <p>Már van fiókod? <a href="/login">Jelentkezz be!</a></p>
</div>

<style>
    .register-container {
        max-width: 400px;
        margin: auto;
        padding: 20px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h2 { text-align: center; }
    label { display: block; margin-top: 10px; }
    input {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    button {
        width: 100%;
        padding: 10px;
        margin-top: 15px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    button:hover { background: #0056b3; }
    .error { color: red; text-align: center; }
</style>
<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let name = '';
    let email = '';
    let password = '';
    let password_confirmation = '';
    let errorMessage = '';

    async function register() {
        errorMessage = ''; // Hibaüzenet törlése
        try {
            // 1. CSRF token lekérése
            await fetch('http://localhost:8000/sanctum/csrf-cookie', {
                method: 'GET',
                credentials: 'include' // Sütik küldése a kéréssel
            });

            // 2. CSRF token kiolvasása a sütiből
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            // 3. Regisztrációs kérés
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken // CSRF token hozzáadása
                },
                credentials: 'include', // Sütik küldése a kéréssel
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation
                })
            });

            // 4. Válasz feldolgozása
            if (response.ok) {
                const data = await response.json();
                console.log('Sikeres regisztráció!', data);
                goto('/login'); // Átirányítás a login oldalra
            } else {
                const data = await response.json();
                errorMessage = data.message || 'Regisztráció sikertelen';
            }
        } catch (error) {
            errorMessage = 'Hálózati hiba történt';
            console.error(error);
        }
    }
</script>

<div class="register-container">
    <h2>Regisztráció</h2>
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
    <form on:submit|preventDefault={register}>
        <label>Név:</label>
        <input type="text" bind:value={name} required />

        <label>Email:</label>
        <input type="email" bind:value={email} required />

        <label>Jelszó:</label>
        <input type="password" bind:value={password} required />

        <label>Jelszó megerősítés:</label>
        <input type="password" bind:value={password_confirmation} required />

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
